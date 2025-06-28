'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function ConfirmResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Supabase 세션 존재 여부 확인
  const [sessionReady, setSessionReady] = useState(false);

  // 세션 확인 및 준비 상태 설정
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
      }
    };

    checkSession();

    // auth 변경 감지 (예: 토큰으로 로그인 되었을 경우)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSessionReady(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!sessionReady) {
      setError('로그인 세션이 설정되지 않았습니다. 다시 시도해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError('비밀번호 재설정 실패: ' + error.message);
    } else {
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => router.push('/sign/LoginForm'), 2000);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handlePasswordReset}
      className="container_l max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light)"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      <h2 className="text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md mb-6">
        비밀번호 재설정
      </h2>

      <div className='h-5'></div>

    <div className='container_lc'>

      {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}
      {message && <p className="text-green-600 text-sm font-medium text-center">{message}</p>}

      <div>
        <label htmlFor="newPassword" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
          * 새 비밀번호
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
          required
          autoComplete="new-password"
        />
      </div>

      <div className='h-5'></div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
          * 비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
          required
          autoComplete="new-password"
        />
      </div>

      <div className='h-5'></div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="btn-login bg-var(--color-primary) text-var(--color-background) py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-var(--color-primary-dark) transition disabled:opacity-50"
        >
          {loading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </div>
    </div>  
    </form>
  );
}
