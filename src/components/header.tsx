// src/components/Header.tsx
'use client'

import Link from 'next/link'

export default function Header() {
  return (
      <header>
        <div className="container header-inner">
          <div className="flex items-end gap-2">
            {/* 로고 */}
            <Link href="/" className="block w-fit h-fit">
              <div className="logo leading-none text-large">
                수 부동산
              </div>
            </Link>

            {/* 오른쪽 텍스트 두 줄 */}
            <Link href="/" className="block w-fit h-fit">
              <div className="flex flex-col justify-between h-full leading-tight">
                <div className="text-ss">
                  Real Estate Agent
                </div>
                <div className="text-small">
                  공인중개사 사무소
                </div>
              </div>
            </Link>
              
          </div>

<div className="text-l text-red-500 text-bold">  ★ 실제 매물이 아닌 테스트 페이지 입니다. </div>
          
          <nav className="w-full flex justify-end pr-4">
            <ul className="flex space-x-4 text-sm sm:text-base font-semibold gap-4">
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
                <Link href="/about">About.</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  )
}

