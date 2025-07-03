// CheckboxInput.tsx
'use client';

import React from 'react';

// CheckboxInput 컴포넌트 Props 타입 정의
type CheckboxInputProps = {
  id: string; // input id (label과 연결)
  name: string; // 폼 상태에서 사용할 이름
  label: string; // 화면에 표시할 라벨 텍스트
  checked: boolean; // 체크 상태 (true/false)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 체크 상태 변경 시 호출
  required?: boolean; // 필수 여부 (선택사항)
};

    /**
     * ✔️ CheckboxInput 컴포넌트
     * - 체크박스와 라벨을 같이 렌더링
     */
    export default function CheckboxInput({
    id,
    name,
    label,
    checked,
    onChange,
    required = false,
    }: CheckboxInputProps) {
    return (
        <div className="mb-4 flex items-center space-x-2">
        {/* 체크박스 */}
        <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={onChange} // 부모 상태 업데이트용
            required={required}
            className="padL w-4 h-4 text-blue-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />

        {/* 라벨 */}
        <label htmlFor={id} className="filter_a select-none font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        </div>
    );
    }

/*
  CheckboxInput은 체크박스 입력용 기본 컴포넌트입니다.
  checked 상태와 onChange를 받아 부모 컴포넌트가 상태를 관리합니다.
  라벨과 함께 출력하며, required 표시도 지원합니다.
*/
