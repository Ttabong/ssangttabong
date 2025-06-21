import ListingsPage from '@/components//Listings/ListingsPage';

export default function HousePage() {
  return (
    <ListingsPage
      title="주택 매물 리스트"
      description="다세대 및 단독주택 매물만 보여줍니다."
      fixedUsage={['다세대', '단독주택']}
      hideUsage={true}
    />
  );
}