'use client';

import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';

type Props = {
  onUpload: (url: string) => void;
};

export default function ImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = fileName;

    setUploading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, { upsert: false });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      if (!publicUrl) throw new Error('URL 생성 실패');

      onUpload(publicUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="filter_a block font-semibold mb-1">이미지 업로드</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="border border-gray-300 rounded p-2 w-full"
      />
      {uploading && <p className="text-blue-600 mt-2">업로드 중...</p>}
      {errorMsg && <p className="text-red-600 mt-2">에러: {errorMsg}</p>}
    </div>
  );
}
