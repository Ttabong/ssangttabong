'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { formatKoreanPrice } from '@/utils/priceUtils';
import supabase from '@/lib/supabaseClient';

// 매물 타입 정의
export type Listing = {
  id: string;
  id_num: number;
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

// Props 타입 정의
type Props = {
  listings: Listing[]; // 필터링 후 매물 배열
  loading: boolean; // 로딩 상태
  userRole: 'admin' | 'user' | null; // 유저 권한
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>; // 삭제 시 상태 갱신
  totalCount?: number; // 전체 매물 개수 (필터 전)
};

export default function ListingsGrid({
  listings,
  loading,
  userRole,
  setListings,
  totalCount,
}: Props) {

  // 매물 삭제 처리 함수
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm('정말 이 매물을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('listings').delete().eq('id', id);

    if (error) {
      alert('❌ 삭제 실패: ' + error.message);
    } else {
      alert('✅ 매물이 삭제되었습니다.');
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  }

  if (loading) {
    return <p className="filter_a text-center mt-10">로딩 중입니다...</p>;
  }

  if (!loading && (totalCount === 0 || totalCount === undefined)) {
    return <p className="filter_a text-center mt-10">등록된 매물이 없습니다.</p>;
  }

  if (!loading && totalCount && listings.length === 0) {
    return <p className="filter_a text-center mt-10">검색 조건에 맞는 매물이 없습니다.</p>;
  }

  return (
  
    <section className="padT w-full grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <div
          key={item.id}
          className="listing-card cBox relative rounded-md overflow-hidden bg-blue-50 shadow-md hover:scale-105 transition-transform"
        >
          <Link href={`/listings/${item.id}`} className="block">
            <Image
              src={
                item.image_url_1
                  ? new URL(item.image_url_1.trim()).toString()
                  : '/default-image.jpg'
              }
              alt={item.title}
              width={320}
              height={300}
              className="object-cover w-full h-55 rounded-t-md"
              priority
            />

            <div className="space-y-2 leading-relaxed">
              <p className="text-xs text-gray-400 mb-1">&nbsp; [ no. {item.id_num} ]</p>
              <h3 className="font-bold text-xl truncate max-w-full">&nbsp; {item.title}</h3>
              <p className="mt-1 text-red-400 font-semibold text-xl">&nbsp;&nbsp;
                {item.type === '매매'
                  ? formatKoreanPrice(item.price)
                  : item.type === '전세'
                  ? formatKoreanPrice(item.deposit)
                  : item.type === '월세'
                  ? `${formatKoreanPrice(item.deposit)} / ${formatKoreanPrice(item.monthly)}`
                  : '-'}
              </p>
              <div className="flex gap-3 flex-wrap text-sm text-gray-500 px-2">
                <span className="filter_a font-semibold">&nbsp; [ {item.type} ]</span>
                <span>{Array.isArray(item.usage) ? item.usage.join(', ') : item.usage}</span>
                {item.room_count && item.room_count > 0 && <span>방 {item.room_count}개</span>}
                <span>{item.parking ? '주차 가능' : '주차 불가'}</span>
              </div>
            </div>
          </Link>

          {userRole === 'admin' && (
            <div className="flex gap-2 text-sm font-semibold p-2 border-t border-gray-300 bg-white justify-end">
              <Link
                href={`/listings/edit/${item.id}`}
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                수정
              </Link>
              <span className="text-gray-400">|</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
