// 'use client'; // 서버 컴포넌트이므로 주석 유지

import React from 'react';
import supabase from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { formatKoreanPrice } from '@/utils/priceUtils';
import Image from 'next/image';
import AdminControls from '@/components/Listings/Update/AdminControls';

const defaultImage = '/default-image.jpg';

type ListingDetailContentProps = {
  id: string;
};

// 평수 계산 함수 (1평 = 3.3058㎡)
function toPyeong(sqm: number | null | undefined): string {
  if (!sqm || isNaN(sqm)) return '-';
  return (sqm / 3.3058).toFixed(2);
}

// 사용자 역할 확인 함수 (AdminControls용)
export async function getUserRole() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: userData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !userData) return null;
  return userData.role;
}

// 상세 매물 컴포넌트
export default async function ListingDetailContent({ id }: ListingDetailContentProps) {
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error || !data) return notFound();

  const imageList = [
    data.image_url_1,
    data.image_url_2,
    data.image_url_3,
    data.image_url_4,
    data.image_url_5,
    data.image_url_6,
  ].filter(Boolean);
  while (imageList.length < 6) imageList.push(defaultImage);

  const usageText =
    data.usage === '기타' && data.usage_extra
      ? `기타/${data.usage_extra}`
      : data.usage ?? '-';

  const details: [string, React.ReactNode][] = [
    ['거래유형', data.type ?? '-'],
    ['용도', usageText],
    [
      '가격',
      (() => {
        if (data.type === '매매' && data.price) {
          return formatKoreanPrice(Number(data.price)) + ' 원';
        }
        if (data.type === '전세' && data.deposit) {
          return formatKoreanPrice(Number(data.deposit)) + ' 원';
        }
        if (data.type === '월세' && data.deposit && data.monthly) {
          return `${formatKoreanPrice(Number(data.deposit))} 원 / ${formatKoreanPrice(Number(data.monthly))} 원`;
        }
        return '-';
      })(),
    ],
    [
      '관리비',
      <div key="maintenance" className="flex items-center h-full">
        <span className="filter_a text-sm text-gray-700">
          {data.maintenance_fee ?? '-'}
        </span>
      </div>
    ],
    [
      '면적',
      <div key="area">
        {data.area_supply ?? '-'} ㎡ / {data.area_private ?? '-'} ㎡ <br />
        ({toPyeong(data.area_supply)} 평 / {toPyeong(data.area_private)} 평)
      </div>
    ],
    ['층수 / 총층수', `${data.floor ?? '-'}층 / ${data.total_floors ?? data.total_floor ?? '-'}층`],
    ['방향', `${data.direction ?? '-'}${data.direction_base ? ` (${data.direction_base}기준)` : ''}`],
    ['방 수 / 욕실 수', `${data.room_count ?? '-'}개 / ${data.bathrooms ?? '-'}개`],
    [
      '주차',
      <div key="parking">
        <span>{data.parking ? '가능' : '불가'}</span><br />
        <span className="pl-6">
          세대 당 ({data.parking_count ?? 0}대) / 총 ({data.all_parking ?? 0}대)
        </span>
      </div>
    ],
    ['총 세대수', data.households ?? '-'],
    ['애완동물', data.pet_allowed ? '가능' : '불가'],
    [
      '융자금',
      data.loan_amount === null || data.loan_amount === ''
        ? '표시하지 않음'
        : Number(data.loan_amount) === 0
        ? '융자금 없음'
        : `${formatKoreanPrice(data.loan_amount)} 원`,
    ],
    ['임대 현황', data.lease_status ?? '-'],
    ['발코니', data.balcony === null || data.balcony === '' ? '해당 없음' : data.balcony],
    ['난방 / 연료', `${data.warmerType ?? '-'} / ${data.warmer ?? '-'}`],
    [
      '입주가능일',
      data.available_date
        ? new Date(data.available_date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '-',
    ],
    ['사용승인일', data.approval_date ? new Date(data.approval_date).toLocaleDateString('ko-KR') : '-'],
  ];

  return (
    <main className="container mx-auto p-4">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <h1 className="filter_a text-4xl font-extrabold text-sky-400 drop-shadow-md">상세 매물 정보</h1>
        <br/>
        <p className="text-gray-500 text-base sm:text-s md:text-lg">더욱 상세한 정보를 원하시면 언제든지 연락주세요 ^^</p>
        <p className='h-10'></p>
      </div>

      {/* 본문 (이미지 + 설명) */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* 이미지 영역 */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 h-full">
          <div className="grid grid-cols-2 grid-rows-3 gap-4">
            {imageList.map((src, idx) => (
              <div key={idx} className="relative w-full" style={{ paddingBottom: '73%' }}>
                <Image
                  src={src}
                  alt={`매물 사진 ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                  priority
                />
              </div>
            ))}
          </div>
        </div>

        {/* 설명 영역 */}
        <div className="w-full lg:w-1/2 backdrop-blur-md p-6 rounded-md bg-white/10 h-full">
          <div className="flex flex-col gap-6 h-full">
            {/* 제목 */}
            <h1 className="text-2xl md:text-3xl font-bold text-orange-400">{data.title}</h1>

            {/* 설명 */}
            <section className="w-full bg-gray-100 rounded-t-sm p-4">
              <h2 className="filter_a text-xl font-semibold mb-2 text-yellow-400">□ 매물설명</h2>
              <div className='h-3'></div>
              <p className="whitespace-pre-wrap overflow-auto max-h-32 border-b border-gray-500 pb-1">
                &nbsp;&nbsp; {data.description ?? '설명 없음'}
              </p>
            </section>

            {/* 소재지 */}
            <section className="w-full rounded-t-sm p-4">
              <h2 className="text-gray-600 text-xl font-bold mb-2">소재지</h2>
              <p className="filter_a whitespace-pre-wrap font-bold overflow-auto max-h-32">
                {[data.location_1, data.location_2, data.location_3, data.location_4, data.location_5]
                  .filter(Boolean)
                  .join(' ') || '주소 정보 없음'}
              </p>
            </section>

            {/* 상세 항목 */}
            {details.map(([label, value], i) => (
              <div
                key={i}
                className="flex justify-between items-center rounded-md bg-white/5 border border-gray-200 "
              >
                <span className="proD font-semibold text-s text-gray-500 whitespace-nowrap ">{label}</span>
                <span className="proD filter_a text-right text-s text-blue-400 break-words max-w-full">{value}</span>
              </div>
            ))}

            {/* 관리자 버튼 */}
            <div className="flex justify-end mt-4">
              <AdminControls listingId={id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
