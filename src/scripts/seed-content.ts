/**
 * Replaces all content with the backup in seed/: every collection and global, and the uploaded files.
 * Users are never touched. Older backups are brought up to date afterwards (lib/contentMigrations).
 *
 *   npm run content:seed                     (locally)
 *   docker compose run --rm --build seed     (on the server)
 */
import fs from 'fs';
import path from 'path';
import { BSON } from 'mongodb';
import { getPayload } from 'payload';

import config from '../payload.config';
import { runContentMigrations } from '../lib/contentMigrations';
import { CONTENT_FILE, MEDIA_DIR, getContentCollections, getUploadDirs } from './content';

if (!fs.existsSync(CONTENT_FILE)) {
  console.error(`No backup found at ${CONTENT_FILE}. Run "npm run content:export" first.`);
  process.exit(1);
}

const payload = await getPayload({ config });
const db = payload.db.connection.db!;
const content = BSON.EJSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')) as Record<
  string,
  BSON.Document[]
>;

// Every content collection, also ones the backup doesn't have yet (they end up empty)
for (const name of getContentCollections(payload)) {
  const docs = content[name] ?? [];
  await db.collection(name).deleteMany({});
  if (docs.length) await db.collection(name).insertMany(docs);
  console.log(`${name}: ${docs.length}`);
}

for (const { slug, dir } of getUploadDirs(payload)) {
  const source = path.join(MEDIA_DIR, slug);
  if (!fs.existsSync(source)) continue;
  fs.cpSync(source, dir, { recursive: true });
  console.log(`${slug} files: ${fs.readdirSync(source).length}`);
}

// A backup from before a schema change gets the same update as the live database
await runContentMigrations(payload);

console.log('\nReplaced all content with the backup.');
process.exit(0);
