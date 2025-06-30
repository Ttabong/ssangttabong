'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // token 쿼리 파라미터 읽기 (있으면)

  // 토큰 콘솔 로그 찍기 (페이지가 열릴 때)
  useEffect(() => {
    console.log('ResetPasswordPage token:', token);
  }, [token]);

  // 페이지 진입 시 자동 로그아웃 처리
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await supabase.auth.signOut();
      }
    };
    checkAuth();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ssangttabong.vercel.app/sign/reset-password/confirm',

    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div
      className="container_l max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light) flex flex-col justify-center items-center"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
       >
      <h2 className="filter_a text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md">
        비밀번호 재설정
      </h2>

      <div className='h-5'></div>

      <div className='container_lc'> 
        {sent ? (
          <p className="text-green-600 text-center text-sm font-medium">
            재설정 링크가 이메일로 전송되었습니다. <br/>메일함을 확인해주세요!
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
              >
                * 이메일 주소
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-var(--color-primary) focus:border-transparent
                          transition"
                autoComplete="email"
              />
            </div>

            <div className='h-5'></div>

            {error && (
              <p className="container_l text-red-600 text-sm font-medium text-center">{error}</p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="btn-login text-sm"
              >
                메일 보내기
              </button>
            </div>

          </form>
        )}
      </div>
    </div>   
  );
}
