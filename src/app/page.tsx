import Image from 'next/image';
import Link from 'next/link'; // 흐려져 보이는 이유: 아래에서 Link를 아직 안 썼기 때문



export default function Home() {
  return (
    <>
      <p className="h-10 overflow-hidden"></p>

      <main className="w-full mx-auto py-10 px-4">

        <section className="hero text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">신뢰와 친절로 만족을 약속합니다</h2>
          <p className="mb-4 text-lg">어떤 물건을 찾고 계신가요?</p>
          <Link href="/listings" className="btn-primary block w-full max-w-xl sm:max-w-2xl md:max-w-2xl lg:max-w-4xl px-6 py-3 text-center bg-blue-600 text-white rounded">전체매물 둘러보기</Link>
        </section>

        <section id="products" className="products-section bg-gray-50 py-12">
          <div className="flex flex-wrap justify-center gap-y-20 -mx-10 max-w-screen-xl mx-auto">
            {[
              { title: "원 / 투룸", image: "/images/apart.jpg", href: "/listings/onetwo" },
              { title: "아파트", image: "/images/apart.jpg", href: "/listings/apart" },
              { title: "주택 / 빌라", image: "/images/house.jpg", href: "/listings/house" },
              { title: "오피스텔", image: "/images/office.jpg", href: "/listings/officetel" },
              { title: "상가 / 사무실", image: "/images/shop.jpg", href: "/listings/shop" },
              { title: "건물 / 토지", image: "/images/shop.jpg", href: "/listings/land" },
            ].map(({ title, image, href }, idx) => (
              <Link
                key={idx}
                href={href}
                className="group relative px-5 md:px-8 basis-1/2 md:basis-1/3 lg:basis-1/6 transition-all duration-300"
              >
                <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-[1.05] group-hover:z-10">
                  <div className="h-[180px] overflow-hidden rounded-xl border" style={{ borderColor: '#3678b9' }}>
                    <Image
                      src={image}
                      alt={`${title} 이미지`}
                      width={320}
                      height={180}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span
                    className="mt-4 block w-full text-center text-l font-semibold px-4 py-2 bg-white rounded-full transition-colors"
                    style={{ color: '#3678b9' }}
                  >
                    {title}
                  </span>
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