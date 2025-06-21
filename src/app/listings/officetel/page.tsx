import ListingsPage from '@/components/Listings/ListingsPage';

export default function OfficetelPage() {
  return (
    <ListingsPage
      title="오피스텔 매물 리스트"
      description="오피스텔 용도만 보여줍니다."
      fixedUsage={['오피스텔']}
      hideUsage={true}
    />
  );
}