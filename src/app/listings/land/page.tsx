import ListingsPage from '@/components/Listings/ListingsPage';

export default function LandPage() {
  return (
    <ListingsPage
      title="토지 및 건물 매물 리스트"
      description="토지와 건물 용도 매물만 보여줍니다."
      fixedUsage={['토지', '건물']}
      hideUsage={true}
    />
  );
}