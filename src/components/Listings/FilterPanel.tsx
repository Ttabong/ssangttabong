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
  hideUsage?: boolean; // 용도 선택 UI를 숨기기 위한 선택적 prop
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
  hideUsage = false,  // 기본값 지정해도 좋음
}: FilterPanelProps) {
  return (

    
    <div className="w-full flex flex-wrap items-center font-semibold" style={{ paddingBottom: '0.5rem'}}>
  
      {/* 거래 유형 */}
      <div>
        <p className="font-semibold text-yellow-400 h-7" >◈ 거래 유형</p>
        <div className="flex gap-4">
          {['전체', '매매', '전세', '월세'].map((type) => (
            <label key={type} className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="tradeType"
                checked={selectedTradeType === type || (type === '전체' && selectedTradeType === '')}
                onChange={() => onTradeTypeChange(type)}
                className="accent-sky-400"
              />
              {type}
            </label>
          ))}
          <div className='w-5'></div>
        </div>
      </div>

      {/* 용도 */}
      {!hideUsage && (
        <div>
          <p className="font-semibold text-yellow-400 h-7">◈ 용도</p>
          <div className="flex flex-wrap gap-3">
            {USAGE_TYPES.map((usage) => (
              <label key={usage} className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsageTypes.includes(usage)}
                  onChange={() => onUsageTypeToggle(usage)}
                  className="accent-sky-400"
                />
                {usage}
              </label>
            ))}
            <div className='w-10'></div>
          </div>
        </div>
      )}

      {/* 주차 */}
      <div>
        <p className="font-semibold text-yellow-400 h-7">◈ 주차 여부</p>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="parking"
              checked={selectedParkingOption.length === 0}
              onChange={() => onParkingChange([])}
              className="accent-sky-400"
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
                className="accent-sky-400"
              />
              {option === 'O' ? '주차 가능' : '주차 불가'}
            </label>
          ))}
          <div className='w-5'></div>
        </div>
      </div> 

      {/* 애완동물 */}
      <div>
        <p className="font-semibold text-yellow-400 h-7">◈ 애완동물</p>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="pet"
              checked={selectedPetAllowedOption.length === 0}
              onChange={() => onPetAllowedChange([])}
              className="accent-sky-400"
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
                className="accent-sky-400"
              />
              {option === 'O' ? '가능' : '불가'}
            </label>
          ))}
        </div>
      </div>

      <div className="w-full space-y-6">
  {/* 매매 */}
  {selectedTradeType === '매매' && (
    <div className="w-full">
      <p className="font-semibold text-yellow-400 mb-2">◈ 가격 범위</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="최소 가격"
            value={minPriceStr}
            onChange={(e) => handleCommaInput(e, onMinPriceChange)}
            className="p-2 border rounded w-36"
          />
          <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(minPriceStr)}</div>
        </div>
        <span className="self-center font-bold">~</span>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="최대 가격"
            value={maxPriceStr}
            onChange={(e) => handleCommaInput(e, onMaxPriceChange)}
            className="p-2 border rounded w-36"
          />
          <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(maxPriceStr)}</div>
        </div>
      </div>
    </div>
  )}

  {/* 전세 */}
  {selectedTradeType === '전세' && (
    <div className="w-full">
      <p className="font-semibold text-yellow-400 mb-2">◈ 보증금 범위</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="최소 보증금"
            value={minDepositStr}
            onChange={(e) => handleCommaInput(e, onMinDepositChange)}
            className="p-2 border rounded w-36"
          />
          <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(minDepositStr)}</div>
        </div>
        <span className="self-center font-bold">~</span>
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="최대 보증금"
            value={maxDepositStr}
            onChange={(e) => handleCommaInput(e, onMaxDepositChange)}
            className="p-2 border rounded w-36"
          />
          <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(maxDepositStr)}</div>
        </div>
      </div>
    </div>
  )}

  {/* 월세 */}
  {selectedTradeType === '월세' && (
    <>
      <div className="w-full">
        <p className="font-semibold text-yellow-400 mb-2">◈ 보증금 범위</p>
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="최소 보증금"
              value={minDepositStr}
              onChange={(e) => handleCommaInput(e, onMinDepositChange)}
              className="p-2 border rounded w-36"
            />
            <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(minDepositStr)}</div>
          </div>
          <span className="self-center font-bold">~</span>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="최대 보증금"
              value={maxDepositStr}
              onChange={(e) => handleCommaInput(e, onMaxDepositChange)}
              className="p-2 border rounded w-36"
            />
            <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(maxDepositStr)}</div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <p className="font-semibold text-yellow-400 mb-2">◈ 월차임 범위</p>
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="최소 월세"
              value={minMonthlyStr}
              onChange={(e) => handleCommaInput(e, onMinMonthlyChange)}
              className="p-2 border rounded w-36"
            />
            <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(minMonthlyStr)}</div>
          </div>
          <span className="self-center font-bold">~</span>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="최대 월세"
              value={maxMonthlyStr}
              onChange={(e) => handleCommaInput(e, onMaxMonthlyChange)}
              className="p-2 border rounded w-36"
            />
            <div className="text-sm text-gray-500 min-h-[1.25rem]">{formatKoreanPrice(maxMonthlyStr)}</div>
          </div>
        </div>
      </div>
    </>
  )}
</div>

        <hr className="border-t border-orange-400 my-8" />

    </div>

    

  );
}
