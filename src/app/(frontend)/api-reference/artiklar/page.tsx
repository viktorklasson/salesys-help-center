import { redirect } from 'next/navigation';

// Like every other page: render on request, not at build time (the build has no PAYLOAD_SECRET)
export const dynamic = 'force-dynamic';

// There's no separate article index; the list lives on the API reference page
export default function ArticlesIndex() {
  redirect('/api-reference#artiklar');
}
