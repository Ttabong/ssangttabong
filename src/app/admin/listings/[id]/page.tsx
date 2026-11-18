import Link from 'next/link';
import ListingDetailContent from '@/app/listings/[id]/ListingDetailContent';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArchivedListingDetailPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div>
      <ListingDetailContent
        id={resolvedParams.id}
        archived={true}
      />

      <div className='h-6' />

      <div className="flex justify-center pb-10">
      <Link
        href="/admin/listings"
        className="inline-flex min-w-[180px] items-center justify-center gap-4 rounded-xl bg-[#3678b9] px-7 py-3.5 text-base font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#28669f] hover:shadow-lg active:translate-y-0"
      >
        <span className="text-lg">←</span>
        <span>보관함으로 돌아가기</span>
      </Link>
      </div>

            <div className='h-6' />
    </div>
  );
}
