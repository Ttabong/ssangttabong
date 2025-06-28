'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';

type Post = {
  id: number;
  title: string;
  user_email: string;
  created_at: string;
};

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, user_email, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        alert('게시글을 불러오는 데 실패했습니다: ' + error.message);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="border p-4 rounded hover:bg-gray-50">
          <Link href={`/posts/${post.id}`}>
            <div className="font-semibold">{post.title}</div>
            <div className="text-sm text-gray-500">
              {post.user_email} · {new Date(post.created_at).toLocaleString()}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
