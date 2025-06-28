'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needEmailConfirm, setNeedEmailConfirm] = useState(false); // 인증 필요 상태

  // ✅ 인증 메일 재전송
  const handleResendEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert('인증 메일 재전송 실패: ' + error.message);
    } else {
      alert('인증 메일이 다시 발송되었습니다. 메일함(스팸함 포함)을 확인해주세요.');
    }
  };

  // ✅ 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedEmailConfirm(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[로그인 실패]', error.message);

      if (error.message === 'Email not confirmed') {
        setError('이메일 인증이 필요합니다. 받은 메일(스팸함 포함)을 확인하세요.');
        setNeedEmailConfirm(true); // 재전송 버튼 표시
      } else if (error.message === 'Invalid login credentials') {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }

      setLoading(false);
      return;
    }

    console.log('[로그인 성공]', data);
    router.push('/');
    setLoading(false);
  };

  return (
<form
  onSubmit={handleLogin}
  className="container_l  max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light)"
  style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
>
  <h2 className="filter_a text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md mb-8">
    로그인
  </h2>

    <div className='h-5'></div>

  <div className='container_lc'>
    <label
      htmlFor="email"
      className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
    >
      * 이메일
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full text-sm px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-var(--color-primary) focus:border-transparent
                 transition"
      required
      autoComplete="email"
    />
  </div>

  <div className='container_lc' >
    <label
      htmlFor="password"
      className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
    >
      * 비밀번호
    </label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-var(--color-primary) focus:border-transparent
                 transition"
      required
      autoComplete="current-password"
    />
  </div>

    <div className='h-3'></div>

  {error && (
    <p className="text-red-600 text-sm font-medium text-center mb-4">{error}</p>
  )}

  {needEmailConfirm && (
    <button
      type="button"
      onClick={handleResendEmail}
      className="container_lc block mx-auto text-sm text-var(--color-primary) underline hover:text-var(--color-primary-dark) transition mb-6"
    >
      인증 메일 다시 보내기
    </button>
  )}

<div className="flex justify-center">
  <button
    type="submit"
    className="btn-login bg-var(--color-primary) text-var(--color-background) py-4 px-8 rounded-lg font-semibold
               shadow-md hover:bg-var(--color-primary-dark) transition disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={loading}
  >
    {loading ? '로그인 중...' : '로그인'}
  </button>
</div>

<div className="h-5"> </div>

<div className="mt-6 flex flex-col sm:flex-row justify-center text-sm text-center text-var(--color-gray-dark) gap-10 pt-5">
  <a
    href="/sign/reset-password"
    className="hover:underline hover:text-var(--color-primary)"
  >
    비밀번호를 잊으셨나요?
  </a>

  <a
    href="/sign/SignupForm"
    className="mt-2 sm:mt-0 hover:underline hover:text-var(--color-primary)"
  >
     회원가입
  </a>

</div>

</form>

  );
}
