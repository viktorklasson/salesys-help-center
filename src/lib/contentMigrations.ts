import type { BasePayload } from 'payload';

/**
 * Changes to how existing content is stored. Each one checks whether it's needed and does nothing
 * otherwise, so they run automatically: when the app starts (onInit in payload.config.ts) and after a
 * seed (an older backup gets upgraded). Add new ones to the list at the bottom.
 */

const migrations: ((payload: BasePayload) => Promise<void>)[] = [];

export const runContentMigrations = async (payload: BasePayload) => {
  for (const migrate of migrations) await migrate(payload);
};
