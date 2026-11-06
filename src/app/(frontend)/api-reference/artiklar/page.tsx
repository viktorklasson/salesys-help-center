import { redirect } from 'next/navigation';

// There's no separate article index; the list lives on the API reference page
export default function ArticlesIndex() {
  redirect('/api-reference#artiklar');
}
