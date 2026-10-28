import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { QuestionCategories } from './collections/QuestionCategories';
import { Questions } from './collections/Questions';
import { Services } from './collections/Services';
import { ApiReferencePage } from './globals/ApiReferencePage';
import { CommonQuestionsPage } from './globals/CommonQuestionsPage';
import { HomePage } from './globals/HomePage';
import { ServicesPage } from './globals/ServicesPage';
import { SiteSettings } from './globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Questions, QuestionCategories],
  globals: [HomePage, ServicesPage, ApiReferencePage, CommonQuestionsPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
});
