'use client';

import React from 'react';

// SelectInput 컴포넌트 Props 타입 정의
type SelectInputProps = {
  id: string; // <select> 태그의 id 속성 (label과 연결용)
  name: string; // 폼 상태에서 사용할 name
  label: string; // 사용자에게 보여질 라벨 텍스트
  value: string | undefined; // 현재 선택된 값 (제어 컴포넌트)
  options: { value: string; label: string }[]; // 셀렉트 박스에 표시할 옵션 목록
  required?: boolean; // 필수 입력 여부 (기본 false)
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // 선택 변경 시 실행할 이벤트 핸들러
};

/**
 * SelectInput 컴포넌트
 * - select 태그 기반 드롭다운 입력 UI
 * - options 배열을 받아 동적으로 <option> 생성
 * - 항상 "선택하세요"를 포함하여 초기값 상태도 표현 가능
 */
export default function SelectInput({
  id,
  name,
  label,
  value,
  options,
  required = false,
  onChange,
}: SelectInputProps) {
  return (
    <div className="mb-4">
      {/* 라벨: 사용자에게 선택 항목 이름 표시 */}
      <label htmlFor={id} className="filter_a block font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* 셀렉트 박스 */}
      <select
        id={id}
        name={name}
        value={value ?? ''} // undefined인 경우 ''로 처리하여 controlled 유지
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {/* 초기 선택지: 선택되지 않은 상태 표현 
        <option value="">선택하세요</option>*/}

        {/* 전달받은 options 배열로부터 옵션 생성 */}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/*
  요약:
  - value는 undefined일 수 있으므로 value ?? ''로 처리
  - 항상 "선택하세요" 초기 옵션 포함
  - value, onChange는 부모에서 상태 관리 필요
*/
