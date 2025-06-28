'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function BoardCreatePage() {
  // 로그인 사용자 정보와 로딩 상태를 커스텀 훅으로 받아옴
  const { user, loading } = useUser();
  const router = useRouter();

  // 글 제목, 내용 상태 선언
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 사용자 닉네임 상태
  const [nickname, setNickname] = useState<string | null>(null);

  // 업로드할 이미지 파일 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  // 이미지 업로드 중 상태
  const [uploading, setUploading] = useState(false);

  // user 변경 시 닉네임 설정
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || null);
    }
  }, [user]);

  // 로딩 중 UI 처리
  if (loading) return <p>로딩중...</p>;
  // 로그인하지 않았으면 작성 불가 안내
  if (!user) return <p>로그인 후 글쓰기가 가능합니다.</p>;

  // 이미지 선택 시 호출되는 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 제목, 내용 빈 값 체크
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    let imageUrl = null;

    // 이미지 파일이 선택되어 있으면 업로드 처리
    if (imageFile) {
      setUploading(true);

      // 파일명을 유니크하게 생성 (사용자ID_타임스탬프_파일명)
      const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;

      // Supabase Storage에 이미지 업로드
      const { data, error: uploadError } = await supabase.storage
        .from('post-images') // 미리 만든 버킷 이름으로 교체
        .upload(fileName, imageFile);

      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      // 업로드된 이미지의 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;

      setUploading(false);
    }

    // posts 테이블에 새 글과 이미지 URL 저장
    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        user_id: user.id,
        user_email: user.email,
        user_nickname: nickname,
        image_url: imageUrl, // 이미지 URL 추가
      },
    ]);

    if (error) {
      alert('글 저장 실패: ' + error.message);
    } else {
      alert('글이 성공적으로 등록되었습니다.');
      router.push('/posts');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-4">
      {/* 제목 입력란 */}
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {/* 내용 입력란 */}
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={10}
        className="w-full border p-2 rounded"
      />

      {/* 이미지 파일 선택 input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />

      {/* 글 작성 버튼 (업로드 중에는 비활성화) */}
      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '글 작성'}
      </button>
    </form>
  );
}
