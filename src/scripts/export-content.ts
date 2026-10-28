import fs from 'fs';
import path from 'path';
import { BSON } from 'mongodb';
import { getPayload } from 'payload';

import config from '../payload.config';
import { CONTENT_FILE, MEDIA_DIR, SEED_DIR, getContentCollections, getUploadDirs } from './content';

const payload = await getPayload({ config });
const db = payload.db.connection.db!;

const content: Record<string, unknown[]> = {};
for (const name of getContentCollections(payload)) {
  content[name] = await db.collection(name).find().toArray();
  console.log(`${name}: ${content[name].length}`);
}

// EJSON keeps ObjectIds and dates intact, so relationships survive a restore
fs.mkdirSync(SEED_DIR, { recursive: true });
fs.writeFileSync(CONTENT_FILE, BSON.EJSON.stringify(content, undefined, 2));

// Copy uploaded files, one folder per upload collection
fs.rmSync(MEDIA_DIR, { recursive: true, force: true });
for (const { slug, dir } of getUploadDirs(payload)) {
  if (!fs.existsSync(dir)) continue;
  fs.cpSync(dir, path.join(MEDIA_DIR, slug), { recursive: true });
  console.log(`${slug} files: ${fs.readdirSync(dir).length}`);
}

console.log(`\nSaved to ${path.relative(process.cwd(), SEED_DIR)}/`);
process.exit(0);
