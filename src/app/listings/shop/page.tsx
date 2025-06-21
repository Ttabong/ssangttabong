import ListingsPage from '@/components/Listings/ListingsPage';

export default function ShopPage() {
  return (
    <ListingsPage
      title="상가 / 사무실 매물 리스트"
      description="상가 또는 사무실 용도만 보여줍니다."
      fixedUsage={['상가', '사무실']}
      hideUsage={true}
    />
  );
}