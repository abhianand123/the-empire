import { WorldConfig, SceneMeta } from './types';

export interface ScrubControllerOptions {
  viewportElement: HTMLElement;
  progressBarElement: HTMLElement;
  progressFillElement: HTMLElement;
  sceneNodesContainer: HTMLElement;
  ambientGlowElement: HTMLElement;
  onSceneChange?: (sceneIndex: number, scene: SceneMeta) => void;
  onProgressChange?: (progress: number) => void;
}

interface SceneMediaBundle {
  container: HTMLElement;
  video: HTMLVideoElement;
  still: HTMLImageElement;
  blobUrl: string | null;
  isReady: boolean;
  targetTime: number;
  lastSeekTime: number;
  pendingSeekTime: number | null;
}

export class ScrubController {
  private options: ScrubControllerOptions;
  private currentWorld: WorldConfig | null = null;
  private mediaBundles: SceneMediaBundle[] = [];

  // Progression state
  private progress: number = 0; // Current lerped progress [0, 1]
  private targetProgress: number = 0; // Target progress from scroll [0, 1]
  private currentSceneIndex: number = 0;
  private isAutoGliding: boolean = false;
  private autoGlideSpeed: number = 0.025; // Normalized progress per second

  // Animation frame
  private animFrameId: number | null = null;
  private lastFrameTime: number = performance.now();

  // Mobile decoder priming & seek coalescing
  private isDecoderPrimed: boolean = false;
  private isMobileDevice: boolean = false;
  private isUserScrolling: boolean = false;
  private scrollDebounceTimer: number | null = null;
  private abortControllers: AbortController[] = [];

  constructor(options: ScrubControllerOptions) {
    this.options = options;
    this.isMobileDevice = this.checkMobile();
    this.initInputListeners();
    this.initDecoderPriming();
    this.startAnimationLoop();
  }

  private checkMobile(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 768px)').matches ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 1))
    );
  }

  public loadWorld(world: WorldConfig, resetScroll: boolean = true) {
    this.currentWorld = world;
    this.updateThemeTokens(world);

    if (resetScroll) {
      this.progress = 0;
      this.targetProgress = 0;
      this.currentSceneIndex = 0;
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    } else {
      this.syncScrollToProgress();
    }

    this.cleanupCurrentMedia();
    this.renderWorldScenes(world);
    this.renderSceneNodes(world);
    this.updateProgressUI();
  }

  private updateThemeTokens(world: WorldConfig) {
    const root = document.documentElement;
    root.style.setProperty('--world-accent', world.accentColor);
    root.style.setProperty('--world-accent-secondary', world.secondaryColor || world.accentColor);
    root.style.setProperty('--world-accent-glow', `${world.accentColor}33`);
    root.style.setProperty('--world-accent-dim', `${world.accentColor}1A`);
    root.style.setProperty('--theme-border-active', `${world.accentColor}4D`);

    if (this.options.ambientGlowElement) {
      this.options.ambientGlowElement.style.background = `radial-gradient(circle at 50% 50%, ${world.accentColor}26 0%, transparent 70%)`;
    }
  }

  private cleanupCurrentMedia() {
    this.abortControllers.forEach((ctrl) => ctrl.abort());
    this.abortControllers = [];

    this.mediaBundles.forEach((bundle) => {
      try {
        bundle.video.pause();
        bundle.video.removeAttribute('src');
        bundle.video.load();
      } catch (_) {}
      if (bundle.blobUrl) {
        URL.revokeObjectURL(bundle.blobUrl);
      }
    });
    this.mediaBundles = [];
  }

  private renderWorldScenes(world: WorldConfig) {
    const viewport = this.options.viewportElement;
    viewport.innerHTML = '';
    this.mediaBundles = [];

    world.scenes.forEach((scene, index) => {
      const container = document.createElement('div');
      container.className = `scene-container ${index === 0 ? 'active' : ''}`;
      container.dataset.sceneIndex = index.toString();

      // 1. Still Image (Zero-latency visual backup)
      const img = document.createElement('img');
      img.className = 'scene-media scene-still';
      img.src = scene.assetPaths.stillDist;
      img.alt = scene.title;
      img.loading = 'eager';

      // 2. Video Element (Hardware-accelerated scrubbed video)
      const video = document.createElement('video');
      video.className = 'scene-media scene-video';
      video.muted = true;
      video.playsInline = true;
      video.autoplay = false;
      video.preload = 'auto';
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');

      const bundle: SceneMediaBundle = {
        container,
        video,
        still: img,
        blobUrl: null,
        isReady: false,
        targetTime: 0,
        lastSeekTime: 0,
        pendingSeekTime: null,
      };

      // Video state listeners
      video.addEventListener('loadedmetadata', () => {
        bundle.isReady = true;
        if (index === 0) {
          video.currentTime = 0;
        }
        if (this.isDecoderPrimed) {
          this.primeSingleVideo(video);
        }
      });

      video.addEventListener('seeked', () => {
        video.classList.add('ready');
        bundle.lastSeekTime = performance.now();
        if (bundle.pendingSeekTime !== null) {
          const nextTarget = bundle.pendingSeekTime;
          bundle.pendingSeekTime = null;
          if (Math.abs(video.currentTime - nextTarget) > (this.isMobileDevice ? 0.03 : 0.008)) {
            try {
              if (typeof (video as any).fastSeek === 'function') {
                (video as any).fastSeek(nextTarget);
              } else {
                video.currentTime = nextTarget;
              }
            } catch (_) {}
          }
        }
      });

      video.addEventListener('loadeddata', () => {
        try {
          video.pause();
        } catch (_) {}
        if (this.isDecoderPrimed) {
          this.primeSingleVideo(video);
        }
      });

      container.appendChild(img);
      container.appendChild(video);
      viewport.appendChild(container);

      this.mediaBundles.push(bundle);

      // Prefetch video as Blob for instant seek without network byte-range stalls
      this.prefetchVideoBlob(scene.assetPaths.videoDist, bundle);
    });
  }

  private prefetchVideoBlob(videoUrl: string, bundle: SceneMediaBundle) {
    const abortCtrl = new AbortController();
    this.abortControllers.push(abortCtrl);

    // Initial fallback direct src in case blob takes a moment
    bundle.video.src = videoUrl;

    fetch(videoUrl, { signal: abortCtrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        bundle.blobUrl = objectUrl;
        bundle.video.src = objectUrl;
        bundle.video.load();
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Keep fallback direct source if blob fetch failed
          bundle.video.src = videoUrl;
        }
      });
  }

  private initDecoderPriming() {
    const onFirstUserGesture = () => {
      if (this.isDecoderPrimed) return;
      this.isDecoderPrimed = true;
      this.mediaBundles.forEach((b) => this.primeSingleVideo(b.video));

      window.removeEventListener('pointerdown', onFirstUserGesture);
      window.removeEventListener('touchstart', onFirstUserGesture);
      window.removeEventListener('scroll', onFirstUserGesture);
    };

    window.addEventListener('pointerdown', onFirstUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstUserGesture, { once: true, passive: true });
    window.addEventListener('scroll', onFirstUserGesture, { once: true, passive: true });
  }

  private primeSingleVideo(video: HTMLVideoElement) {
    if (!video) return;
    try {
      const playPromise = video.play();
      if (playPromise && playPromise.then) {
        playPromise
          .then(() => {
            try {
              video.pause();
            } catch (_) {}
          })
          .catch(() => {});
      }
    } catch (_) {}
  }

  private renderSceneNodes(world: WorldConfig) {
    const container = this.options.sceneNodesContainer;
    container.innerHTML = '';

    world.scenes.forEach((scene, idx) => {
      const node = document.createElement('button');
      node.className = `scene-node ${idx === 0 ? 'active' : ''}`;
      node.dataset.sceneIndex = idx.toString();
      node.innerHTML = `
        <span class="node-number">0${idx + 1}</span>
        <span class="node-label">${scene.title}</span>
      `;

      node.addEventListener('click', (e) => {
        e.stopPropagation();
        this.jumpToScene(idx);
      });

      container.appendChild(node);
    });
  }

  public jumpToScene(sceneIndex: number) {
    this.isAutoGliding = false;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const totalScenes = this.currentWorld ? this.currentWorld.scenes.length : 4;
    const sceneSpan = 1 / totalScenes;
    const targetRatio = Math.min(1, Math.max(0, sceneIndex * sceneSpan + sceneSpan * 0.35));

    window.scrollTo({
      top: targetRatio * maxScroll,
      behavior: 'smooth',
    });
  }

  public toggleAutoGlide(): boolean {
    this.isAutoGliding = !this.isAutoGliding;
    return this.isAutoGliding;
  }

  public getProgress(): number {
    return this.progress;
  }

  public getCurrentScene(): number {
    return this.currentSceneIndex;
  }

  private syncScrollToProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  private initInputListeners() {
    // 1. Native Window Scroll Listener
    window.addEventListener(
      'scroll',
      () => {
        if (!this.isAutoGliding) {
          this.syncScrollToProgress();
        }

        this.isUserScrolling = true;
        if (this.scrollDebounceTimer) {
          clearTimeout(this.scrollDebounceTimer);
        }
        this.scrollDebounceTimer = window.setTimeout(() => {
          this.isUserScrolling = false;
        }, 120);
      },
      { passive: true }
    );

    // 2. Interactive Progress Bar Click / Drag
    const progressBar = this.options.progressBarElement;
    let isScrubbingBar = false;

    const handleBarScrub = (clientX: number) => {
      const rect = progressBar.getBoundingClientRect();
      const clickRatio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      this.isAutoGliding = false;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({
        top: clickRatio * maxScroll,
        behavior: 'auto',
      });
    };

    progressBar.addEventListener('mousedown', (e) => {
      isScrubbingBar = true;
      handleBarScrub(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isScrubbingBar) {
        handleBarScrub(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isScrubbingBar = false;
    });

    progressBar.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          isScrubbingBar = true;
          handleBarScrub(e.touches[0].clientX);
        }
      },
      { passive: true }
    );

    progressBar.addEventListener(
      'touchmove',
      (e) => {
        if (isScrubbingBar && e.touches.length === 1) {
          handleBarScrub(e.touches[0].clientX);
        }
      },
      { passive: true }
    );

    progressBar.addEventListener('touchend', () => {
      isScrubbingBar = false;
    });

    // 3. Spacebar Toggle Auto-Glide
    window.addEventListener('keydown', (e) => {
      if (
        e.key === ' ' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        this.toggleAutoGlide();
      }
    });
  }

  private startAnimationLoop() {
    const update = (now: number) => {
      const deltaSec = Math.min(0.1, (now - this.lastFrameTime) / 1000);
      this.lastFrameTime = now;

      // Handle Auto-Glide Mode
      if (this.isAutoGliding) {
        this.targetProgress += this.autoGlideSpeed * deltaSec;
        if (this.targetProgress >= 1) {
          this.targetProgress = 0;
          this.progress = 0;
        }

        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({
          top: this.targetProgress * maxScroll,
          behavior: 'auto',
        });
      }

      // Smooth Lerp Interpolation
      const lerpFactor = this.isUserScrolling ? 0.22 : 0.12;
      this.progress += (this.targetProgress - this.progress) * lerpFactor;

      // Sync background video frames and crossfades
      this.syncScenesToProgress();
      this.updateProgressUI();

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  private syncScenesToProgress() {
    if (!this.currentWorld || this.mediaBundles.length === 0) return;

    const scenes = this.currentWorld.scenes;
    const numScenes = scenes.length;
    const sceneSpan = 1 / numScenes;

    // Determine current scene index
    const activeIndex = Math.min(numScenes - 1, Math.max(0, Math.floor(this.progress / sceneSpan)));

    if (activeIndex !== this.currentSceneIndex) {
      this.currentSceneIndex = activeIndex;
      if (this.options.onSceneChange) {
        this.options.onSceneChange(activeIndex, scenes[activeIndex]);
      }
    }

    const eps = this.isMobileDevice ? 0.03 : 0.008;

    // Crossfade & Video Seek across all scenes
    this.mediaBundles.forEach((bundle, i) => {
      const sceneStart = i * sceneSpan;
      const sceneEnd = (i + 1) * sceneSpan;
      const { container } = bundle;

      if (this.progress >= sceneStart && this.progress <= sceneEnd) {
        // Active Scene
        container.classList.add('active');
        container.classList.remove('transitioning');
        container.style.opacity = '1';

        const localT = Math.min(0.999, Math.max(0, (this.progress - sceneStart) / sceneSpan));
        this.applyVideoSeek(bundle, localT, eps);
      } else if (i === activeIndex + 1 && this.progress > sceneStart - 0.1) {
        // Blending into next scene
        container.classList.remove('active');
        container.classList.add('transitioning');
        const blend = (this.progress - (sceneStart - 0.1)) / 0.1;
        container.style.opacity = Math.min(1, Math.max(0, blend)).toFixed(3);
        if (!this.isMobileDevice) {
          this.applyVideoSeek(bundle, 0, eps);
        }
      } else {
        // Inactive Scene
        container.classList.remove('active', 'transitioning');
        container.style.opacity = '0';
      }
    });

    if (this.options.onProgressChange) {
      this.options.onProgressChange(this.progress);
    }
  }

  private applyVideoSeek(bundle: SceneMediaBundle, localT: number, eps: number) {
    const { video } = bundle;
    if (!video || !video.duration || isNaN(video.duration)) return;

    const targetTime = Math.min(video.duration - 0.05, Math.max(0, localT * video.duration));
    bundle.targetTime = targetTime;

    if (Math.abs(video.currentTime - targetTime) <= eps) {
      bundle.pendingSeekTime = null;
      return;
    }

    const now = performance.now();
    const throttleMs = this.isMobileDevice ? 65 : 16;

    if (video.seeking || now - bundle.lastSeekTime < throttleMs) {
      bundle.pendingSeekTime = targetTime;
      return;
    }

    bundle.lastSeekTime = now;
    bundle.pendingSeekTime = null;

    try {
      if (typeof (video as any).fastSeek === 'function') {
        (video as any).fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    } catch (_) {
      try {
        video.currentTime = targetTime;
      } catch (_) {}
    }
  }

  private updateProgressUI() {
    if (this.options.progressFillElement) {
      this.options.progressFillElement.style.width = `${(this.progress * 100).toFixed(1)}%`;
    }

    const nodes = this.options.sceneNodesContainer.querySelectorAll('.scene-node');
    nodes.forEach((node, idx) => {
      if (idx === this.currentSceneIndex) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.cleanupCurrentMedia();
  }
}
