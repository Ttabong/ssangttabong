'use client';

import React from 'react';

// TextInput 컴포넌트 Props 타입 정의
type TextInputProps = {
  id: string; // input 태그 id 속성 (label과 연결)
  name: string; // 폼 데이터 이름 (상태 관리용)
  label: string; // 사용자에게 보여질 라벨 텍스트
  value: string | undefined; // 현재 값 (undefined도 허용하여 controlled 유지)
  placeholder?: string; // 입력 힌트 (optional)
  required?: boolean; // 필수 입력 여부 (optional)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 입력 변경 핸들러
};

/**
 * 📝 TextInput 컴포넌트
 * - 기본적인 텍스트 입력 필드
 * - label, required, placeholder 등 사용자 친화적 요소 포함
 * - 항상 controlled 상태 유지 (undefined 시 '' 처리)
 */
export default function TextInput({
  id,
  name,
  label,
  value,
  placeholder = '',
  required = false,
  onChange,
}: TextInputProps) {
  return (
    <div className="mb-4">
      {/* 라벨 표시 - required일 경우 * 표시 */}
      <label htmlFor={id} className="filter_a block font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* 텍스트 입력 필드
          - value가 undefined일 경우 빈 문자열 처리
          - React controlled input 원칙에 따라 항상 값이 있어야 함
      */}
      <input
        type="text"
        id={id}
        name={name}
        value={value ?? ''} // undefined인 경우 ''로 처리하여 controlled 유지
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

/*
  요약:
  - 이 컴포넌트는 라벨이 포함된 텍스트 입력 필드입니다.
  - React에서 제어 컴포넌트로 사용되며, value는 항상 string 또는 ''로 유지됩니다.
  - undefined나 null이 들어와도 빈 문자열로 처리하여 경고를 방지합니다.
  - 부모 컴포넌트에서 상태를 관리하고, 변경은 onChange를 통해 반영됩니다.
*/
