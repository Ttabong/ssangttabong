// src/app/listings/[id]/page.tsx
import ListingDetailContent from './ListingDetailContent';

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;  // Promise로 선언
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const resolvedParams = await params; // params는 Promise이므로 await 필요
  return <ListingDetailContent id={resolvedParams.id} />;
}
