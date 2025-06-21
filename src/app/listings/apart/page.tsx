import ListingsPage from '@/components/Listings/ListingsPage';

export default function ApartListingsPage() {
  return (
    <ListingsPage
      title="아파트 매물"
      description="수 부동산이 보유한 아파트 매물 입니다."
      fixedUsage={['아파트']}  // 아파트만 고정 필터
      hideUsage={true}   // 반드시 true로 설정해서 용도 체크박스 숨김
    />
  );
}