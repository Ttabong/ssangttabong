/* // src/app/listings/[id]/page.tsx
import ListingDetailContent from './ListingDetailContent';

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;  // Promise로 선언
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const resolvedParams = await params; // params는 Promise이므로 await 필요
  return <ListingDetailContent id={resolvedParams.id} />;
}  */

// app/listings/edit/[id]/page.tsx

import ListingDetailContent from '@/app/listings/[id]/ListingDetailContent';  // 경로는 실제 위치에 맞게 조정



type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
  const resolvedParams = await params;
  return <ListingDetailContent id={resolvedParams.id} />;
}
