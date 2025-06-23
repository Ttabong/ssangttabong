// src/app/layout.tsx
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
  title: '수 부동산',
  description: '성실한 공인중개사 사무소',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen m-0 p-0">
        {/* Header, Main, Footer 를 동일한 max-w 컨테이너로 감쌉니다 */}
        <Header />

        <main className="flex-1 w-full">
             
          <div className="">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  )
}