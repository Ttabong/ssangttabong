'use client';

import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/lib/supabaseClient';
import FilterPanel from './FilterPanel';
import SearchSortBar from './SearchSortBar';
import ListingsGrid, { Listing } from './ListingsGrid';

type ListingsPageProps = {
  title: string;
  description: string;
  fixedUsage?: string[];
  hideUsage?: boolean;
  fixedRoomCount?: number[];
  initialListings?: Listing[];
};

export default function ListingsPage({
  title,
  description,
  fixedUsage,
  fixedRoomCount,
  hideUsage,
  initialListings,
}: ListingsPageProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings ?? []);
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
    if (initialListings && initialListings.length > 0) return;

    async function fetchData() {
      setLoading(true);
      
    const { data, error } = await supabase.from('listings').select('*');

      if (error) {
        console.error('❌ Supabase fetch error:', error.message);
        setListings([]);
      } else {
        setListings(data as Listing[]);
      }
      setLoading(false);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // `initialListings`가 처음에 한 번만 적용되면 되므로 제거

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const usageArray = Array.isArray(item.usage) ? item.usage : [item.usage];

        if (fixedRoomCount?.length && !fixedRoomCount.includes(item.room_count ?? 0)) return false;

        if (fixedUsage?.length) {
          const match = fixedUsage.some((usage) => usageArray.includes(usage));
          if (!match) return false;
        } else if (selectedUsageTypes.length > 0) {
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

        if (selectedTradeType && selectedTradeType !== '전체' && item.type !== selectedTradeType)
          return false;

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
          const aPrice = a.type === '매매' ? a.price ?? 0 : a.type === '전세' ? a.deposit : a.monthly ?? 0;
          const bPrice = b.type === '매매' ? b.price ?? 0 : b.type === '전세' ? b.deposit : b.monthly ?? 0;
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
    fixedRoomCount,
    fixedUsage,
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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#38bdf8] drop-shadow-md">{title}</h1>
        <p className="text-gray-300 mt-2 text-lg">{description}</p>
      </div>
      <div className="h-10" />

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
      <div className="h-8" />
    </main>
  );
}
