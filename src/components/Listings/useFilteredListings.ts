// src/components/Listings/useFilteredListings.ts

'use client';

import { useMemo, useState } from 'react';
import type { Listing } from './types';

type FilterDefaults = {
  usageTypes?: string[];
  roomCount?: number[];
};

export function useFilteredListings(initialListings: Listing[], filterDefaults?: FilterDefaults) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'price' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUsageTypes, setSelectedUsageTypes] = useState<string[]>(filterDefaults?.usageTypes ?? []);
  const [selectedRoomCounts, setSelectedRoomCounts] = useState<number[]>(filterDefaults?.roomCount ?? []);

  const filteredListings = useMemo(() => {
    return initialListings
      .filter(item => {
        if (selectedUsageTypes.length > 0) {
          const usageArr = Array.isArray(item.usage) ? item.usage : [item.usage];
          if (!selectedUsageTypes.some(u => usageArr.includes(u))) return false;
        }
        if (selectedRoomCounts.length > 0 && item.room_count) {
          if (!selectedRoomCounts.includes(item.room_count)) return false;
        }
        if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortKey === 'price') {
          const aPrice = Number(a.price ?? 0);
          const bPrice = Number(b.price ?? 0);
          return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        } else {
          return sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
  }, [initialListings, selectedUsageTypes, selectedRoomCounts, searchTerm, sortKey, sortOrder]);

  return {
    filteredListings,
    filters: { searchTerm, sortKey, sortOrder, selectedUsageTypes, selectedRoomCounts },
    handlers: {
      setSearchTerm,
      setSortKey,
      setSortOrder,
      setSelectedUsageTypes,
      setSelectedRoomCounts,
    },
    loading: false,
  };
}

