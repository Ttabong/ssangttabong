import ListingsPage from '@/components//Listings/ListingsPage';

export default function RoomListingsPage() {
  return (
    <ListingsPage
      title="원 / 투룸 매물 리스트"
      description="수 부동산이 보유한 원 / 투룸 입니다."
      fixedRoomCount={[1, 2]}  // room_count 1 또는 2로 고정 필터
      hideUsage={true}         // 용도 필터 숨김
    />
  );
}
