'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { getUserRole } from '@/utils/getUserRole';

type Props = {
  listingId: string;
};

export default function AdminControls({ listingId }: Props) {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole();
      setUserRole(role);
    }
    fetchRole();
  }, []);

  async function handleDelete() {
    if (!confirm('정말 이 매물을 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      alert('매물이 삭제되었습니다.');
      router.push('/listings'); // 삭제 후 목록 페이지로 이동
    }
  }

  if (userRole !== 'admin') return null;

  return (
    <div className="flex gap-4 mt-4">
      <a
        href={`/listings/edit/${listingId}`}
        className="btn-create bg-blue-400  hover:bg-blue-700 transition"
      >
        수정
      </a>
      <button
        onClick={handleDelete}
        className="btn-create bg-red-400  hover:bg-red-700 transition"
      >
        삭제
      </button>
    </div>
  );
}
