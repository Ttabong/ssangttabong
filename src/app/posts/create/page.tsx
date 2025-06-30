'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { AiOutlineCamera } from "react-icons/ai";
import Image from 'next/image'; // next/image 임포트

export default function BoardCreatePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // ✅ 미리보기용 상태 추가
  const [uploading, setUploading] = useState(false);

  // 로그인한 사용자 닉네임 설정
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || null);
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10 text-gray-500">로딩중...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">로그인 후 글쓰기가 가능합니다.</p>;

  // 파일 변경 시 이미지 파일과 미리보기 설정
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // ✅ 미리보기용 데이터 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 게시글 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      setUploading(true);
      const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
      setUploading(false);
    }

    const { error } = await supabase.from('posts').insert([
      {
        title,
        content,
        user_id: user.id,
        user_email: user.email,
        user_nickname: nickname,
        image_url: imageUrl,
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
    <div className="container_c max-w-3xl mx-auto px-4 py-6">
      <h1 className="padB text-3xl font-bold text-center filter_a">게시글 작성</h1>

      <h3 className="padB font-bold text-xl text-gray-500 text-center mb-6">자유롭게 사진과 글을 올려주세요 ^^</h3>

      <form onSubmit={handleSubmit} className="cBox magB bg-white p-6 shadow-2xl rounded-xl">

        {/* ✅ 이미지 업로드 박스 (next/image + 아이콘 포함) */}
        <label className="magB w-full h-64 border-2 border-dashed border-gray-300 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative">
          {preview ? (
            <Image 
              src={preview} 
              alt="preview" 
              fill 
              style={{ objectFit: 'cover' }} 
              sizes="100vw" 
              priority={false} 
              className="rounded-t"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500 z-10 relative">
              <AiOutlineCamera className="text-4xl mb-2" />
              <p className="text-sm font-medium">사진 업로드</p>
              <p className="text-xs text-gray-400">클릭 또는 드래그하여 추가</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {/* 빈 태그 요청에 따라 유지 */}
          <></>
        </label>  

        {/* 제목 입력란 */}
        <input
          type="text"
          placeholder=" 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="pad filter_a w-full font-bold text-3xl p-3 rounded-t-lg shadow-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* 내용 입력란 */}
        <textarea
          placeholder=" 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="pad filter_a padT magBb w-full text-xl rounded-b-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />
     
       {/* 글 작성 버튼 */}
        <div className="magBb text-center">
          <button
            type="submit"
            disabled={uploading}
            className="btn-login px-6 py-5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </div>
     
      </form>
    </div>
  );
}
