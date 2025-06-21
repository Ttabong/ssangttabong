// src/components/Header.tsx
'use client'

import Link from 'next/link'

export default function Header() {
  return (
      <header>
        <div className="container header-inner">
          <div className="logo">
            <span>수 부동산</span>
            <span className="text-small"> 공인중개사 사무소</span>
          </div>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">물건정보</Link>
              </li>
              <li>
                <Link href="/about">지역정보</Link>
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

