// src/app/listings/[id]/ListingDetailContent.tsx
import React from 'react';
import supabase from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { formatKoreanPrice } from '@/utils/priceUtils';
import ImageButton from '@/components/ImageButton';

const defaultImage = '/default-image.jpg';

type ListingDetailContentProps = {
  id: string;
};

export default async function ListingDetailContent({ id }: ListingDetailContentProps) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return notFound();

  const imageList = [
    data.image_url_1,
    data.image_url_2,
    data.image_url_3,
    data.image_url_4,
    data.image_url_5,
    data.image_url_6,
  ].filter(Boolean);

  while (imageList.length < 6) {
    imageList.push(defaultImage);
  }

  const usageText = Array.isArray(data.usage) ? data.usage.join(', ') : data.usage ?? '-';

  const details: [string, React.ReactNode][] = [
    ['거래유형', data.type],
    [
      '가격',
      data.type === '매매'
        ? formatKoreanPrice(data.price)
        : data.type === '전세'
        ? formatKoreanPrice(data.deposit)
        : `${formatKoreanPrice(data.deposit)} / ${formatKoreanPrice(data.monthly)}`,
    ],
    ['용도', usageText],
    ['방 수', data.room_count ?? '-'],
    ['욕실 수', data.bathroom_count ?? '-'],
    ['주차', data.parking ? '가능' : '불가'],
    ['애완동물', data.pet_allowed ? '가능' : '불가'],
    ['방향', data.direction ?? '-'],
    ['입주가능일', data.available_date ?? '-'],
    ['관리비', data.maintenance_fee ?? '-'],
    ['융자금', data.loan_amount ? formatKoreanPrice(data.loan_amount) : '-'],
    ['층수/총층수', `${data.floor ?? '-'} / ${data.total_floor ?? '-'}`],
  ];

  return (
    <main>
      <div className="h-10" />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#38bdf8] drop-shadow-md">상세 매물 정보</h1>
        <p className="text-gray-300 mt-2 text-lg">더욱 상세한 정보를 원하시면 언제든지 연락주세요 ^^.</p>
      </div>

      <div className="h-10" />

      <div className="flex justify-center items-start min-h-[600px] px-4 py-8 bg-[#0f172a]">
        <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 mt-10">
          {/* 왼쪽 영역 */}
          <div className="w-full md:w-1/2 flex flex-col justify-between gap-6 h-full">
            {/* 이미지 그리드 */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4 w-full h-[360px]">
              {imageList.map((src, idx) => (
                <ImageButton key={idx} src={src} alt={`매물 사진 ${idx + 1}`} />
              ))}
            </div>

            {/* 설명 */}
            <section
              className="w-full border border-white rounded-md text-white flex-1 overflow-auto"
              style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-500 pb-1 text-yellow-400">□ 매물설명</h2>
              <p className="whitespace-pre-wrap overflow-auto h-20">{data.description ?? '설명 없음'}</p>
            </section>
          </div>

          {/* 오른쪽 상세정보 */}
          <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-sm p-6 rounded-md shadow text-gray-100 border border-white flex flex-col gap-6">
            {/* 제목 */}
            <h1
              className="text-2xl md:text-3xl font-bold text-orange-400 border-b border-gray-500 pb-2"
              style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem', minHeight: '70px' }}
            >
              ○ {data.title}
            </h1>

            {/* 상세 정보 */}
            <div
              className="grid grid-cols-2 gap-5 text-xl"
              style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              {details.map(([label, value], i) => (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-md bg-white/5"
                  style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                >
                  <span className="font-semibold text-yellow-300 whitespace-nowrap">{label}</span>
                  <span className="text-right text-gray-200 break-words max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
