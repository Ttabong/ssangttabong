'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { formatKoreanPrice } from '@/utils/priceUtils';

export type Listing = {
  id: string;
  id_num: number; // 추가된 부분
  image_url_1: string;
  title: string;
  deposit: number;
  monthly?: number | null;
  price?: number | null;
  type: '매매' | '전세' | '월세';
  usage: string[] | string;
  pet_allowed: boolean;
  parking: boolean;
  room_count?: number;
};

type Props = {
  listings: Listing[];
  loading: boolean;
};

export default function ListingsGrid({ listings, loading }: Props) {
  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (listings.length === 0)
    return <p className="text-white text-center mt-10">검색 조건에 맞는 매물이 없습니다.</p>;

  return (

    <section className="w-full grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <div
          key={item.id}
          className="relative rounded-md overflow-hidden hover:scale-105 transition-transform bg-blue-50"
        >
          <Link href={`/listings/${item.id}`}>
            <Image
              src={item.image_url_1}
              alt={item.title}
              width={320}
              height={200}
              className="object-cover w-full h-48 rounded-md"
              priority={true}
            />
          </Link>

          <div className="mx-5">
            {/* id_num 표시: 작은 글씨로 타이틀 위에 */}
            <p className="text-xs text-gray-400 mb-1">no. {item.id_num}</p>

            <Link href={`/listings/${item.id}`}>
              <h3 className="font-bold text-lg">{item.title}</h3>
            </Link>

            <p className="mt-1 text-orange-400 font-semibold text-l">
              {item.type === '매매'
                ? formatKoreanPrice(item.price)
                : item.type === '전세'
                ? formatKoreanPrice(item.deposit)
                : item.type === '월세'
                ? `${formatKoreanPrice(item.deposit)} / ${formatKoreanPrice(item.monthly)}`
                : '-'}
            </p>

            <div className="flex gap-3 mt-1 text-sm text-gray-500">
              <span className="filter_a font-semibold"> [ {item.type} ]</span>
              <span>{Array.isArray(item.usage) ? item.usage.join(', ') : item.usage}</span>
              {item.room_count && item.room_count > 0 ? <span>방 {item.room_count}개</span> : null}
              <span>{item.parking ? '주차 가능' : '주차 불가'}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}


