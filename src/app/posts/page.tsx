'use client';

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // next/image 임포트
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineComment,
} from 'react-icons/ai';
import { HiOutlineUser } from 'react-icons/hi2';
import { FiTrash2 } from 'react-icons/fi';
import { useCallback } from 'react';

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

  // 관리자 여부 체크
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

  // 게시글 불러오기
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

  // 내가 좋아요 누른 게시글 목록 불러오기
    const fetchLikedPosts = useCallback(async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);
      if (!error && data) setLikedPostIds(data.map((like) => like.post_id));
    }, [user]);

    useEffect(() => {
      fetchPosts();
      fetchLikedPosts();
    }, [user, fetchLikedPosts]);

  // 게시글 삭제 함수
  const handleDelete = async (postId: number) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) alert('삭제 실패: ' + error.message);
    else {
      alert('삭제되었습니다.');
      // 삭제된 게시글을 화면에서 바로 제거
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  // 좋아요 토글 함수
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
      // 좋아요 취소
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
      // 좋아요 추가
      const { error } = await supabase.from('post_likes').insert([
        { user_id: user.id, post_id: postId },
      ]);
      if (!error) {
        setLikedPostIds((prev) => [...prev, postId]);
        success = true;
      }
    }

    // 좋아요 수 즉시 반영
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

  // 로딩 중 표시
  if (loading || userLoading)
    return <p className="text-center mt-10 text-gray-500">로딩 중...</p>;

  return (
    <div className="container max-w-7xl mx-auto p-4">
      {/* 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="filter_a text-3xl font-bold">게시판</h1>
        {/* 로그인 된 사용자만 글쓰기 버튼 표시 */}
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

      {/* 게시글 리스트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}`)}
            className="cBox cursor-pointer rounded shadow-2xl hover:scale-[1.015] transition-all duration-200 bg-white overflow-hidden"
          >
            {/* 이미지 영역 - next/image로 변경 */}
            <div className="relative w-full h-64">
              {post.image_url ? (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-t"
                  priority={false} // 우선순위 조정 가능
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t text-gray-500">
                  이미지 없음
                </div>
              )}

              {/* 관리자만 보이는 삭제 버튼 */}
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  className="absolute top-5 right-5 bg-white/80 hover:bg-white text-red-500 rounded-full p-2 shadow-md transition-transform hover:scale-110"
                  aria-label="게시글 삭제"
                >
                  <FiTrash2 className="text-2xl" />
                </button>
              )}
            </div>

            {/* 게시글 텍스트 정보 영역 */}
            <div className="p-4 space-y-2">
              <h2 className="padL padT font-semibold text-lg text-gray-900 truncate">
                {post.title}
              </h2>

              {/* 조회수, 좋아요, 댓글 수, 작성자 닉네임 */}
              <div className="padL padT flex justify-between items-center text-gray-500 text-sm">
                <div className="flex gap-4 items-center">
                  {/* 조회수 */}
                  <span className="flex items-center gap-1">
                    <AiOutlineEye className="text-xl" />
                    {post.post_views?.[0]?.count ?? 0}
                  </span>

                  {/* 좋아요 버튼 */}
                  <button
                    onClick={(e) => handleLikeToggle(e, post.id)}
                    className="flex items-center gap-1 text-red-500"
                    aria-label={
                      likedPostIds.includes(post.id)
                        ? '좋아요 취소'
                        : '좋아요'
                    }
                  >
                    {likedPostIds.includes(post.id) ? (
                      <AiFillHeart className="text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-xl" />
                    )}
                    {post.post_likes?.[0]?.count ?? 0}
                  </button>

                  {/* 댓글 수 */}
                  <span className="flex items-center gap-1 text-blue-500">
                    <AiOutlineComment className="text-xl" />
                    {post.post_comments?.[0]?.count ?? 0}
                  </span>
                </div>

                {/* 작성자 닉네임 */}
                <span className="padR flex items-center gap-1 text-gray-600 text-sm">
                  <HiOutlineUser className=" text-orange-500 text-base" />
                  {post.user_nickname || '익명'}
                </span>
              </div>

              {/* 작성일자 */}
              <p className="padR text-xs text-right text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* 빈 태그 (요청에 따라 삭제하지 않음) */}
            <></>
          </div>
        ))}
      </div>
    </div>
  );
}
