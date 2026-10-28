import path from 'path';
import type { BasePayload } from 'payload';

// Everything the backup covers lives under /seed in the project root
export const SEED_DIR = path.resolve(process.cwd(), 'seed');
export const CONTENT_FILE = path.join(SEED_DIR, 'content.json');
export const MEDIA_DIR = path.join(SEED_DIR, 'media');

/**
 * Collections that hold site content. Auth collections (users, password hashes)
 * and Payload's internal collections (preferences, locks, migrations) are left out.
 * Globals are all stored in Payload's `globals` collection.
 */
export const getContentCollections = (payload: BasePayload) => [
  ...payload.config.collections
    .filter((c) => !c.auth && !c.slug.startsWith('payload-'))
    .map((c) => c.slug),
  'globals',
];

/** Folders where upload collections keep their files */
export const getUploadDirs = (payload: BasePayload) =>
  payload.config.collections
    .filter((c) => c.upload)
    .map((c) => ({
      slug: c.slug,
      dir: (typeof c.upload === 'object' && c.upload.staticDir) || path.resolve(process.cwd(), c.slug),
    }));
