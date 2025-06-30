'use client';

import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';

type Props = {
  onUpload: (url: string) => void; // 업로드 완료 후 public URL을 부모 컴포넌트에 전달하는 콜백
};

export default function ImageUploader({ onUpload }: Props) {
  // 업로드 상태 관리: true면 업로드 중
  const [uploading, setUploading] = useState(false);
  // 에러 메시지 상태 관리
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 파일 선택 시 실행되는 함수
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return; // 파일 없으면 무시

    const file = e.target.files[0]; // 첫번째 파일 선택
    const fileExt = file.name.split('.').pop(); // 확장자 추출
    // 랜덤 문자열 + 확장자 조합하여 고유한 파일명 생성
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = fileName; // 저장 경로 (필요하면 폴더 경로 추가 가능)

    setUploading(true); // 업로드 시작 상태로 변경
    setErrorMsg(null); // 에러 초기화

    try {
      // Supabase Storage에 파일 업로드 (upsert: false → 덮어쓰기 금지)
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, { upsert: false });

      if (error) throw error; // 업로드 실패 시 에러 던짐

      // 업로드 성공 후 공개 URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      if (!publicUrl) throw new Error('URL 생성 실패');

      // 부모 컴포넌트에 public URL 전달
      onUpload(publicUrl);
    } catch (error: any) {
      // 에러 발생 시 에러 메시지 상태에 저장
      setErrorMsg(error.message);
    } finally {
      setUploading(false); // 업로드 완료 상태로 변경
    }
  };

  return (
    <div className="mb-4">
      {/* 업로드 입력 라벨 */}
      <label className="filter_a block font-semibold mb-1">이미지 업로드</label>
      {/* 파일 선택 input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading} // 업로드 중일 때 비활성화
        className="border border-gray-300 rounded p-2 w-full"
      />
      {/* 업로드 중 상태 표시 */}
      {uploading && <p className="text-blue-600 mt-2">업로드 중...</p>}
      {/* 에러 메시지 표시 */}
      {errorMsg && <p className="text-red-600 mt-2">에러: {errorMsg}</p>}
    </div>
  );
}
