
'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-5 pt-20 pb-12 sm:px-8 sm:pt-28">

      <div className="w-full max-w-3xl">

        {/* 제목 영역 */}
        <div className="mb-14 text-center">

          <div className="mb-6 text-5xl">⚙️</div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            관리자 대시보드
          </h1>

          <div className="h-6" />

          <p className="text-sm tracking-wide text-gray-500 sm:text-base">
            수 부동산 관리 시스템
          </p>

          <div className="h-6" />

        </div>

        {/* 관리자 메뉴 카드 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* 회원 관리 */}
          <button
            onClick={() => router.push('/admin/users')}
            style={{ padding: '36px' }}
            className="group flex min-h-[240px] flex-col items-start rounded-2xl border border-blue-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3678b9] transition duration-300 group-hover:bg-blue-100">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>

            </div>

            <div className="mt-7">

              <h2 className="text-xl font-bold text-gray-800">
                회원 관리
              </h2>

              <div className="h-3" />

              <p className="text-sm leading-6 text-gray-500">
                회원 정보 및 관리자 권한 관리
              </p>

            </div>

            <div className="mt-auto flex w-full justify-end pt-5">
              <span className="text-2xl text-blue-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#3678b9]">
                ↗
              </span>
            </div>

          </button>

          {/* 매물 보관함 */}
          <button
            onClick={() => router.push('/admin/listings')}
            style={{ padding: '36px' }}
            className="group flex min-h-[240px] flex-col items-start rounded-2xl border border-orange-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#eb8a4a] transition duration-300 group-hover:bg-orange-100">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9v12h14V9" />
                <path d="M9 21v-7h6v7" />
              </svg>

            </div>

            <div className="mt-7">

              <h2 className="text-xl font-bold text-gray-800">
                매물 보관함
              </h2>

              <div className="h-3" />

              <p className="text-sm leading-6 text-gray-500">
                삭제된 매물 확인 및 복원
              </p>

            </div>

            <div className="mt-auto flex w-full justify-end pt-5">
              <span className="text-2xl text-orange-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#eb8a4a]">
                ↗
              </span>
            </div>

          </button>

        </div>

        {/* 하단 문구 */}
        <div className="mt-12 text-center">

          <p className="text-xs tracking-widest text-gray-400">
           
          </p>

        </div>

      </div>

    </div>
  );
}
