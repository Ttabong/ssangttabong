// src/pages/listings/index.tsx
import ListingsPage from '@/components/Listings/ListingsPage';
import supabase from '@/lib/supabaseClient';

export default async function AllListingsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  return <ListingsPage initialListings={listings ?? []} />;
}
