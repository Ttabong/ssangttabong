'use client';

import React from 'react';

// NumberInput 컴포넌트 Props 타입 정의
type NumberInputProps = {
  id: string; // input 태그 id (label과 연결)
  name: string; // 폼 상태에서 사용할 이름
  label: string; // 사용자에게 보여질 라벨 텍스트
  value: number | string | null | undefined; // 현재 값 (빈 문자열, null, undefined 모두 허용)
  placeholder?: string; // 힌트 텍스트 (선택사항)
  required?: boolean; // 필수 입력 여부 (선택사항)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 시 호출할 콜백
};

/**
 * 🔢 NumberInput 컴포넌트
 * - 숫자 입력 전용 텍스트박스
 * - 빈 문자열, null, undefined를 모두 허용해 초기화 상태도 표현 가능
 * - React 경고("uncontrolled → controlled")를 방지하기 위해 value 처리 추가
 */
export default function NumberInput({
  id,
  name,
  label,
  value,
  placeholder = '',
  required = false,
  onChange,
}: NumberInputProps) {
  return (
    <div className="mb-4">
      {/* 라벨 출력, required인 경우 별표 표시 */}
      <label htmlFor={id} className="filter_a block font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* 
        숫자 입력 필드
        - value가 undefined 또는 null인 경우 빈 문자열로 처리하여 React 경고 방지
        - 항상 controlled 상태 유지
      */}
      <input
        type="number"
        id={id}
        name={name}
        value={value !== undefined && value !== null ? value : ''}
        placeholder={placeholder}
        required={required}
        onChange={onChange} // 부모 컴포넌트에서 상태 관리
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
