import { notFound } from 'next/navigation';

// The app has two root layouts ((frontend) and (payload)), so Next.js has no single place to show a 404
// for unknown URLs. This catch-all sends them to (frontend)/not-found.tsx, inside the site's header and
// footer. More specific routes (/admin, /api, every page) always match first.
export default function CatchAll() {
  notFound();
}
