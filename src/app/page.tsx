import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="container_m">

        <section
          className="hero text-center relative overflow-hidden"
          style={{
            backgroundImage: 'url("/images/main.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 반투명 오버레이 */}
          <div className="absolute inset-0 bg-white opacity-60 z-0" />

          {/* 콘텐츠 영역 */}
          <div className="relative z-10 py-20 px-4">
            <h2 className="text-3xl font-bold gap-5">
              신뢰와 친절로<br className="block sm:hidden" />
              &nbsp;만족을 약속합니다
            </h2>

        {/*    <p className="mb-6 text-lg">어떤 물건을 찾고 계신가요?</p>  */}
          

            <Link href="/listings" className="hero_b inline-block">
              전체매물 둘러보기
            </Link>
          </div>
        </section>

        <section id="products" className="products-section flex flex-wrap bg-gray-50 py-12 rounded-xl items-center">
          <div className="grid grid-cols-3 gap-3 max-w-screen-xl mx-auto
                          md:grid-cols-6 md:auto-rows-fr">
            {[
              { title: "원 / 투룸", image: "/images/broom.jpg", href: "/listings/onetwo" },
              { title: "아파트", image: "/images/apart.jpg", href: "/listings/apart" },
              { title: "주택 / 빌라", image: "/images/house.jpg", href: "/listings/house" },
              { title: "오피스텔", image: "/images/office.jpg", href: "/listings/officetel" },
              { title: "상가 / 사무실", image: "/images/shop.jpg", href: "/listings/shop" },
              { title: "건물 / 토지", image: "/images/land.jpg", href: "/listings/land" },
            ].map(({ title, image, href }, idx) => (
              <Link
                key={idx}
                href={href}
                className="cBox group relative rounded-3xl overflow-hidden bg-white shadow-2xl hover:shadow-xl transition transform hover:scale-105"
              >
                <article className="flex flex-col">
                  <div className=" overflow-hidden border border-blue-400 rounded-t-3xl w-full h-30">
                    <Image
                      src={image}
                      alt={`${title} 이미지`}
                      width={200}
                      height={100}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span className="filter_a mt-4 px-4 py-2 text-center text-lg font-semibold">
                    {title}
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-5" />


          <div className="pad flex items-center grid sm:grid-cols-1 gap-3 max-w-screen-xl mx-auto md:grid-cols-3 md:auto-rows-fr">


          <Link href="/lotto">
            <Image
              src="/images/lottoLink.jpg"
              alt="로또번호 생성"
              width={600}
              height={300}
              className="hero mx-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </Link>

          <Link href="/invest">
            <Image
              src="/images/simul.jpg"
              alt="준비중"
              width={600}
              height={300}
              className="hero mx-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </Link>

          <Link href="/">
            <Image
              src="/images/ing.jpg"
              alt="준비중"
              width={600}
              height={300}
              className="hero mx-auto cursor-pointer hover:scale-105 transition-transform"
            />
          </Link>

          </div>
      </main>
    </>
  );
}
