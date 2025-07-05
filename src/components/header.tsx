'use client'

import Link from 'next/link'
import { useState } from 'react'
import useUser from '@/hooks/useUser'
import supabase from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa' // 사람 아이콘 임포트

export default function Header() {
  const { user, loading } = useUser() // 현재 로그인한 사용자 정보 및 로딩 상태
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false) // 로그아웃 중 상태 관리

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut() // Supabase 로그아웃
    router.push('/sign/LoginForm') // 로그아웃 후 로그인 페이지로 이동
    setLoggingOut(false)
  }

  return (
    <header>
      <div className="container header-inner flex items-center justify-between py-3">
        {/* 로고 영역 */}
        <div className="flex items-end gap-2">
          <Link href="/" className="block w-fit h-fit">
            <div className="logo leading-none text-large font-bold">수 부동산</div>
          </Link>

          <Link href="/" className="block w-fit h-fit">
            <div className="flex flex-col justify-between h-full leading-tight">
              <div className="text-xs text-gray-500">Real Estate Agent</div>
              <div className="filter_a xs">공인중개사 사무소</div>
            </div>
          </Link>
        </div>

       

        {/* 네비게이션 바 */}
        <nav className="w-full overflow-x-auto flex justify-end">
          <ul
            className="
              header-inner
              flex
              flex-nowrap          /* 줄 바꿈 방지해서 메뉴가 한 줄에 유지되도록 */
              space-x-4
              gap-3
              md:gap-9
              font-semibold
              text-base               /* 기본 글자 크기 */
              md:text-lg            /* md 이상에서는 글자 크기 좀 더 크게 */
              overflow-x-auto       /* 메뉴 길면 가로 스크롤 생김 */
              scrollbar-hide        /* 스크롤바 숨김 (플러그인 또는 스타일 적용 필요) */
              min-w-0
            "
          >
            <li>
              <Link href="/" className='text-sm md:text-lg transitionhover:text-red-500 transition'>Home</Link>
            </li>
         {/*}   <li>
              <a
                href="https://www.gwangjin.go.kr/portal/main/main.do"
                target="_blank"
                rel="noopener noreferrer"
                className='text-sm md:text-lg hover:text-blue-500 transition'
              >
                지역정보
              </a>
            </li> */}
            <li> 
              <a
                href="https://www.youtube.com/@ssangttabong"
                target="_blank"
                rel="noopener noreferrer"
                className='text-sm md:text-lg hover:text-blue-500 transition'
              >
                맛집정보
              </a>
            </li>
            <li>
              <Link href="/posts" className='text-sm md:text-lg hover:text-blue-500 transition'>게시판</Link>
            </li>
            <li>
              <Link href="/about" className='text-sm md:text-lg hover:text-blue-500 transition'>About.</Link>
            </li>



          
              {/* 비로그인 상태일 때 로그인 / 회원가입 링크 */}
              {!loading && !user && (
                <>
                  <li>
                    |&nbsp;{' '}
                    <Link className="filter_a text-xs md:text-lg" href="/sign/LoginForm">
                      로그인
                    </Link>
                  </li>
                  <li>
                    <Link className="filter_a text-xs md:text-lg" href="/sign/SignupForm">
                      회원가입
                    </Link>
                  </li>
                </>
              )}

             {/* 로그인 상태일 때 닉네임 및 로그아웃 버튼 영역 - 로고 오른쪽, 네비 위로 이동 */}
            {!loading && user && (
              <div
                className="magL flex flex-col items-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-1 min-w-[90px] shadow-md mr-6"
                style={{ height: '52px' }} // 헤더 높이 맞춤
              >
                {/* 닉네임 영역: 사람 아이콘 + 닉네임 클릭 시 회원정보수정 페이지로 이동 */}
                <button
                  onClick={() => router.push('/sign/profile')}
                  className="magT flex items-center text-gray-700 font-semibold max-w-[120px] truncate whitespace-nowrap overflow-hidden text-s text-center hover:text-orange-500 transition"
                  aria-label="회원정보 수정 페이지로 이동"
                  type="button"
                >
                  <FaUser className="text-orange-500 mr-2 flex-shrink-0" />
                  <span>{user.nickname} 님</span>
                </button>
                <div className='h-1'></div>
                {/* 로그아웃 버튼 */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm w-full "
                  style={{ minWidth: '100px' }}
                >
                  {loggingOut ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            )}
          <div className=''>
            {/* 관리자용 메뉴, admin role일 때만 노출, 빨간색 버튼 스타일 */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  href="/listings/create"
                  className="btn-loginR text-center transition"
                >
                  물건등록
                </Link>
              </li>
            )}

            {user?.role === 'admin' && (
              <li>
                <Link
                  href="/admin/users"
                  className="btn-login text-center transition"
                >
                  회원관리
                </Link>
              </li>
            )}
          </div>

          </ul>
        </nav>
      </div>
    </header>
  )
}
