'use client';

import React, { useEffect, useState } from 'react';
import ListingCreateForm from '@/components/Listings/Create/ListingCreateForm';
import supabase from '@/lib/supabaseClient';

export default function CreateListingPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const user = userData.user;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.role === 'admin');
      }

      setLoading(false);
    }

    checkAdmin();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  if (!isAdmin) return <div>관리자만 접근할 수 있습니다.</div>;

  return (
    <main>
      <h1 className="container_c filter_a text-4xl font-bold mb-6 border-b border-gray-300">■ 매물 등록</h1>
      <ListingCreateForm />
    </main>
  );
}
