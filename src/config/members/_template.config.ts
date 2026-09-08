import { WorldConfig } from '../../engine/types';

/**
 * Extensible Member World Template
 *
 * To add a new founder or syndicate member (World #5+):
 * 1. Duplicate this file and name it `<member-slug>.config.ts`
 * 2. Fill in the member metadata, colors, and 4-scene narrative structure.
 * 3. Place generated assets in `assets/<member-slug>/dist/` (4 stills & 4 MP4s).
 * 4. Register the config in `src/config/members-registry.ts`.
 *
 * Zero core engine code modifications required.
 */
export const templateMemberConfig: WorldConfig = {
  id: 'new-member',
  name: 'New Member Name',
  role: 'Specialization / Discipline Title',
  tagline: 'High-Impact One-Line Vision or Philosophy',
  bioPlaceholder: '[MEMBER_INTRO]',
  accentColor: '#00F0FF',
  secondaryColor: '#2563EB',
  themeBackground: '#08090C',
  scenes: [
    {
      id: '01_scene',
      sceneNumber: 1,
      title: 'Scene 1 Title',
      subtitle: 'Foundation / Ingestion',
      metaphor: 'Visual metaphor description of the diorama',
      narrativeCopy: {
        heading: 'Pillar Heading',
        body: '[MEMBER_INTRO] — Description of first principles and foundational craft.',
      },
      assetPaths: {
        stillSource: 'assets/new-member/source/still_01.png',
        stillDist: 'assets/new-member/dist/stills/still_01.png',
        videoSource: 'assets/new-member/source/video_01.mp4',
        videoDist: 'assets/new-member/dist/vid/video_01.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '02_scene',
      sceneNumber: 2,
      title: 'Scene 2 Title',
      subtitle: 'Architecture / Method',
      metaphor: 'Visual metaphor description of the diorama',
      narrativeCopy: {
        heading: 'System Architecture',
        body: '[MEMBER_INTRO] — Description of workflow, tools, or distributed execution.',
      },
      assetPaths: {
        stillSource: 'assets/new-member/source/still_02.png',
        stillDist: 'assets/new-member/dist/stills/still_02.png',
        videoSource: 'assets/new-member/source/video_02.mp4',
        videoDist: 'assets/new-member/dist/vid/video_02.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '03_scene',
      sceneNumber: 3,
      title: 'Scene 3 Title',
      subtitle: 'Precision / Acceleration',
      metaphor: 'Visual metaphor description of the diorama',
      narrativeCopy: {
        heading: 'Core Engine',
        body: '[MEMBER_INTRO] — Description of deep technical or creative acceleration.',
      },
      assetPaths: {
        stillSource: 'assets/new-member/source/still_03.png',
        stillDist: 'assets/new-member/dist/stills/still_03.png',
        videoSource: 'assets/new-member/source/video_03.mp4',
        videoDist: 'assets/new-member/dist/vid/video_03.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
    {
      id: '04_scene',
      sceneNumber: 4,
      title: 'Scene 4 Title',
      subtitle: 'Enduring Impact',
      metaphor: 'Visual metaphor description of the diorama',
      narrativeCopy: {
        heading: 'Sovereign Scale',
        body: '[MEMBER_INTRO] — Description of generational output and sovereign mastery.',
      },
      assetPaths: {
        stillSource: 'assets/new-member/source/still_04.png',
        stillDist: 'assets/new-member/dist/stills/still_04.png',
        videoSource: 'assets/new-member/source/video_04.mp4',
        videoDist: 'assets/new-member/dist/vid/video_04.mp4',
      },
      maturityLevel: 'LEVEL_1_PLACEHOLDER',
    },
  ],
};
