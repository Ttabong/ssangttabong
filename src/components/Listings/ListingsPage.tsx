'use client';

import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/lib/supabaseClient';
import FilterPanel from './FilterPanel';
import SearchSortBar from './SearchSortBar';
import ListingsGrid, { Listing } from '@/components/Listings/ListingsGrid'; // 정확한 경로로 수정하세요
import { getUserRole } from '@/utils/getUserRole';

// ✅ Props 타입 정의
type ListingsPageProps = {
  title: string;               // 페이지 제목
  description: string;         // 페이지 설명
  fixedUsage?: string[];       // 고정된 용도 필터 (외부에서 지정)
  hideUsage?: boolean;         // 용도 필터 숨김 여부
  fixedRoomCount?: number[];   // 고정된 방 개수 필터
  initialListings?: Listing[]; // 초기 매물 데이터 (서버사이드 등에서 미리 받음)
};

export default function ListingsPage({
  title,
  description,
  fixedUsage,
  fixedRoomCount,
  hideUsage,
  initialListings,
}: ListingsPageProps) {
  // --- 상태관리 ---
  const [listings, setListings] = useState<Listing[]>(initialListings ?? []); // 전체 매물 목록
  const [loading, setLoading] = useState(false);                             // 로딩 상태
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);   // 사용자 권한

  // --- 필터 및 정렬 상태 ---
  const [sortKey, setSortKey] = useState<'name' | 'price' | 'id_num'>('id_num');  // 정렬 기준
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');             // 정렬 순서
  const [searchTerm, setSearchTerm] = useState('');                               // 검색어
  const [selectedTradeType, setSelectedTradeType] = useState('');                 // 거래 유형 선택
  const [selectedUsageTypes, setSelectedUsageTypes] = useState<string[]>([]);     // 용도 선택
  const [selectedParkingOptions, setSelectedParkingOptions] = useState<string[]>([]);  // 주차 옵션
  const [selectedPetAllowedOptions, setSelectedPetAllowedOptions] = useState<string[]>([]); // 반려동물 허용 옵션

  // 가격 및 보증금, 월세의 최소/최대 입력값 (문자열)
  const [minPriceStr, setMinPriceStr] = useState('');
  const [maxPriceStr, setMaxPriceStr] = useState('');
  const [minDepositStr, setMinDepositStr] = useState('');
  const [maxDepositStr, setMaxDepositStr] = useState('');
  const [minMonthlyStr, setMinMonthlyStr] = useState('');
  const [maxMonthlyStr, setMaxMonthlyStr] = useState('');

  // --- 숫자 변환 ---
  // 문자열에서 숫자만 추출, 빈 문자열은 0 또는 Infinity 처리
  const minPrice = Number(minPriceStr.replace(/[^0-9]/g, '')) || 0;
  const maxPrice = Number(maxPriceStr.replace(/[^0-9]/g, '')) || Infinity;
  const minDeposit = Number(minDepositStr.replace(/[^0-9]/g, '')) || 0;
  const maxDeposit = Number(maxDepositStr.replace(/[^0-9]/g, '')) || Infinity;
  const minMonthly = Number(minMonthlyStr.replace(/[^0-9]/g, '')) || 0;
  const maxMonthly = Number(maxMonthlyStr.replace(/[^0-9]/g, '')) || Infinity;

  // --- 사용자 권한 불러오기 ---
  useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole(); // 권한 조회 함수 호출
      setUserRole(role);
    }
    fetchRole();
  }, []);

  // --- 매물 데이터 불러오기 ---
  useEffect(() => {
    // 초기 매물이 이미 있으면 호출 안 함
    if (initialListings && initialListings.length > 0) return;

    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase.from('listings').select('*'); // 전체 매물 조회

      if (error) {
        console.error('Supabase fetch error:', error.message);
        setListings([]); // 에러 시 빈 배열 설정
      } else {
        setListings(data as Listing[]);
      }
      setLoading(false);
    }
    fetchData();
  }, [initialListings]);

  // --- 필터링 및 정렬 (useMemo 최적화) ---
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // usage를 배열로 통일
        const usageArray = Array.isArray(item.usage) ? item.usage : [item.usage];

        // 고정된 방 개수 필터가 있으면 체크
        if (fixedRoomCount?.length && !fixedRoomCount.includes(item.room_count ?? 0)) return false;

        // 고정된 용도 필터 우선 적용
        if (fixedUsage?.length) {
          const match = fixedUsage.some((usage) => usageArray.includes(usage));
          if (!match) return false;
        } 
        // 고정 용도 없으면 사용자 선택 용도 필터 적용
        else if (selectedUsageTypes.length > 0) {
          const match = selectedUsageTypes.some((usage) => {
            if (usage === '원/투룸') {
              // 방수가 1 또는 2개 이면서, usage에 '아파트'가 없으면 통과
              const roomCountMatch = (item.room_count ?? 0) >= 1 && (item.room_count ?? 0) <= 2;
              const isApartment = usageArray.includes('아파트');
              return roomCountMatch && !isApartment; // 아파트 제외 조건 추가
            }
            if (usage === '주택') {
              return usageArray.includes('다세대') || usageArray.includes('단독주택');
            }
            return usageArray.includes(usage);
          });
          if (!match) return false;
        }

        // 거래 유형 필터
        if (selectedTradeType && selectedTradeType !== '전체' && item.type !== selectedTradeType) return false;

        // 주차 가능 여부 필터
        if (selectedParkingOptions.length > 0) {
          const parkingOk = selectedParkingOptions[0] === 'O';
          if (item.parking !== parkingOk) return false;
        }

        // 반려동물 허용 여부 필터
        if (selectedPetAllowedOptions.length > 0) {
          const petOk = selectedPetAllowedOptions[0] === 'O';
          if (item.pet_allowed !== petOk) return false;
        }

        // 가격 범위 필터 (거래 유형별)
        if (selectedTradeType === '매매' || selectedTradeType === '' || selectedTradeType === '전체') {
          if (item.price != null && (item.price < minPrice || item.price > maxPrice)) return false;
        } else if (selectedTradeType === '전세') {
          if (item.deposit != null && (item.deposit < minDeposit || item.deposit > maxDeposit)) return false;
        } else if (selectedTradeType === '월세') {
          if (item.deposit != null && (item.deposit < minDeposit || item.deposit > maxDeposit)) return false;
          if (item.monthly != null && (item.monthly < minMonthly || item.monthly > maxMonthly)) return false;
        }

        // 검색어 필터 (매물 제목 기준)
        if (searchTerm && !item.title.includes(searchTerm.trim())) return false;

        // 모든 조건 통과 시 포함
        return true;
      })
      .sort((a, b) => {
        // 정렬 로직
        if (sortKey === 'name') {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortKey === 'price') {
          // 거래 유형별 가격 비교
          const aPrice = a.type === '매매' ? a.price ?? 0 : a.type === '전세' ? a.deposit : a.monthly ?? 0;
          const bPrice = b.type === '매매' ? b.price ?? 0 : b.type === '전세' ? b.deposit : b.monthly ?? 0;
          return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        } else if (sortKey === 'id_num') {
          return sortOrder === 'asc'
            ? (a.id_num ?? 0) - (b.id_num ?? 0)
            : (b.id_num ?? 0) - (a.id_num ?? 0);
        }
        return 0; // 기본 정렬 없음
      });
  }, [
    listings,
    selectedTradeType,
    selectedUsageTypes,
    selectedParkingOptions,
    selectedPetAllowedOptions,
    minPrice,
    maxPrice,
    minDeposit,
    maxDeposit,
    minMonthly,
    maxMonthly,
    searchTerm,
    sortKey,
    sortOrder,
    fixedRoomCount,
    fixedUsage,
  ]);

  // --- 용도 필터 토글 함수 ---
  function toggleUsageType(usage: string) {
    if (selectedUsageTypes.includes(usage)) {
      setSelectedUsageTypes(selectedUsageTypes.filter((u) => u !== usage));
    } else {
      setSelectedUsageTypes([...selectedUsageTypes, usage]);
    }
  }

  return (
    <main className="container mx-auto px-4">
      <div className="h-10" />

      {/* 제목과 설명 영역 */}
      <div className="text-center mb-10">
        <h1 className="list_title_a text-4xl font-extrabold drop-shadow-md">{title}</h1>
        <p className="list_title_b mt-2 text-lg">{description}</p>
      </div>

      <div className="h-10" />

      {/* 필터 패널 */}
      <section className="flex flex-wrap items-center">
        <FilterPanel
          selectedTradeType={selectedTradeType}
          onTradeTypeChange={(type) => setSelectedTradeType(type === '전체' ? '' : type)}
          selectedUsageTypes={selectedUsageTypes}
          onUsageTypeToggle={toggleUsageType}
          selectedParkingOption={selectedParkingOptions}
          onParkingChange={setSelectedParkingOptions}
          selectedPetAllowedOption={selectedPetAllowedOptions}
          onPetAllowedChange={setSelectedPetAllowedOptions}
          minPriceStr={minPriceStr}
          maxPriceStr={maxPriceStr}
          minDepositStr={minDepositStr}
          maxDepositStr={maxDepositStr}
          minMonthlyStr={minMonthlyStr}
          maxMonthlyStr={maxMonthlyStr}
          onMinPriceChange={setMinPriceStr}
          onMaxPriceChange={setMaxPriceStr}
          onMinDepositChange={setMinDepositStr}
          onMaxDepositChange={setMaxDepositStr}
          onMinMonthlyChange={setMinMonthlyStr}
          onMaxMonthlyChange={setMaxMonthlyStr}
          hideUsage={hideUsage}
        />
      </section>

      <div className="h-3" />

      {/* 검색 및 정렬 바 */}
      <section className="w-full flex flex-wrap gap-10">
        <SearchSortBar
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortKeyChange={(e) => setSortKey(e.target.value as 'name' | 'price' | 'id_num')}
          onSortOrderChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        />
      </section>

      <div className="h-3" />

      {/* 매물 그리드 컴포넌트에 필터링된 매물과 상태, 권한 전달 */}
      <ListingsGrid
        listings={filteredListings}
        loading={loading}
        userRole={userRole}
        setListings={setListings}       // 삭제 등 상태 변경 시 갱신 함수 전달
        totalCount={listings.length}    // 전체 매물 수 (필터 전 원본 데이터)
      />

      <div className="h-8" />
    </main>
  );
}
