'use client'

import Link from 'next/link'
import { useState } from 'react'
import useUser from '@/hooks/useUser'
import supabase from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/sign/LoginForm');
    setLoggingOut(false);
  };

  return (
    <header>
      <div className="container header-inner">
        <div className="flex items-end gap-2">
          <Link href="/" className="block w-fit h-fit">
            <div className="logo leading-none text-large">
              수 부동산
            </div>
          </Link>

          <Link href="/" className="block w-fit h-fit">
            <div className="flex flex-col justify-between h-full leading-tight">
              <div className=" text-xs text-gray-500">
                Real Estate Agent
              </div>
              <div className="filter_a text-small">
                공인중개사 사무소
              </div>
            </div>
          </Link>
        </div>

        <nav className="w-full flex justify-end pr-4">
          <ul className="header-inner flex space-x-4 font-semibold gap-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="https://www.gwangjin.go.kr/portal/main/main.do" target="_blank" rel="noopener noreferrer">지역정보</a>
            </li>
            <li>
              <a href="https://www.youtube.com/@ssangttabong" target="_blank" rel="noopener noreferrer">맛집정보</a>
            </li>
            <li>
              <Link href="/posts">게시판</Link>
            </li>
            <li>
              <Link href="/about">About.</Link>
            </li>

            {user?.role === 'admin' && (
              <li>
                <Link href="/listings/create" className="text-yellow-600 font-bold">
                  물건등록
                </Link>
              </li>
            )}

            {!loading && !user && (
              <>
                <li>
                  <Link href="/sign/LoginForm">로그인</Link>
                </li>
                <li>
                  <Link href="/sign/SignupForm">회원가입</Link>
                </li>
              </>
            )}

            {!loading && user && (
              <li className="flex flex-col items-center">
                {/* 닉네임 표시 */}
                <span className="filter_a text-sm text-gray-700 mb-1">{user.nickname} 님</span>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-red-600 font-semibold hover:underline"
                >
                  {loggingOut ? '로그아웃 중...' : '로그아웃'}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
