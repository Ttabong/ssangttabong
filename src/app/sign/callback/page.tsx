'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        // 로그인된 사용자 → 메인 페이지로 이동
        router.push('/');
      } else {
        alert('인증에 실패했습니다.');
        router.push('/sign/login');
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center mt-10">🔄 로그인 확인 중입니다...</p>;
}
