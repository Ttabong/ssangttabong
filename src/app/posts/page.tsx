'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

type Post = {
  id: number;
  user_nickname: string | null;
  title: string;
  created_at: string;
  image_url: string | null;
  post_views: { count: number }[];  // ✅ 조회수
  post_likes: { count: number }[];  // ✅ 좋아요
};

const POSTS_PER_PAGE = 12;

export default function PostsList() {
  const { user, loading: userLoading } = useUser(); // 로그인 정보
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ 관리자 여부 상태
  const router = useRouter();

  // ✅ 관리자 여부 확인
  useEffect(() => {
    async function checkAdmin() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      }
    }
    checkAdmin();
  }, [user]);

  // ✅ 게시글 + 조회수 + 좋아요 수 조회
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        user_nickname,
        title,
        created_at,
        image_url,
        post_views(count),
        post_likes(count)
      `)
      .order('created_at', { ascending: false })
      .limit(POSTS_PER_PAGE);

    if (error) {
      alert('게시글 불러오기 실패: ' + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ 관리자용 삭제 핸들러
  const handleDelete = async (postId: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      alert("삭제되었습니다.");
      fetchPosts(); // 목록 갱신
    }
  };

  if (loading || userLoading)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="container max-w-7xl mx-auto p-4">
      {/* 헤더 + 글쓰기 버튼 (로그인한 사용자만) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"> 게시판</h1>
        {user && (
          <button
            onClick={() => router.push('/posts/create')}
            className="btn-login h-10 font-bold"
          >
            글쓰기
          </button>
        )}
      </div>

      <div className='h-10'></div>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">게시글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/posts/${post.id}`)}
              className="cursor-pointer rounded shadow-2xl hover:scale-[1.015] transition-shadow duration-200"
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-t text-gray-500">
                  이미지 없음
                </div>
              )}
              <div className="p-4 bg-white rounded-b">
                <h2 className="padT filter_a font-bold text-xl truncate">
                  &nbsp;{post.title}
                </h2>




                {/* ✅ 작성자 & 조회수/좋아요를 같은 라인에 배치 */}
                <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                  {/* 👁 좌측: 조회수/좋아요 */}
                  <div className="padL padT flex gap-4 text-base">
                    <span>👁 {post.post_views?.[0]?.count ?? 0}</span>
                    <span>❤️ {post.post_likes?.[0]?.count ?? 0}</span>
                  </div>

                  {/* ✏️ 우측: 작성자 */}
                  <div className="padR text-sm text-gray-600">
                    작성자: <span className="font-medium">{post.user_nickname || '익명'}</span>
                  </div>
                </div>

                <p className="padR flex justify-end text-xs text-gray-400">
                  &nbsp; {new Date(post.created_at).toLocaleDateString()}
                </p>

                  {/* 👇 관리자만 삭제 버튼 표시 */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 상위 카드 클릭 방지
                        handleDelete(post.id);
                      }}
                      className="text-red-500 text-3xl hover:scale-150"
                    >
                       🗑
                    </button>
                  )}
                </div>
              </div>

          ))}
        </div>
      )}
    </div>
  );
}
