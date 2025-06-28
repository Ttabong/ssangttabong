'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();

  const postId = Number(params.id);

  // 상태 선언
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postUserId, setPostUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 기존 이미지 URL 및 새 이미지 파일 상태, 미리보기 URL
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이미지 업로드 중 상태
  const [uploading, setUploading] = useState(false);

  // 게시글 데이터 불러오기 (제목, 내용, 작성자, 이미지)
  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('title, content, user_id, image_url')
        .eq('id', postId)
        .single();

      if (error || !data) {
        alert('게시글을 불러오지 못했습니다.');
        router.push('/posts');
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setPostUserId(data.user_id);
      setCurrentImageUrl(data.image_url);
      setLoading(false);
    }

    fetchPost();
  }, [postId, router]);

  // 이미지 파일 선택 시 미리보기 URL 생성 및 상태 저장
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewImageFile(file);

      // 선택한 파일의 임시 URL 생성 (브라우저 메모리)
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // 이미지 파일을 Supabase Storage에 업로드 후 공개 URL 반환
  const uploadImage = async (file: File) => {
    setUploading(true);

    // 파일명 유니크 생성: 사용자ID + 현재시간 + 원본파일명
    const fileName = `${user?.id}_${Date.now()}_${file.name}`;

    // 업로드 요청
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    setUploading(false);

    if (uploadError) {
      alert('이미지 업로드 실패: ' + uploadError.message);
      return null;
    }

    // 업로드된 파일의 공개 URL 얻기
    const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    return publicUrl;
  };

  // 수정 제출 처리
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    let imageUrl = currentImageUrl;

    // 새 이미지가 있으면 업로드 후 URL 갱신
    if (newImageFile) {
      const uploadedUrl = await uploadImage(newImageFile);
      if (!uploadedUrl) return; // 업로드 실패 시 중단
      imageUrl = uploadedUrl;
    }

    // 게시글 업데이트 요청
    const { error } = await supabase
      .from('posts')
      .update({ title, content, image_url: imageUrl })
      .eq('id', postId);

    if (error) {
      alert('수정 실패: ' + error.message);
    } else {
      alert('수정 완료!');
      router.push(`/posts/${postId}`);
    }
  };

  // 본인 글이 아닐 경우 접근 차단
  if (!userLoading && user && postUserId && user.id !== postUserId) {
    return <p className="text-red-500 text-center mt-8">본인의 글만 수정할 수 있습니다.</p>;
  }

  // 로딩 중 UI
  if (loading || userLoading) return <p className="text-center mt-8">로딩 중...</p>;

  return (
    <form onSubmit={handleUpdate} className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">게시글 수정</h1>

      {/* 제목 입력 */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        required
        className="w-full border rounded p-2"
      />

      {/* 내용 입력 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        required
        rows={10}
        className="w-full border rounded p-2 resize-none"
      />

      {/* 이미지 섹션 */}
      <div>
        <label className="block mb-2 font-semibold">게시글 이미지</label>

        {/* 새 이미지 미리보기 우선 노출, 없으면 기존 이미지 노출, 없으면 기본 안내 */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="미리보기 이미지"
            className="w-full max-h-80 object-contain mb-2 rounded"
          />
        ) : currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="현재 이미지"
            className="w-full max-h-80 object-contain mb-2 rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
            이미지가 없습니다
          </div>
        )}

        {/* 이미지 파일 선택 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '수정 완료'}
      </button>
    </form>
  );
}
