'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function RegisterProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ 로그인한 유저 id와 이메일 얻기
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('로그인 후 접근 가능합니다.');
        router.push('/sign/login');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? null); // ✅ undefined 방지
    };

    fetchUser();
  }, [router]);

  // ✅ 닉네임 저장 또는 업데이트
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert('닉네임을 입력하세요.');
      return;
    }

    if (!userId || !userEmail) {
      alert('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      router.push('/sign/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 프로필 존재 여부 확인
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;

      if (existingProfile) {
        result = await supabase
          .from('profiles')
          .update({ nickname: nickname.trim() })
          .eq('id', userId);
      } else {
        result = await supabase.from('profiles').insert({
          id: userId,
          email: userEmail,
          nickname: nickname.trim(),
          role: 'user',
        });
      }

      if (result.error) throw result.error;

      alert('닉네임 등록 완료! 환영합니다.');
      router.push('/');
    } catch (error: any) {
      console.error('[프로필 저장 실패]', error.message);
      setError('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="container_l max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light)"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      <h2 className="filter_a text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md mb-8">
        프로필 등록
      </h2>

      <form onSubmit={handleSubmit} className="container_lc space-y-6">
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-semibold text-var(--color-primary-dark) mb-2"
          >
            * 닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="padL w-full px-5 py-4 text-sm rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
            placeholder="사용하실 닉네임을 입력하세요"
          />
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className='h-5' />
        <div className='flex justify-center'>
            <button
            type="submit"
            className="btn-login w-full bg-var(--color-primary) text-var(--color-background) py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-var(--color-primary-dark) transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            >
            {loading ? '등록 중...' : '닉네임 등록'}
            </button>
        </div>
      </form>
    </main>
  );
}
