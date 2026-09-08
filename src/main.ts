import './styles/main.css';
import { allWorlds, getWorldById } from './config/members-registry';
import { ScrubController } from './engine/scrub-controller';
import { WorldConfig } from './engine/types';

// State
let activeWorld: WorldConfig = allWorlds[0];
let scrubController: ScrubController;

// DOM Elements
const viewportEl = document.getElementById('cinematic-viewport') as HTMLElement;
const progressBarEl = document.getElementById('scrub-progress-bar') as HTMLElement;
const progressFillEl = document.getElementById('scrub-progress-fill') as HTMLElement;
const sceneNodesEl = document.getElementById('scene-nodes') as HTMLElement;
const ambientGlowEl = document.getElementById('ambient-glow') as HTMLElement;
const brandSubtitle = document.getElementById('brand-subtitle') as HTMLElement;
const scrollContentEl = document.getElementById('scroll-content') as HTMLElement;

// Vector SVG Icons Helper
function getSvgIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'instagram':
    case 'insta':
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
    case 'github':
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;
    case 'tradingview':
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19.9 8.5h-4.3c-.4 0-.7.3-.7.7v6.6c0 .4.3.7.7.7h4.3c.4 0 .7-.3.7-.7V9.2c0-.4-.3-.7-.7-.7zm-7.6-4.2H8c-.4 0-.7.3-.7.7v13.6c0 .4.3.7.7.7h4.3c.4 0 .7-.3.7-.7V5c0-.4-.3-.7-.7-.7zM4.8 12.3H.7c-.4 0-.7.3-.7.7v5.8c0 .4.3.7.7.7h4.1c.4 0 .7-.3.7-.7V13c0-.4-.3-.7-.7-.7z"/></svg>`;
    case 'email':
    case 'gmail':
      return `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
    default:
      return `<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;
  }
}

function initApp() {
  // 1. Initialize Scrub Controller
  scrubController = new ScrubController({
    viewportElement: viewportEl,
    progressBarElement: progressBarEl,
    progressFillElement: progressFillEl,
    sceneNodesContainer: sceneNodesEl,
    ambientGlowElement: ambientGlowEl,
  });

  // 2. Setup Global Event Listeners
  setupEventListeners();

  // 3. Check URL Hash and Load Initial World
  const initialWorldId = window.location.hash.replace('#', '');
  const matchedWorld = getWorldById(initialWorldId);
  if (matchedWorld) {
    switchWorld(matchedWorld, true);
  } else {
    switchWorld(allWorlds[0], true);
  }
}

function switchWorld(world: WorldConfig, resetScroll: boolean = true) {
  activeWorld = world;
  window.location.hash = world.id;

  // Update brand subtitle
  if (brandSubtitle) {
    brandSubtitle.textContent = world.isHub ? 'Founding Syndicate' : world.role;
  }

  // Render Scrollable Content View
  renderScrollContent(world);

  // Load into scrub controller
  scrubController.loadWorld(world, resetScroll);
}

function renderScrollContent(world: WorldConfig) {
  if (world.isHub) {
    renderTheEmpireHub(world);
  } else {
    renderMemberPortfolio(world);
  }
}

// ----------------------------------------------------------------------------
// THE EMPIRE HUB TEMPLATE (Editorial Ambition & 3 Founding Pillars)
// ----------------------------------------------------------------------------
function renderTheEmpireHub(world: WorldConfig) {
  const memberWorlds = allWorlds.filter((w) => !w.isHub);

  scrollContentEl.innerHTML = `
    <!-- 1. EDITORIAL HERO -->
    <section class="editorial-hero">
      <div class="hero-eyebrow-row">
        <span class="hero-badge">
          ${world.heroBadge || 'THREE TEEN FOUNDERS • BUILDING FROM FIRST PRINCIPLES'}
        </span>
      </div>

      <h1 class="hero-main-title">The <em>Empire</em></h1>
      <p class="hero-tagline">
        ${world.missionStatement}
      </p>

      <div class="hero-actions-row">
        <a href="#founders-section" class="luxury-btn luxury-btn-primary" id="btn-explore-founders">
          <span>Three Founding Pillars</span>
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </a>
        <a href="#milestones-section" class="luxury-btn luxury-btn-secondary" id="btn-view-roadmap">
          <span>4-Phase Roadmap</span>
        </a>
        <a href="#recruitment-section" class="luxury-btn luxury-btn-secondary" id="btn-join-syndicate">
          <span>Join Us</span>
        </a>
      </div>
    </section>

    <!-- 2. THE THREE FOUNDERS SHOWCASE -->
    <section id="founders-section">
      <div class="section-editorial-header">
        <span class="section-eyebrow">CO-FOUNDING PILLARS</span>
        <h2 class="section-title">Three Teenagers Building <em>The Future</em></h2>
        <p class="section-description">Software engineering, quantitative gold trading, and cinematic video editing uniting to build an independent empire in the upcoming years.</p>
      </div>

      <div class="founders-triptych">
        ${memberWorlds
          .map(
            (m) => `
            <a href="#${m.id}" class="founder-editorial-card" data-target-world="${m.id}" style="--founder-accent: ${m.accentColor}; --founder-glow: ${m.accentColor}33">
              <div>
                <div class="founder-card-top">
                  <span class="founder-pillar-tag">${m.heroBadge?.split('•')?.[1]?.trim() || m.role}</span>
                  <div class="founder-arrow">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </div>
                </div>
                <h3 class="founder-name">${m.name}</h3>
                <div class="founder-role">${m.role}</div>
              </div>
              <div class="founder-card-footer">
                <span class="founder-cta-label">Explore Portfolio</span>
                <span class="founder-arrow" style="color: ${m.accentColor}; font-weight: 600;">→</span>
              </div>
            </a>
          `
          )
          .join('')}
      </div>
    </section>

    <!-- 3. ROADMAP MILESTONE STAGES (Background Video Scrubbed) -->
    <section id="milestones-section" class="milestone-stages-container">
      ${world.scenes
        .map(
          (scene, idx) => `
            <div class="editorial-stage-item" data-milestone-idx="${idx}">
              <div class="stage-copy-box">
                <div class="stage-index-badge">
                  <span class="stage-num">PHASE 0${idx + 1}</span>
                  <div class="stage-divider"></div>
                  <span class="stage-eyebrow">${scene.eyebrow || `Phase 0${idx + 1}`}</span>
                </div>
                <h2 class="stage-title">${scene.title}</h2>
                <p class="stage-narrative">${scene.narrativeCopy.body}</p>
                <div class="stage-tags-row">
                  ${(scene.tags || []).map((t) => `<span class="stage-pill">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          `
        )
        .join('')}
    </section>

    <!-- 4. HIGHLIGHTED RECRUITMENT & DIRECT CONTACT SECTION ("JOIN US") -->
    <section id="recruitment-section" class="recruitment-editorial-section">
      <div class="recruitment-content">
        <span class="section-eyebrow">AMBITIOUS ALLIANCE</span>
        <h2 class="recruitment-title">${world.recruitmentTitle || 'Join Us — <em>We Are Finding Ambitious People Like Us</em>'}</h2>
        <p class="recruitment-body">
          ${world.recruitmentBody || 'We are three teens who believe in building an empire on our own terms. We are not waiting for permission — we are coding, mastering financial markets, and creating world-class cinema every single day. If you are an ambitious coder, quantitative trader, video editor, designer, or builder who wants to build something truly great in the upcoming years, connect with us.'}
        </p>

        <!-- Direct Email Connect Banner -->
        <div class="recruitment-email-card">
          <div class="recruitment-email-info">
            <span class="email-badge">${getSvgIcon('gmail')} Direct Syndicate Reachout</span>
            <a href="mailto:abhi55and@gmail.com" class="email-address-text">abhi55and@gmail.com</a>
          </div>
          <a href="mailto:abhi55and@gmail.com" class="luxury-btn luxury-btn-primary">
            <span>${getSvgIcon('gmail')} Email Us Directly</span>
          </a>
        </div>

        <!-- Founders Direct Social Links Grid -->
        <div class="recruitment-founders-grid">
          <!-- Abhi Anand -->
          <div class="recruitment-founder-pill">
            <div class="r-founder-header">
              <span class="r-founder-name">Abhi Anand</span>
              <span class="r-founder-tag">Tech & Systems</span>
            </div>
            <div class="r-founder-links">
              <a href="https://github.com/abhianand123" target="_blank" rel="noopener" class="r-social-link">
                ${getSvgIcon('github')}
                <span>GitHub</span>
              </a>
              <a href="https://www.instagram.com/_cauchyschwarz/" target="_blank" rel="noopener" class="r-social-link">
                ${getSvgIcon('instagram')}
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <!-- Aditya Prakash -->
          <div class="recruitment-founder-pill">
            <div class="r-founder-header">
              <span class="r-founder-name">Aditya Prakash</span>
              <span class="r-founder-tag">Gold Trader • Top 2%</span>
            </div>
            <div class="r-founder-links">
              <a href="https://www.tradingview.com/u/aditya484838/" target="_blank" rel="noopener" class="r-social-link">
                ${getSvgIcon('tradingview')}
                <span>TradingView</span>
              </a>
              <a href="https://www.instagram.com/adityaprakash120/" target="_blank" rel="noopener" class="r-social-link">
                ${getSvgIcon('instagram')}
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <!-- Ayush -->
          <div class="recruitment-founder-pill">
            <div class="r-founder-header">
              <span class="r-founder-name">Ayush</span>
              <span class="r-founder-tag">Cinema & Editing</span>
            </div>
            <div class="r-founder-links">
              <a href="https://www.instagram.com/agm_778/" target="_blank" rel="noopener" class="r-social-link">
                ${getSvgIcon('instagram')}
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. LUXURY FOOTER -->
    <footer class="editorial-footer">
      <div class="footer-brand">
        <div class="brand-crest">E</div>
        <div>
          <div class="brand-title" style="font-size: 16px;">The Empire</div>
          <div class="brand-subtitle">Three Teen Founders • Building in Upcoming Years</div>
        </div>
      </div>
      <div class="footer-links">
        ${memberWorlds.map((m) => `<a href="#${m.id}" data-target-world="${m.id}">${m.name}</a>`).join('')}
      </div>
      <div class="footer-copyright">
        © 2026 THE EMPIRE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  `;

  wireScrollContentEvents();
}

// ----------------------------------------------------------------------------
// MEMBER PORTFOLIO TEMPLATE (Abhi Anand, Aditya Prakash, Ayush)
// ----------------------------------------------------------------------------
function renderMemberPortfolio(world: WorldConfig) {
  const memberWorlds = allWorlds.filter((w) => !w.isHub);

  scrollContentEl.innerHTML = `
    <!-- 1. MEMBER HERO -->
    <section class="editorial-hero">
      <div class="hero-eyebrow-row">
        <span class="hero-badge">
          ${world.heroBadge || `${world.name.toUpperCase()} • FOUNDER PORTFOLIO`}
        </span>
      </div>

      <h1 class="hero-main-title">${world.name}</h1>
      <p class="hero-tagline">
        ${world.missionStatement}
      </p>

      <div class="hero-actions-row">
        <button class="luxury-btn luxury-btn-secondary" id="btn-back-empire">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
          <span>The Empire Hub</span>
        </button>
        <a href="#member-milestones" class="luxury-btn luxury-btn-primary">
          <span>Cinematic Milestones</span>
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </a>
        <a href="#member-arsenal" class="luxury-btn luxury-btn-secondary">
          <span>Skills & Projects</span>
        </a>
      </div>
    </section>

    <!-- 2. THE 4 CINEMATIC MILESTONES (Background Video Scrubbed) -->
    <section id="member-milestones" class="milestone-stages-container">
      ${world.scenes
        .map(
          (scene, idx) => `
            <div class="editorial-stage-item" data-milestone-idx="${idx}">
              <div class="stage-copy-box">
                <div class="stage-index-badge">
                  <span class="stage-num">MILESTONE 0${idx + 1}</span>
                  <div class="stage-divider"></div>
                  <span class="stage-eyebrow">${scene.eyebrow || `Milestone 0${idx + 1}`}</span>
                </div>
                <h2 class="stage-title">${scene.title}</h2>
                <p class="stage-narrative">${scene.narrativeCopy.body}</p>
                <div class="stage-tags-row">
                  ${(scene.tags || []).map((t) => `<span class="stage-pill">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          `
        )
        .join('')}
    </section>

    <!-- 3. ARSENAL, PROJECTS & DIRECT CONTACT -->
    <section id="member-arsenal" class="portfolio-details-container">
      ${
        world.skills && world.skills.length > 0
          ? `
        <div>
          <div class="section-editorial-header">
            <span class="section-eyebrow">CORE ARSENAL</span>
            <h2 class="section-title">Disciplines & <em>Mastery</em></h2>
          </div>

          <div class="arsenal-grid">
            ${world.skills
              .map(
                (cat) => `
                  <div class="arsenal-category-card">
                    <div class="arsenal-cat-title">${cat.category}</div>
                    <div class="arsenal-tags-wrap">
                      ${cat.items.map((item) => `<span class="arsenal-tag">${item}</span>`).join('')}
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      ${
        world.projects && world.projects.length > 0
          ? `
        <div>
          <div class="section-editorial-header">
            <span class="section-eyebrow">FEATURED VENTURES</span>
            <h2 class="section-title">Projects & <em>Frameworks</em></h2>
          </div>

          <div class="projects-editorial-list">
            ${world.projects
              .map(
                (proj) => `
                  <div class="project-editorial-card">
                    <div>
                      <div class="project-category-badge">${proj.category}</div>
                      <h3 class="project-title">${proj.title}</h3>
                      <p class="project-desc">${proj.description}</p>
                    </div>
                    <div class="stage-tags-row">
                      ${proj.tags.map((t) => `<span class="stage-pill">${t}</span>`).join('')}
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <!-- DIRECT TRANSMISSION / CONNECT -->
      <div class="recruitment-editorial-section" style="border-color: ${world.accentColor}4D;">
        <div class="recruitment-content">
          <span class="section-eyebrow">DIRECT CONNECTION</span>
          <h2 class="recruitment-title">Connect with <em>${world.name}</em></h2>
          <p class="recruitment-body">Reach out directly for collaborations, engineering systems, market insights, or cinematic media production.</p>

          <div class="recruitment-cta-row">
            ${(world.socialLinks || [])
              .map(
                (link) => `
                  <a href="${link.url}" target="_blank" rel="noopener" class="luxury-btn luxury-btn-primary">
                    <span>${getSvgIcon(link.label)} ${link.label}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </a>
                `
              )
              .join('')}
            <button class="luxury-btn luxury-btn-secondary" id="btn-back-hub-footer">
              <span>← Return to The Empire</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. LUXURY FOOTER -->
    <footer class="editorial-footer">
      <div class="footer-brand">
        <div class="brand-crest" style="color: ${world.accentColor}; border-color: ${world.accentColor}4D;">${world.name.charAt(0)}</div>
        <div>
          <div class="brand-title" style="font-size: 16px;">${world.name}</div>
          <div class="brand-subtitle">${world.role}</div>
        </div>
      </div>
      <div class="footer-links">
        <a href="#the-empire" data-target-world="the-empire">The Empire</a>
        ${memberWorlds
          .filter((w) => w.id !== world.id)
          .map((m) => `<a href="#${m.id}" data-target-world="${m.id}">${m.name}</a>`)
          .join('')}
      </div>
      <div class="footer-copyright">
        © 2026 ${world.name.toUpperCase()} • THE EMPIRE FOUNDING SYNDICATE
      </div>
    </footer>
  `;

  wireScrollContentEvents();
}

function wireScrollContentEvents() {
  // 1. Back to The Empire buttons
  const backBtns = document.querySelectorAll('#btn-back-empire, #btn-back-hub-footer');
  backBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const empireWorld = allWorlds.find((w) => w.isHub) || allWorlds[0];
      switchWorld(empireWorld, true);
    });
  });

  // 2. Founder Enter buttons
  const enterBtns = document.querySelectorAll('[data-target-world]');
  enterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetWorldId = (btn as HTMLElement).dataset.targetWorld;
      if (targetWorldId) {
        const targetWorld = getWorldById(targetWorldId);
        if (targetWorld) {
          switchWorld(targetWorld, true);
        }
      }
    });
  });

  // 3. Smooth scroll on anchor buttons within the page
  const smoothLinks = scrollContentEl.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function setupEventListeners() {
  // Window Hash Change
  window.addEventListener('hashchange', () => {
    const worldId = window.location.hash.replace('#', '');
    const matched = getWorldById(worldId);
    if (matched && matched.id !== activeWorld.id) {
      switchWorld(matched, true);
    }
  });
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
