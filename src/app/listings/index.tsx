import ListingsPage from '@/components/Listings/ListingsPage';
import supabase from '@/lib/supabaseClient';

export default async function AllListingsPage() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <ListingsPage
      title="전체 매물 리스트"
      description="수 부동산이 보유한 전체 매물입니다."
      initialListings={listings ?? []}
    />
  );
}
