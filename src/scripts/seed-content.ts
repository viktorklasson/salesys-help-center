import fs from 'fs';
import path from 'path';
import { BSON } from 'mongodb';
import { getPayload } from 'payload';

import config from '../payload.config';
import { CONTENT_FILE, MEDIA_DIR, getContentCollections, getUploadDirs } from './content';

// `payload run` doesn't pass CLI arguments through, so use an env var (see "content:seed:force")
const force = process.env.SEED_FORCE === 'true';

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
const collections = getContentCollections(payload).filter((name) => content[name]);

// Never overwrite existing content by accident
if (!force) {
  for (const name of collections) {
    const count = await db.collection(name).countDocuments();
    if (count > 0) {
      console.error(
        `"${name}" already has ${count} documents. Run "npm run content:seed:force" to replace all content with the backup.`,
      );
      process.exit(1);
    }
  }
}

for (const name of collections) {
  await db.collection(name).deleteMany({});
  if (content[name].length) await db.collection(name).insertMany(content[name]);
  console.log(`${name}: ${content[name].length}`);
}

for (const { slug, dir } of getUploadDirs(payload)) {
  const source = path.join(MEDIA_DIR, slug);
  if (!fs.existsSync(source)) continue;
  fs.cpSync(source, dir, { recursive: true });
  console.log(`${slug} files: ${fs.readdirSync(source).length}`);
}

console.log('\nRestored content from the backup.');
process.exit(0);
