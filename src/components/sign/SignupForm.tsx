'use client';

import { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!nickname.trim()) {
      alert('닉네임을 입력하세요.');
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('회원가입 실패: ' + error.message);
      setLoading(false);
      return;
    }

    if (user) {
      await new Promise((res) => setTimeout(res, 1500));

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          nickname,
          role: 'user',
        });

      if (profileError) {
        alert('프로필 저장 실패: ' + profileError.message);
      } else {
        alert('회원가입 성공! 이메일을 확인한 후 로그인하세요.');
        await supabase.auth.signOut();
        router.push('/sign/LoginForm');
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSignup}
      className="container_l max-w-md mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-var(--color-primary-light)"
      style={{ fontFamily: 'Nanum Gothic, sans-serif' }}
    >
      <h2 className="filter_a text-3xl font-extrabold text-center text-var(--color-primary) drop-shadow-md mb-8">
        회원가입
      </h2>

      <div className='h-5'></div>
    <div className='container_lc'>
      <div >
        <label htmlFor="nickname" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
          * 아이디
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
        />
      </div>

      <div className='h-5'></div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
          * 이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
        />
      </div>

      <div className='h-3'></div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
         * 비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
        />
      </div>

      <div className='h-2'></div>

      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-var(--color-primary-dark) mb-2">
          * 비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-5 py-4 pr-24 rounded-lg border border-var(--color-primary-light) shadow-sm focus:outline-none focus:ring-2 focus:ring-var(--color-primary) transition"
        />
        {confirmPassword.length > 0 && (
          <span
            className={`absolute top-11 right-4 text-sm font-semibold ${
              passwordsMatch ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {passwordsMatch ? '일치함' : '불일치'}
          </span>
        )}
      </div>

    </div>    
    
    <div className='flex justify-center'>
      <button
        type="submit"
        className="btn-login w-full bg-var(--color-primary) text-var(--color-background) py-4 px-8 rounded-lg font-semibold shadow-md hover:bg-var(--color-primary-dark) transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? '회원가입 중...' : '회원가입'}
      </button>
    </div>    

    </form>
  );
}