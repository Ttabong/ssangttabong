'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { AiOutlineCamera } from 'react-icons/ai';
import Image from 'next/image';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();

  const postId = Number(params.id);

  // 게시글 제목, 내용 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 게시글 작성자 ID
  const [postUserId, setPostUserId] = useState<string | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 기존 이미지 URL과 새로 선택한 이미지 파일, 미리보기 URL 상태
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 이미지 업로드 중 상태
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      // 게시글 데이터 가져오기
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

  // 파일 선택 시 처리: 새 이미지 파일과 미리보기 URL 설정
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  // Supabase Storage에 이미지 업로드
  const uploadImage = async (file: File) => {
    setUploading(true);
    const fileName = `${user?.id}_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    setUploading(false);

    if (uploadError) {
      alert('이미지 업로드 실패: ' + uploadError.message);
      return null;
    }

    // 업로드된 파일의 공개 URL 반환
    const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  // 게시글 수정 제출 처리
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    let imageUrl = currentImageUrl;
    if (newImageFile) {
      const uploadedUrl = await uploadImage(newImageFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

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

  // 본인 글이 아니면 접근 제한 메시지 출력
  if (!userLoading && user && postUserId && user.id !== postUserId) {
    return <p className="text-red-500 text-center mt-8">본인의 글만 수정할 수 있습니다.</p>;
  }

  // 데이터 로딩 중 표시
  if (loading || userLoading) return <p className="text-center mt-8">로딩 중...</p>;

  return (
    <div className="container_c max-w-3xl mx-auto px-4 py-6">
      <h1 className="padB text-3xl font-bold text-center filter_a">게시글 수정</h1>
      <h3 className="padB font-bold text-xl text-gray-500 text-center mb-6">사진과 내용을 자유롭게 수정하세요</h3>

      <form onSubmit={handleUpdate} className="cBox magB bg-white p-6 shadow-2xl rounded-xl">
        {/* 이미지 업로드 영역: 미리보기 우선, 없으면 기존 이미지, 없으면 안내문구 */}
        <label
          className="magB w-full h-64 border-2 border-dashed border-gray-300 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative"
        >
          {previewUrl ? (
            // Blob URL 미리보기용은 next/image 대신 <img> 유지 (Blob URL은 next/image가 안됨)
            <>
              <img
                src={previewUrl}
                alt="미리보기 이미지"
                className="object-cover w-full h-full"
              />
              {/* 빈 태그 유지 요청에 따라 추가 */}
              <></>
            </>
          ) : currentImageUrl ? (
            // 기존 서버 이미지는 next/image 사용 (fill 사용시 부모 relative, 높이 필수)
            <Image
              src={currentImageUrl}
              alt="현재 이미지"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
            />
          ) : (
            // 이미지 없을 때 안내문구
            <div className="flex flex-col items-center text-gray-500">
              <AiOutlineCamera className="text-4xl mb-2" />
              <p className="text-sm font-medium">사진 업로드</p>
              <p className="text-xs text-gray-400">클릭 또는 드래그하여 추가</p>
            </div>
          )}
          {/* 실제 파일 입력은 숨김 */}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {/* 제목 입력 */}
        <input
          type="text"
          placeholder=" 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="pad filter_a w-full text-3xl p-3 rounded-t-lg shadow-lg focus:ring-2 focus:ring-blue-400"
        />

        {/* 내용 입력 */}
        <textarea
          placeholder=" 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="pad filter_a padT magBb w-full border-t-0 border border-gray-300 p-3 text-xl rounded-b-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />

        {/* 제출 버튼 */}
        <div className="magBb text-center">
          <button
            type="submit"
            disabled={uploading}
            className="btn-login px-6 py-5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? '업로드 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
