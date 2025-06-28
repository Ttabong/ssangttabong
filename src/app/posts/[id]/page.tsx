'use client';

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import useUser from "@/hooks/useUser";
import { useParams, useRouter } from "next/navigation";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  user_nickname: string | null;
  image_url: string | null;
}

// 댓글 타입 정의
interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  user_nickname: string | null;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  likes_count?: number;
  has_liked?: boolean;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const { user, loading } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const isOwner = user?.id === post?.user_id;


  useEffect(() => {
    if (!postId) return;

    async function fetchPostData() {
      setLoadingPost(true);

      // 1) 게시글 상세 정보 조회
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (postError || !postData) {
        alert("게시글을 찾을 수 없습니다.");
        router.push("/posts");
        return;
      }
      setPost(postData);

      // 2) 조회수 기록 - 로그인 여부와 무관하게 매번 삽입
      try {
        let ip = null;

        // 비회원인 경우 IP 추출
        if (!user) {
          const res = await fetch("/api/get-ip");
          const data = await res.json();
          ip = data.ip;
        }

        // 조회수 기록 삽입 (중복 허용)
        const { error } = await supabase.from("post_views").insert([
          {
            post_id: postId,
            user_id: user?.id ?? null, // 로그인 유저의 ID 또는 null
            ip_address: ip, // 비회원은 IP 기록, 회원은 null
          },
        ]);

        if (error) {
          console.error("조회수 기록 실패", error);
        }
      } catch (e) {
        console.error("조회수 기록 중 오류", e);
      }


      // 3) 조회수 집계
      const { count: viewsCount } = await supabase
        .from("post_views")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      setViewCount(viewsCount ?? 0);

      // 4) 좋아요 수 집계
      const { count: likeCount } = await supabase
        .from("post_likes")
        .select("*", { count: "exact" })
        .eq("post_id", postId);

      setLikesCount(likeCount ?? 0);

      // 5) 현재 사용자가 좋아요 했는지 여부 조회
      if (user) {
        const { data: hasLikeData, error } = await supabase
          .from("post_likes")
          .select("*")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error) {
          setHasLiked(!!hasLikeData);
        } else {
          console.error("좋아요 여부 조회 에러", error);
          setHasLiked(false);
        }
      }

      setLoadingPost(false);
    }

    fetchPostData();
  }, [postId, user, router]);

  // 댓글 목록 불러오기
  useEffect(() => {
    if (!postId) return;

    async function fetchComments() {
      const { data: commentsData, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (!error && commentsData) {
        setComments(commentsData);
      }
    }
    fetchComments();
  }, [postId]);

// ✅ 관리자 여부 확인 useEffect
useEffect(() => {
  async function checkAdmin() {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!error && data?.role === "admin") {
      setIsAdmin(true);
    }
  }

  checkAdmin();
}, [user]);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setCommentLoading(true);

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        user_nickname: user.nickname ?? null,
        content: newComment.trim(),
        parent_comment_id: null,
      },
    ]);

    if (error) {
      alert("댓글 작성에 실패했습니다: " + error.message);
    } else {
      setNewComment("");
      // 작성 후 댓글 목록 갱신
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      setComments(commentsData ?? []);
    }

    setCommentLoading(false);
  };

  // 좋아요 토글 함수
  const toggleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!post) return;

    if (hasLiked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);

      if (!error) {
        setHasLiked(false);
        setLikesCount((c) => c - 1);
      } else {
        alert("좋아요 취소 실패: " + error.message);
      }
    } else {
      const { error } = await supabase.from("post_likes").insert([
        {
          post_id: post.id,
          user_id: user.id,
        },
      ]);

      if (!error) {
        setHasLiked(true);
        setLikesCount((c) => c + 1);
      } else {
        alert("좋아요 실패: " + error.message);
      }
    }
  };

  // 댓글 삭제 함수
  const deleteComment = async (commentId: number, commentUserId: string) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (user.id !== commentUserId) {
      alert("본인 댓글만 삭제할 수 있습니다.");
      return;
    }
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      alert("댓글 삭제 실패: " + error.message);
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  if (loading || loadingPost)
    return <p className="text-center text-gray-500 mt-10">로딩 중...</p>;

  if (!user) {
    return (
      <div className="container_c text-center mt-10">
        <p className="text-red-600 text-lg mb-4 font-semibold">로그인이 필요합니다.</p>
        <div className="h-5"></div>
        <button
          onClick={() => router.push("/sign/LoginForm")}
          className="btn-loginA rounded text-white"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  if (!post) {
    return <p className="text-center text-gray-500 mt-10">게시글을 불러오는 중입니다...</p>;
  }

  return (
    <div className="container max-w-3xl bg-white rounded-xl">
      <div className="relative w-full aspect-video">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-md mb-6 text-gray-500 text-lg">
            이미지가 없습니다
          </div>
        )}
      </div>

      <div className="h-5"></div>

      <h1 className="filter_a text-2xl font-extrabold mb-2">{post.title}</h1>

      <div className="h-3"></div>

     
      <div className="flex gap-6 items-center mb-6 text-gray-600">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"
          }`}
          aria-label="좋아요 토글"
          type="button"
        >
          👍 {likesCount} 따봉
        </button>
        <div>👁 조회수: {viewCount}</div>
      </div>

      <div className="postsDetail flex justify-between text-sm text-gray-600 mb-4">
        <p>
          ✏️ 작성자: <span className="font-medium">{post.user_nickname ?? "익명"}</span>
        </p>
        <p>{new Date(post.created_at).toLocaleString()}</p>
      </div>
      

      {/* 본문내용 */}   
      <div className="postsDetailLetter">
        <article className="whitespace-pre-wrap text-gray-600 leading-relaxed text-lg font-semibold mb-10">
          {post.content}
        </article>
      </div>

      <section className="mb-10">
        <ul className="postsDetailR">
          {comments.length === 0 && (
            <li className="text-gray-500 text-sm">댓글이 없습니다.</li>
          )}
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="postsDetailRp flex justify-between items-start"
            >
              <div>
                <p className="filter_a font-semibold text-sm mb-1">
                  {comment.user_nickname ?? "익명"}
                  <span className="text-gray-400 text-xs ml-2">
                    &nbsp; {new Date(comment.created_at).toLocaleString()}
                  </span>
                </p>
                <p className="text-gray-700 whitespace-pre-wrap"> ㄴ {comment.content}</p>
              </div>

              {user.id === comment.user_id && (
                <button
                  className="mrBtn text-red-500 text-xl self-start hover:scale-180"
                  onClick={() => deleteComment(comment.id, comment.user_id)}
                  type="button"
                >
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="postsDetailRpL border">
          <div className="postsDetailRpr">
            <h2 className="filter_a text-lg font-semibold">💬 댓글</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder=" 댓글을 입력하세요"
              className="w-full border rounded p-2 mb-2"
              rows={3}
              disabled={commentLoading}
            />

            <button
              className="btn-loginG"
              onClick={handleCommentSubmit}
              disabled={commentLoading}
              type="button"
            >
              {commentLoading ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>
      </section>


{(isOwner || isAdmin) && (
  <div className="flex justify-end gap-4">
    <button
      onClick={() => router.push(`/posts/edit/${post.id}`)}
      className="btn-login bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded transition"
    >
      수정
    </button>
    <button
      onClick={async () => {
        if (!confirm("정말로 이 글을 삭제하시겠습니까?")) return;
        const { error } = await supabase.from("posts").delete().eq("id", post.id);
        if (error) {
          alert("삭제 실패: " + error.message);
        } else {
          alert("삭제되었습니다.");
          router.push("/posts");
        }
      }}
      className="btn-loginR bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition"
    >
      삭제
    </button>
  </div>
)}
    </div>
  );
}
