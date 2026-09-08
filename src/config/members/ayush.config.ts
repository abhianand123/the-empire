import { WorldConfig } from '../../engine/types';

export const ayushConfig: WorldConfig = {
  id: 'ayush',
  name: 'Ayush',
  role: 'Cinematic Video Editor / DaVinci & CapCut Specialist',
  tagline: 'High-Retention Video Editing, DaVinci Resolve, CapCut & Kinetic Pacing',
  bioPlaceholder: '[AYUSH_INTRO]',
  accentColor: '#FF3366',
  secondaryColor: '#8A2BE2',
  themeBackground: '#08090C',
  heroBadge: 'EMPIRE CO-FOUNDER • CINEMA & MEDIA PILLAR',
  missionStatement:
    'Mastering the art of visual attention and cinematic storytelling. Specialized in DaVinci Resolve, CapCut, and kinetic pacing to turn raw footage into high-retention, viral-grade media that commands attention and builds massive brand power in the upcoming years.',
  stats: [
    { label: 'Core Mastery', value: 'Cinematic Editing', description: 'High-Retention Visuals' },
    { label: 'Editing Suites', value: 'DaVinci & CapCut', description: 'Speed & Color Precision' },
    { label: 'Pacing Style', value: 'Kinetic Flow', description: 'Zero-Dropoff Retention' },
    { label: 'Role in Empire', value: 'Media Co-Founder', description: 'Attention & Visual Pillar' },
  ],
  skills: [
    {
      category: 'Editing Software & Production Suites',
      items: ['DaVinci Resolve Studio', 'CapCut Pro', 'Adobe Premiere Pro', 'After Effects', 'Color Grading Suites'],
    },
    {
      category: 'Pacing, Flow & Retention Dynamics',
      items: ['High-Retention Editing', 'Rhythmic Beat-Sync Cuts', 'Seamless Micro-Transitions', 'Hook Engineering', 'Dynamic Zoom & Flow'],
    },
    {
      category: 'Sound Design & Motion Styling',
      items: ['Kinetic Typography', 'Sound Design & Foley', 'Sub-Bass Impact Tuning', 'Color Correction', 'Visual Effects & Cleanups'],
    },
  ],
  projects: [
    {
      title: 'The Empire Cinematic Launch & Visual Identity',
      category: 'Cinematic Direction',
      description: 'High-energy cinematic trailer featuring custom pacing, sound design, and anamorphic color grading establishing our collective visual brand.',
      tags: ['DaVinci Resolve', 'CapCut', 'Sound Design'],
    },
    {
      title: 'High-Retention Viral Video Framework',
      category: 'Viral Media Editing',
      description: 'Editing methodology engineered for short-form and long-form content maintaining maximum viewer retention and emotional engagement.',
      tags: ['CapCut Pro', 'Retention Pacing', 'Motion Design'],
    },
    {
      title: 'Dynamic Motion & Sound FX Library',
      category: 'Audio & Motion Assets',
      description: 'Custom library of transitions, sound design elements, and cinematic overlays built for rapid high-quality video production.',
      tags: ['Sound Design', 'DaVinci Resolve', 'VFX'],
    },
  ],
  socialLinks: [
    { label: 'Instagram', url: 'https://www.instagram.com/agm_778/' },
  ],
  scenes: [
    {
      id: '01_raw',
      sceneNumber: 1,
      title: 'The Raw Footage Vault.',
      subtitle: 'First Frame & Visual Vision',
      metaphor: 'Smoked-glass storage towers and winding celluloid ribbons',
      eyebrow: 'Milestone 01 — Visual Ingestion',
      tags: ['Raw Media', 'First Frame', 'Visual Direction'],
      narrativeCopy: {
        heading: 'Milestone 01: The Raw Frame',
        body: 'Curating raw visual assets and framing the story with powerful creative vision from the very first frame.',
      },
      assetPaths: {
        stillSource: 'assets/ayush/source/still_01.png',
        stillDist: 'assets/ayush/dist/stills/still_01.png',
        videoSource: 'assets/ayush/source/video_01.mp4',
        videoDist: 'assets/ayush/dist/vid/video_01.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '02_timeline',
      sceneNumber: 2,
      title: 'The Kinetic Timeline.',
      subtitle: 'DaVinci & CapCut Precision Pacing',
      metaphor: 'Parallel glowing multi-track video ribbons and laser playheads',
      eyebrow: 'Milestone 02 — Kinetic Rhythm',
      tags: ['DaVinci Resolve', 'CapCut Pro', 'Zero-Dropoff'],
      narrativeCopy: {
        heading: 'Milestone 02: Kinetic Rhythm',
        body: 'Cutting seamlessly to the beat, engineering hooks, and crafting dynamic transitions that keep viewers completely locked in.',
      },
      assetPaths: {
        stillSource: 'assets/ayush/source/still_02.png',
        stillDist: 'assets/ayush/dist/stills/still_02.png',
        videoSource: 'assets/ayush/source/video_02.mp4',
        videoDist: 'assets/ayush/dist/vid/video_02.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '03_rhythm',
      sceneNumber: 3,
      title: 'The Acoustic Resonance.',
      subtitle: 'Impact Sound Design & Sub-Bass Foley',
      metaphor: 'Undulating acoustic waveform glass arches pulsing in tempo',
      eyebrow: 'Milestone 03 — Audio Mastery',
      tags: ['Sound Design', 'Sub-Bass Impacts', 'Audio Flow'],
      narrativeCopy: {
        heading: 'Milestone 03: Audio Immersion',
        body: 'Elevating visuals with punchy sound design, sub-bass impacts, and atmospheric audio mixing that commands attention.',
      },
      assetPaths: {
        stillSource: 'assets/ayush/source/still_03.png',
        stillDist: 'assets/ayush/dist/stills/still_03.png',
        videoSource: 'assets/ayush/source/video_03.mp4',
        videoDist: 'assets/ayush/dist/vid/video_03.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '04_frame',
      sceneNumber: 4,
      title: 'The Sovereign Citadel.',
      subtitle: 'Building Greatness in Upcoming Years',
      metaphor: 'Borderless OLED mastering theatre and grading prism rings',
      eyebrow: 'Milestone 04 — Sovereign Scale',
      tags: ['Upcoming Years', 'Media Power', 'Viral Brand'],
      narrativeCopy: {
        heading: 'Milestone 04: Visual Dominance',
        body: 'Harnessing world-class cinematic video editing to build unmatched brand power and visual authority for our empire in the upcoming years.',
      },
      assetPaths: {
        stillSource: 'assets/ayush/source/still_04.png',
        stillDist: 'assets/ayush/dist/stills/still_04.png',
        videoSource: 'assets/ayush/source/video_04.mp4',
        videoDist: 'assets/ayush/dist/vid/video_04.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
  ],
};
