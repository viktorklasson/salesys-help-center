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
import { ApiCategories } from './collections/ApiCategories';
import { runContentMigrations } from './lib/contentMigrations';
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
  // Grouped in the admin panel by the page they belong to (admin.group). Groups appear in the order
  // they're first used here, collections before globals, so this follows the site's menu.
  collections: [
    Endpoints,
    ApiCategories,
    Services,
    Articles,
    Questions,
    QuestionCategories,
    Media,
    Users,
  ],
  globals: [HomePage, ApiReferencePage, ServicesPage, CommonQuestionsPage, SiteSettings],
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
  // Bring existing content up to date with schema changes (lib/contentMigrations); no-op when done
  onInit: runContentMigrations,
});
