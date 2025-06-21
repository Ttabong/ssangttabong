import React from 'react';
import Image from 'next/image'; // next/image import 추가
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const defaultImage = '/default-image.jpg';

type DetailPageProps = {
  params: {
    id: string;
  };
};

export default async function DetailPage({ params }: DetailPageProps): Promise<JSX.Element> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  function formatKoreanPrice(price: number | null | undefined): string {
    if (!price || isNaN(price)) return '-';
    if (price >= 100000000) {
      const eok = Math.floor(price / 100000000);
      const man = Math.floor((price % 100000000) / 10000);
      return man > 0 ? `${eok}억 ${man}만` : `${eok}억`;
    } else if (price >= 10000) {
      return `${Math.floor(price / 10000)}만`;
    } else {
      return price.toString();
    }
  }

  // 이미지 목록 생성, 빈값은 기본 이미지로 대체
  const imageList = [
    data.image_url_1,
    data.image_url_2,
    data.image_url_3,
    data.image_url_4,
    data.image_url_5,
    data.image_url_6,
  ].filter(Boolean) as string[];

  // 최소 6장 이미지 채우기 (빈칸 기본 이미지)
  while (imageList.length < 6) {
    imageList.push(defaultImage);
  }

  // usage가 배열일 수도 있고, 아니면 문자열일 수도 있으니 안전하게 처리
  const usageText = Array.isArray(data.usage) ? data.usage.join(', ') : data.usage ?? '-';

  // 상세정보 항목 배열 (빈 배열은 구분용, 건너뜀)
  const details: [string, React.ReactNode][] = [
    ['\u00A0\u00A0●\u00A0거래유형', data.type],
    [
      '\u00A0\u00A0●\u00A0가격',
      data.type === '매매'
        ? formatKoreanPrice(data.price)
        : `${formatKoreanPrice(data.deposit)} / ${formatKoreanPrice(data.monthly)}`,
    ],
    ['\u00A0\u00A0●\u00A0용도', usageText],
    ['\u00A0\u00A0●\u00A0방 수', data.room_count ?? '-'],
    ['\u00A0\u00A0●\u00A0욕실 수', data.bathroom_count ?? '-'],
    ['\u00A0\u00A0●\u00A0주차', data.parking ? '가능' : '불가'],
    ['\u00A0\u00A0●\u00A0애완동물', data.pet_allowed ? '가능' : '불가'],
    ['\u00A0\u00A0●\u00A0방향', data.direction ?? '-'],
    ['\u00A0\u00A0●\u00A0입주가능일', data.available_date ?? '-'],
    ['\u00A0\u00A0●\u00A0관리비', data.maintenance_fee ?? '-'],
    ['\u00A0\u00A0●\u00A0융자금', data.loan_amount ?? '-'],
    ['\u00A0\u00A0●\u00A0층수', data.floor ?? '-'],
  ];

  return (
    <main>
      <div className="h-10" />

      {/* 제목 영역 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#38bdf8] drop-shadow-md">상세 매물 정보</h1>
        <p className="text-gray-300 mt-2 text-lg">더욱 상세한 정보를 원하시면 언제든지 연락주세요 ^^.</p>
      </div>

      <div className="h-10" />

      <div className="flex justify-center items-start min-h-[600px] px-4 py-8 bg-[#0f172a]">
        <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 mt-10">
          {/* 사진 영역 + 설명 영역 */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {/* 사진 영역 */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
              {imageList.map((src, idx) => (
                <button
                  key={idx}
                  className="overflow-hidden rounded-md shadow-lg border border-white"
                  onClick={() => window.open(src, '_blank')}
                  aria-label={`매물 사진 ${idx + 1} 확대보기`}
                >
                  {/* Next.js 이미지 최적화를 위해 아래 img 대신 Image 컴포넌트 사용 권장 */}
                  {/* <img
                    src={src}
                    alt={`매물 사진 ${idx + 1}`}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-200"
                  /> */}
                  <Image
                    src={src}
                    alt={`매물 사진 ${idx + 1}`}
                    width={320}
                    height={160}
                    className="rounded-md object-cover hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>

            {/* 매물설명 영역 */}
            <section className="w-full border border-white p-4 rounded-md text-white">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1 text-yellow-400">
                &nbsp; □ 매물설명
              </h2>
              <p className="whitespace-pre-wrap h-29 overflow-auto">&nbsp;-&nbsp; {data.description ?? '설명 없음'}</p>
            </section>
          </div>

          {/* 상세정보 영역 */}
          <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-sm p-6 rounded-md shadow text-gray-100 h-full pt-4 border border-white">
            <h1 className="text-3xl font-bold text-orange-400 mb-6 h-15 flex items-center">
              &nbsp; ○ {data.title}
            </h1>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-left border-t border-b border-gray-500 py-4">
              {details.map(([label, value], i) => (
                <React.Fragment key={i}>
                  <div className="font-semibold">{label}</div>
                  <div>{value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
