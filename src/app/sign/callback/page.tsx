'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('세션 조회 중 오류:', error);
        alert('인증 중 오류가 발생했습니다.');
        router.push('/sign/login');
        return;
      }

      if (data.session) {
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
