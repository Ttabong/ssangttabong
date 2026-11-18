'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

type ArchivedListing = {
  id: string;
  title: string;
  usage: string | string[] | null;
  price: number | string | null;
  deleted_at: string | null;
};

export default function AdminArchivedListingsPage() {
  const router = useRouter();

  const [listings, setListings] = useState<ArchivedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedListings = async () => {
      try {
        // 로그인 사용자 확인
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/');
          return;
        }

        // 관리자 권한 확인
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin') {
          alert('관리자만 접근할 수 있습니다.');
          router.push('/');
          return;
        }

        // 보관된 매물만 조회
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, usage, price, deleted_at')
          .eq('is_deleted', true)
          .order('deleted_at', { ascending: false });

        if (error) {
          console.error('보관 매물 조회 실패:', error);
          alert('보관 매물을 불러오지 못했습니다.');
          return;
        }

        setListings(data || []);
      } catch (error) {
        console.error('보관함 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedListings();
  }, [router]);

  // 매물 복원
  const handleRestore = async (id: string) => {
    const confirmRestore = window.confirm(
      '이 매물을 다시 일반 매물 목록에 복원하시겠습니까?'
    );

    if (!confirmRestore) return;

    const { error } = await supabase
      .from('listings')
      .update({
        is_deleted: false,
        deleted_at: null,
      })
      .eq('id', id);

    if (error) {
      alert('매물 복원에 실패했습니다.');
      console.error('매물 복원 오류:', error);
      return;
    }

    alert('매물이 복원되었습니다.');

    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <div className="p-6 text-center">보관함을 불러오는 중입니다...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="filter_a text-2xl font-bold sm:text-3xl">
        매물 보관함
      </h1>

      <div className="h-5" />

      <p className="text-sm text-gray-600">
        삭제한 매물을 확인하고 다시 복원할 수 있습니다.
      </p>

      <div className="rounded-lg bg-gray-100 p-4">
        보관된 매물: <strong>{listings.length.toLocaleString()}개</strong>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-gray-500">
          보관된 매물이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
            <tr className="bg-gray-200 text-center">
                <th className="p-3">매물명</th>
                <th className="p-3">용도</th>
                <th className="p-3">가격</th>
                <th className="p-3">보관 날짜</th>
                <th className="p-3">관리</th>
            </tr>
            </thead>

            <tbody>
              {listings.map((item) => (
                <tr key={item.id} className="border-t text-center">
                  <td className="p-3">{item.title || '-'}</td>
                  <td className="p-3">
                    {Array.isArray(item.usage)
                      ? item.usage.join(', ')
                      : item.usage || '-'}
                  </td>
                  <td className="p-3">
                    {item.price?.toLocaleString?.() ?? item.price ?? '-'}
                  </td>
                  <td className="p-3">
                    {item.deleted_at
                      ? new Date(item.deleted_at).toLocaleDateString('ko-KR')
                      : '-'}
                  </td>
                <td className="p-3">
                <div className="flex items-center justify-center gap-3">
                    {/* 상세보기 */}
                    <button
                    onClick={() => router.push(`/admin/listings/${item.id}`)}
                    className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-[#3678b9] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#28669f]"
                    >
                    <span>👁</span>
                    <span>상세보기</span>
                    </button>

                    {/* 복원 */}
                    <button
                    onClick={() => handleRestore(item.id)}
                    className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#eb8a4a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d97736]"
                    >
                    <span>↶</span>
                    <span>복원</span>
                    </button>

                </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}