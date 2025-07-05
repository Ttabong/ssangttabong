'use client';

import React from 'react';
import { formatKoreanPrice, handleCommaInput } from '@/utils/priceUtils';

const USAGE_TYPES = ['아파트', '원/투룸', '주택', '오피스텔', '상가', '토지'];
const PARKING_OPTIONS = ['O', 'X'];
const PET_ALLOWED_OPTIONS = ['O', 'X'];

type FilterPanelProps = {
  selectedTradeType: string;
  onTradeTypeChange: (type: string) => void;
  selectedUsageTypes: string[];
  onUsageTypeToggle: (usage: string) => void;
  selectedParkingOption: string[];
  onParkingChange: (option: string[]) => void;
  selectedPetAllowedOption: string[];
  onPetAllowedChange: (option: string[]) => void;
  minPriceStr: string;
  maxPriceStr: string;
  minDepositStr: string;
  maxDepositStr: string;
  minMonthlyStr: string;
  maxMonthlyStr: string;
  onMinPriceChange: React.Dispatch<React.SetStateAction<string>>;
  onMaxPriceChange: React.Dispatch<React.SetStateAction<string>>;
  onMinDepositChange: React.Dispatch<React.SetStateAction<string>>;
  onMaxDepositChange: React.Dispatch<React.SetStateAction<string>>;
  onMinMonthlyChange: React.Dispatch<React.SetStateAction<string>>;
  onMaxMonthlyChange: React.Dispatch<React.SetStateAction<string>>;
  hideUsage?: boolean;
};

export default function FilterPanel({
  selectedTradeType,
  onTradeTypeChange,
  selectedUsageTypes,
  onUsageTypeToggle,
  selectedParkingOption,
  onParkingChange,
  selectedPetAllowedOption,
  onPetAllowedChange,
  minPriceStr,
  maxPriceStr,
  minDepositStr,
  maxDepositStr,
  minMonthlyStr,
  maxMonthlyStr,
  onMinPriceChange,
  onMaxPriceChange,
  onMinDepositChange,
  onMaxDepositChange,
  onMinMonthlyChange,
  onMaxMonthlyChange,
  hideUsage = false,
}: FilterPanelProps) {
  return (
    <div className="w-full p-4 rounded-md shadow-md space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:gap-x-17 lg:items-end">
        {/* 거래 유형 */}
        <div className="space-y-2">
          <p className="filter_a text-lg font-bold text-gray-700">◈ 거래 유형</p>
          <div className="flex flex-wrap gap-3 items-center">
            {['전체', '매매', '전세', '월세'].map((type) => (
              <label key={type} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tradeType"
                  checked={selectedTradeType === type || (type === '전체' && selectedTradeType === '')}
                  onChange={() => onTradeTypeChange(type)}
                  className="accent-sky-500"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* 용도 */}
        {!hideUsage && (
          <div className="space-y-2">
            <p className="filter_a text-lg font-bold text-gray-700">◈ 용도</p>
            <div className="flex flex-wrap text-xs sm:text-base md:text-lg gap-2 items-center">
              {USAGE_TYPES.map((usage) => (
                <label key={usage} className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUsageTypes.includes(usage)}
                    onChange={() => onUsageTypeToggle(usage)}
                    className="accent-sky-500"
                  />
                  {usage}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 주차 여부 */}
        <div className="space-y-2">
          <p className="filter_a text-lg font-bold text-gray-700">◈ 주차 여부</p>
          <div className="flex gap-2 items-center">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="parking"
                checked={selectedParkingOption.length === 0}
                onChange={() => onParkingChange([])}
                className="accent-sky-500"
              />
              전체
            </label>
            {PARKING_OPTIONS.map((option) => (
              <label key={option} className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="parking"
                  checked={selectedParkingOption[0] === option}
                  onChange={() => onParkingChange([option])}
                  className="accent-sky-500"
                />
                {option === 'O' ? '가능' : '불가'}
              </label>
            ))}
          </div>
        </div>

        {/* 애완동물 */}
        <div className="space-y-2">
          <p className="filter_a text-lg font-bold text-gray-700">◈ 애완동물</p>
          <div className="flex gap-2 items-center">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="pet"
                checked={selectedPetAllowedOption.length === 0}
                onChange={() => onPetAllowedChange([])}
                className="accent-sky-500"
              />
              전체
            </label>
            {PET_ALLOWED_OPTIONS.map((option) => (
              <label key={option} className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="pet"
                  checked={selectedPetAllowedOption[0] === option}
                  onChange={() => onPetAllowedChange([option])}
                  className="accent-sky-500"
                />
                {option === 'O' ? '가능' : '불가'}
              </label>
            ))}
          </div>
        </div>
      </div>
            
   
      <div className='h-3'></div>      


      {/* 거래 유형별 가격 필터 */}
      {selectedTradeType === '매매' && (
        <PriceRange
          label="가격 범위"
          minValue={minPriceStr}
          maxValue={maxPriceStr}
          onMinChange={onMinPriceChange}
          onMaxChange={onMaxPriceChange}
        />
      )}
      {selectedTradeType === '전세' && (
        <PriceRange
          label="보증금 범위"
          minValue={minDepositStr}
          maxValue={maxDepositStr}
          onMinChange={onMinDepositChange}
          onMaxChange={onMaxDepositChange}
        />
      )}
      {selectedTradeType === '월세' && (
        <>
          <PriceRange
            label="보증금 범위"
            minValue={minDepositStr}
            maxValue={maxDepositStr}
            onMinChange={onMinDepositChange}
            onMaxChange={onMaxDepositChange}
          />
          <PriceRange
            label="월차임 범위"
            minValue={minMonthlyStr}
            maxValue={maxMonthlyStr}
            onMinChange={onMinMonthlyChange}
            onMaxChange={onMaxMonthlyChange}
          />
        </>
      )}

 
    </div>
  );
}

function PriceRange({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: React.Dispatch<React.SetStateAction<string>>;
  onMaxChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (

      <div>
        <div className='h-3'></div>
        <div className="space-y-2">
          <p className="text-lg font-bold text-gray-500">◈ {label}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-4">
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                placeholder={`  최소 ${label}`}
                value={minValue}
                onChange={(e) => handleCommaInput(e, onMinChange)}
                className="p-2 border border-gray-300 rounded-md w-40 text-base"
              />
              <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(minValue)}</div>
            </div>
            <span className="font-bold text-xl">~</span>
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                placeholder={`  최대 ${label}`}
                value={maxValue}
                onChange={(e) => handleCommaInput(e, onMaxChange)}
                className="p-2 border border-gray-300 rounded-md w-40 text-base"
              />
              <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(maxValue)}</div>
            </div>
          </div>
      </div>  

    </div>
  );
}
