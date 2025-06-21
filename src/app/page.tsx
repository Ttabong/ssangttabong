import Image from 'next/image';
import Link from 'next/link'; // 흐려져 보이는 이유: 아래에서 Link를 아직 안 썼기 때문



export default function Home() {
  return (
    <>
      <p className="h-10 overflow-hidden"></p>

      <main className="w-full mx-auto px-4 py-10">
        <section className="hero text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">신뢰와 친절로 만족을 약속합니다</h2>
          <p className="mb-4 text-lg">어떤 물건을 찾고 계신가요?</p>
          <a href="/listings" className="btn-primary inline-block px-6 py-2 bg-blue-600 text-white rounded">전체매물 둘러보기</a>
        </section>

        <section id="products" className="products-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {[
              { title: "원 / 투룸", image: "/images/apart.jpg", href: "/listings/room" },
              { title: "아파트", image: "/images/apart.jpg", href: "/listings/apart" },
              { title: "주택 / 빌라", image: "/images/house.jpg", href: "/listings/house" },
              { title: "오피스텔", image: "/images/office.jpg", href: "/listings/officetel" },
              { title: "상가 / 사무실", image: "/images/shop.jpg", href: "/listings/shop" },
              { title: "건물 / 토지", image: "/images/shop.jpg", href: "/listings/land" },
            ].map(({ title, image, href }, idx) => (
               <Link key={idx} href={href} className="block group">
              <article key={idx} className="product-card bg-white rounded shadow p-4 max-w-[420px] mx-auto">
                <Image src={image} alt="예쁜 집 이미지" width={420} height={300} className="rounded" />
                <h3 className="text-xl font-semibold mt-4">{title}</h3>
                <div className="price mt-2 text-gray-700">매매 | 전세 | 월세</div>
                <button className="btn-secondary mt-4 px-4 py-2 bg-gray-200 rounded">보러가기</button>
              </article>
              </Link>
            ))}
          </div>
        </section>
        <div className="h-10" />
      </main>
    </>
  );
}