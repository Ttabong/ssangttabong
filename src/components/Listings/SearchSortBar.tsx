'use client';

import React from 'react';

type Props = {
  searchTerm: string;
  onSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  sortKey: 'name' | 'price' | 'id_num';  // id_num 추가
  sortOrder: 'asc' | 'desc';

  onSortKeyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SearchSortBar({
  searchTerm,
  onSearchTermChange,
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: Props) {
  return (
    
    <div className="flex justify-between items-center px-12 mb-4 w-full flex-wrap gap-4">
      <input
        type="text"
        placeholder=" 매물검색..."
        value={searchTerm}
        onChange={onSearchTermChange}
        className="
          w-72
          h-11
          text-lg
          placeholder-gray-500
          bg-gray-100
          border-2
          border-yellow-400
          rounded-lg
          shadow-md
          focus:outline-none
          focus:ring-4
          focus:ring-[#38bdf8]
          focus:border-[#0ea5e9]
          transition
        "
      />

      <div className="flex items-center gap-2 cursor-pointer">
        <p className="font-semibold text-yellow-400">◈ 정렬</p>
        <select
          value={sortKey}
          onChange={onSortKeyChange}
          className="bg-gray-700 text-white rounded-md px-3 py-1 mr-2 text-lg"
        >
          <option value="name">이름순</option>
          <option value="price">가격순</option>
          <option value="id_num">등록순</option>  {/* id_num 옵션 추가 */}
        </select>

        <select
          value={sortOrder}
          onChange={onSortOrderChange}
          className="bg-gray-700 text-white rounded-md px-3 py-1 text-lg"
        >
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    </div>
  );
}
