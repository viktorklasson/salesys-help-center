import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  output: "standalone",
  // No email is sent, so the "forgot password" page can't work; passwords are reset by an admin
  async redirects() {
    return [
      { source: '/admin/forgot', destination: '/admin/login', permanent: false },
      // These advanced functions became guides
      ...['order-work', 'call-actions', 'webhooks'].map((slug) => ({
        source: `/service/${slug}`,
        destination: `/guides/${slug}`,
        permanent: true,
      })),
      // Guides' earlier addresses
      ...['/guider', '/api-reference/artiklar', '/api-reference/guider'].flatMap((path) => [
        { source: path, destination: '/guides', permanent: true },
        { source: `${path}/:slug`, destination: '/guides/:slug', permanent: true },
      ]),
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
