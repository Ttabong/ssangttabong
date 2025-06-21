'use client';

import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/lib/supabaseClient';
import FilterPanel from './FilterPanel';
import SearchSortBar from './SearchSortBar';
import ListingsGrid, { Listing } from './ListingsGrid';

type ListingsPageProps = {
  title: string;
  description: string;
};

export default function ListingsPage({ title, description }: ListingsPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<'name' | 'price' | 'id_num'>('id_num');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTradeType, setSelectedTradeType] = useState('');
  const [selectedUsageTypes, setSelectedUsageTypes] = useState<string[]>([]);
  const [selectedParkingOptions, setSelectedParkingOptions] = useState<string[]>([]);
  const [selectedPetAllowedOptions, setSelectedPetAllowedOptions] = useState<string[]>([]);

  const [minPriceStr, setMinPriceStr] = useState('');
  const [maxPriceStr, setMaxPriceStr] = useState('');
  const [minDepositStr, setMinDepositStr] = useState('');
  const [maxDepositStr, setMaxDepositStr] = useState('');
  const [minMonthlyStr, setMinMonthlyStr] = useState('');
  const [maxMonthlyStr, setMaxMonthlyStr] = useState('');

  const minPrice = Number(minPriceStr.replace(/[^0-9]/g, '')) || 0;
  const maxPrice = Number(maxPriceStr.replace(/[^0-9]/g, '')) || Infinity;
  const minDeposit = Number(minDepositStr.replace(/[^0-9]/g, '')) || 0;
  const maxDeposit = Number(maxDepositStr.replace(/[^0-9]/g, '')) || Infinity;
  const minMonthly = Number(minMonthlyStr.replace(/[^0-9]/g, '')) || 0;
  const maxMonthly = Number(maxMonthlyStr.replace(/[^0-9]/g, '')) || Infinity;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase.from('listings').select('*');
      if (error) {
        console.error(error);
        setListings([]);
      } else {
        setListings(data as Listing[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const usageArray = Array.isArray(item.usage) ? item.usage : [item.usage];

        if (selectedTradeType && selectedTradeType !== '전체' && item.type !== selectedTradeType)
          return false;

        if (selectedUsageTypes.length > 0) {
          const match = selectedUsageTypes.some((usage) => {
            if (usage === '원/투룸') {
              return (item.room_count ?? 0) >= 1 && (item.room_count ?? 0) <= 2;
            }
            if (usage === '주택') {
              return usageArray.includes('다세대') || usageArray.includes('단독주택');
            }
            return usageArray.includes(usage);
          });
          if (!match) return false;
        }

        if (selectedParkingOptions.length > 0) {
          const parkingOk = selectedParkingOptions[0] === 'O';
          if (item.parking !== parkingOk) return false;
        }

        if (selectedPetAllowedOptions.length > 0) {
          const petOk = selectedPetAllowedOptions[0] === 'O';
          if (item.pet_allowed !== petOk) return false;
        }

        if (
          selectedTradeType === '매매' ||
          selectedTradeType === '' ||
          selectedTradeType === '전체'
        ) {
          if (item.price != null && (item.price < minPrice || item.price > maxPrice)) return false;
        } else if (selectedTradeType === '전세') {
          if (item.deposit != null && (item.deposit < minDeposit || item.deposit > maxDeposit)) return false;
        } else if (selectedTradeType === '월세') {
          if (item.deposit != null && (item.deposit < minDeposit || item.deposit > maxDeposit)) return false;
          if (item.monthly != null && (item.monthly < minMonthly || item.monthly > maxMonthly)) return false;
        }

        if (searchTerm && !item.title.includes(searchTerm.trim())) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortKey === 'name') {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortKey === 'price') {
          const aPrice =
            a.type === '매매' ? a.price ?? 0 : a.type === '전세' ? a.deposit : a.monthly ?? 0;
          const bPrice =
            b.type === '매매' ? b.price ?? 0 : b.type === '전세' ? b.deposit : b.monthly ?? 0;

          return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        } else if (sortKey === 'id_num') {
          return sortOrder === 'asc'
            ? (a.id_num ?? 0) - (b.id_num ?? 0)
            : (b.id_num ?? 0) - (a.id_num ?? 0);
        }
        return 0;
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
  ]);

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

      {/* 상단 제목 + 설명 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#38bdf8] drop-shadow-md">{title}</h1>
        <p className="text-gray-300 mt-2 text-lg">{description}</p>
      </div>

      <div className="h-10" />


      {/* 필터 + 검색 + 정렬 */}
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
        />
      </section>
    
    <hr className="border-t border-orange-400 my-8" />
    <div className="h-3" />

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

        <ListingsGrid listings={filteredListings} loading={loading} />
      
    </main>
  );
}
