'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { AiOutlineCamera } from 'react-icons/ai';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();

  const postId = Number(params.id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postUserId, setPostUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fileName = `${user?.id}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    setUploading(false);

    if (uploadError) {
      alert('이미지 업로드 실패: ' + uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

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

  if (!userLoading && user && postUserId && user.id !== postUserId) {
    return <p className="text-red-500 text-center mt-8">본인의 글만 수정할 수 있습니다.</p>;
  }

  if (loading || userLoading) return <p className="text-center mt-8">로딩 중...</p>;

  return (
    <div className="container_c max-w-3xl mx-auto px-4 py-6">
      <h1 className="padB text-3xl font-bold text-center filter_a">게시글 수정</h1>
      <h3 className="padB font-bold text-xl text-gray-500 text-center mb-6">사진과 내용을 자유롭게 수정하세요</h3>

      <form onSubmit={handleUpdate} className="cBox magB bg-white p-6 shadow-2xl rounded-xl">
        <label className="magB w-full h-64 border-2 border-dashed border-gray-300 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기 이미지" className="object-cover w-full h-full" />
          ) : currentImageUrl ? (
            <img src={currentImageUrl} alt="현재 이미지" className="object-cover w-full h-full" />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <AiOutlineCamera className="text-4xl mb-2" />
              <p className="text-sm font-medium">사진 업로드</p>
              <p className="text-xs text-gray-400">클릭 또는 드래그하여 추가</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <input
          type="text"
          placeholder=" 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="pad filter_a w-full text-3xl p-3 rounded-t-lg shadow-lg focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder=" 내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="pad filter_a padT magBb w-full border-t-0 border border-gray-300 p-3 text-xl rounded-b-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />

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
