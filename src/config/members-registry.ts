import { UniverseRegistry, WorldConfig } from '../engine/types';
import { theEmpireConfig } from './members/the-empire.config';
import { abhiAnandConfig } from './members/abhi-anand.config';
import { ayushConfig } from './members/ayush.config';
import { adityaPrakashConfig } from './members/aditya-prakash.config';

export const universeRegistry: UniverseRegistry = {
  version: '2.0.0',
  hub: theEmpireConfig,
  members: [
    abhiAnandConfig,
    ayushConfig,
    adityaPrakashConfig,
  ],
};

export const allWorlds: WorldConfig[] = [
  theEmpireConfig,
  abhiAnandConfig,
  ayushConfig,
  adityaPrakashConfig,
];

export function getWorldById(id: string): WorldConfig | undefined {
  return allWorlds.find((w) => w.id === id);
}
