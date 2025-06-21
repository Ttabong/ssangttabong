// src/components/Header.tsx
'use client'

import Link from 'next/link'

export default function Header() {
  return (
      <header>
        <div className="container header-inner">
          <Link href='/'>   
            <div className="logo">
              <span>수 부동산</span>
              <span className="text-small"> 공인중개사 사무소</span>
            </div>
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a href="https://www.gwangjin.go.kr/portal/main/main.do" target="_blank" rel="noopener noreferrer">지역정보 </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@ssangttabong" target="_blank" rel="noopener noreferrer">맛집정보 </a>
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

