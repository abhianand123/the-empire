/**
 * The Empire Universe - Engine Data Types & Schemas
 *
 * Strict architectural contracts for worlds, scenes, and scrub controller states.
 */

export type SceneMaturityLevel =
  | 'LEVEL_1_PLACEHOLDER'
  | 'LEVEL_2_APPROVED'
  | 'LEVEL_3_GENERATED';

export interface SceneMeta {
  id: string; // e.g., '01_genesis', '01_code'
  sceneNumber: number; // 1 to 4
  title: string;
  subtitle: string;
  metaphor: string;
  eyebrow?: string;
  tags?: string[];
  narrativeCopy: {
    heading: string;
    body: string;
    metrics?: { label: string; value: string }[];
  };
  assetPaths: {
    stillSource: string;
    stillDist: string;
    videoSource: string;
    videoDist: string;
  };
  maturityLevel: SceneMaturityLevel;
}

export interface ProjectMeta {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface StatItem {
  label: string;
  value: string;
  description?: string;
}

export interface WorldConfig {
  id: string; // e.g., 'the-empire', 'abhi-anand'
  name: string;
  role: string;
  tagline: string;
  bioPlaceholder: string;
  accentColor: string; // Hex color for glow / laser accents
  secondaryColor: string;
  themeBackground: string; // #08090C baseline
  scenes: SceneMeta[];

  // Rich portfolio fields
  isHub?: boolean;
  heroBadge?: string;
  missionStatement?: string;
  skills?: SkillCategory[];
  projects?: ProjectMeta[];
  stats?: StatItem[];
  socialLinks?: { label: string; url: string; icon?: string }[];
  recruitmentTitle?: string;
  recruitmentBody?: string;
}

export interface UniverseRegistry {
  version: string;
  hub: WorldConfig;
  members: WorldConfig[];
}
