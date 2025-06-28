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

// 컴포넌트 Props 타입 정의
type Props = {
  listings: Listing[]; // 매물 리스트
  loading: boolean; // 로딩 상태
  userRole: 'admin' | 'user' | null; // 유저 권한
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>; // 삭제 후 목록 갱신용 상태 함수
};

export default function ListingsGrid({ listings, loading, userRole, setListings }: Props) {
  // 매물 삭제 함수 (관리자만 사용)
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm('정말 이 매물을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('listings').delete().eq('id', id);

    if (error) {
      alert('❌ 삭제 실패: ' + error.message);
    } else {
      alert('✅ 매물이 성공적으로 삭제되었습니다.');
      // 삭제된 매물 제외하고 상태 업데이트 (화면 즉시 반영)
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  }

  // 로딩 중 표시
  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  // 매물이 없을 때 표시
  if (listings.length === 0)
    return <p className="text-white text-center mt-10">검색 조건에 맞는 매물이 없습니다.</p>;

  return (
    <section className="w-full grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <div
          key={item.id}
          className="listing-card relative rounded-md overflow-hidden bg-blue-50 shadow-md hover:scale-105 transition-transform"
        >
          {/* 수정/삭제 버튼을 제외한 영역을 링크로 감싸기 */}
          <Link href={`/listings/${item.id}`} className="block">
            {/* 매물 대표 이미지 */}
            <Image
              src={item.image_url_1 ? new URL(item.image_url_1.trim()).toString() : '/default-image.jpg'}
              alt={item.title}
              width={320}
              height={300}
              className="object-cover w-full h-55 rounded-t-md"
              priority
            />

            {/* 매물 정보 영역 */}
            <div>
              <div className="h-2" />
              <div className="space-y-2 leading-relaxed">
                {/* 매물 번호 표시 */}
                <p className="text-xs text-gray-400 mb-1">&nbsp;&nbsp; [ no. {item.id_num} ]</p>

                {/* 매물 제목 */}
                <h3 className="font-bold text-xl">&nbsp;&nbsp; {item.title}</h3>

                {/* 거래 금액 표시 */}
                <p className="mt-1 text-orange-400 font-semibold text-l">&nbsp;&nbsp;&nbsp;&nbsp;
                  {item.type === '매매'
                    ? formatKoreanPrice(item.price)
                    : item.type === '전세'
                    ? formatKoreanPrice(item.deposit)
                    : item.type === '월세'
                    ? `${formatKoreanPrice(item.deposit)} / ${formatKoreanPrice(item.monthly)}`
                    : '-'}
                </p>

                {/* 매물 기본 정보 */}
                <div className="flex gap-3 flex-wrap text-sm text-gray-500 px-2">
                  <span className="filter_a font-semibold">&nbsp; [ {item.type} ]</span>
                  <span>{Array.isArray(item.usage) ? item.usage.join(', ') : item.usage}</span>
                  {item.room_count && item.room_count > 0 && <span>방 {item.room_count}개</span>}
                  <span>{item.parking ? '주차 가능' : '주차 불가'}</span>
                </div>
                <div className="h-2" />
              </div>
            </div>
          </Link>

          {/* 관리자 전용 수정/삭제 버튼 (링크 밖에 둠) */}
          {userRole === 'admin' && (
            <div className="flex gap-2 text-sm font-semibold p-2 border-t border-gray-300 bg-white justify-end">
              <Link
                href={`/listings/edit/${item.id}`}
                className="text-blue-600 hover:underline"
                onClick={e => e.stopPropagation()}
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
              &nbsp;&nbsp;
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
