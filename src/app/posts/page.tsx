'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineComment,
} from 'react-icons/ai';
import { HiOutlineUser } from 'react-icons/hi2';
import { FiTrash2 } from 'react-icons/fi';

type Post = {
  id: number;
  user_nickname: string | null;
  title: string;
  created_at: string;
  image_url: string | null;
  post_views: { count: number }[];
  post_likes: { count: number }[];
  post_comments: { count: number }[]; 
};

const POSTS_PER_PAGE = 12;

export default function PostsList() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.role === 'admin') setIsAdmin(true);
      });
  }, [user]);

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
        post_likes(count),
        post_comments(count) 
      `)
      .order('created_at', { ascending: false })
      .limit(POSTS_PER_PAGE);

    if (error) alert('게시글 불러오기 실패: ' + error.message);
    else setPosts(data ?? []);
    setLoading(false);
  };

  const fetchLikedPosts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    if (!error && data) setLikedPostIds(data.map((like) => like.post_id));
  };

  useEffect(() => {
    fetchPosts();
    fetchLikedPosts();
  }, [user]);

  const handleDelete = async (postId: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) alert('삭제 실패: ' + error.message);
    else {
      alert('삭제되었습니다.');
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  const handleLikeToggle = async (
    e: React.MouseEvent,
    postId: number
  ) => {
    e.stopPropagation();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const liked = likedPostIds.includes(postId);
    let success = false;

    if (liked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
      if (!error) {
        setLikedPostIds((prev) => prev.filter((id) => id !== postId));
        success = true;
      }
    } else {
      const { error } = await supabase.from('post_likes').insert([
        { user_id: user.id, post_id: postId },
      ]);
      if (!error) {
        setLikedPostIds((prev) => [...prev, postId]);
        success = true;
      }
    }

    if (success) {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                post_likes: [
                  {
                    count:
                      (p.post_likes?.[0]?.count ?? 0) +
                      (liked ? -1 : 1),
                  },
                ],
              }
            : p
        )
      );
    }
  };

  if (loading || userLoading)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="filter_a text-3xl font-bold">게시판</h1>
        {user && (
          <button
            onClick={() => router.push('/posts/create')}
            className="btn-login h-10 font-bold"
          >
            글쓰기
          </button>
        )}
      </div>

      <div className="h-10"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
            className="cBox cursor-pointer rounded shadow-2xl hover:scale-[1.015] transition-all duration-200 bg-white overflow-hidden"
          >
            <div className="relative w-full h-64">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t text-gray-500">
                  이미지 없음
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="absolute top-5 right-5 bg-white/80 hover:bg-white text-red-500 rounded-full p-2 shadow-md transition-transform hover:scale-110"
                >
                  <FiTrash2 className="text-2xl" />
                </button>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h2 className="padL padT font-semibold text-lg text-gray-900 truncate">
                {post.title}
              </h2>

              <div className="padL padT flex justify-between items-center text-gray-500 text-sm">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1">
                    <AiOutlineEye className="text-xl" />
                    {post.post_views?.[0]?.count ?? 0}
                  </span>
                  <button
                    onClick={(e) => handleLikeToggle(e, post.id)}
                    className="flex items-center gap-1 text-red-500"
                  >
                    {likedPostIds.includes(post.id) ? (
                      <AiFillHeart className="text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-xl" />
                    )}
                    {post.post_likes?.[0]?.count ?? 0}
                  </button>
                  {/* ✅ 댓글 수 표시 */}
                  <span className="flex items-center gap-1 text-blue-500">
                    <AiOutlineComment className="text-xl" />
                    {post.post_comments?.[0]?.count ?? 0}
                  </span>
                </div>
                <span className="padR flex items-center gap-1 text-gray-600 text-sm">
                  <HiOutlineUser className=" text-orange-500 text-base" />
                  {post.user_nickname || '익명'}
                </span>
              </div>

              <p className="padR text-xs text-right text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
