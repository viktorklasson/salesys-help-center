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
import { Endpoints } from './collections/Endpoints';
import { Services } from './collections/Services';
import { Articles } from './collections/Articles';
import { codeBlockFeature } from './fields/codeBlockFeature';
import { linkFeature } from './fields/linkFeature';
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
    meta: {
      robots: "noindex, nofollow"
    }
  },
  collections: [Users, Media, Services, Endpoints, Articles, Questions, QuestionCategories],
  globals: [HomePage, ServicesPage, ApiReferencePage, CommonQuestionsPage, SiteSettings],
  // Default editor (e.g. FAQ answers), with the same link options as every other text field
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'link'),
      linkFeature(),
      codeBlockFeature(),
    ],
  }),
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
