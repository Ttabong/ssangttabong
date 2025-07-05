'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

type UserProfile = {
  id: string;
  email: string;
  nickname: string | null;
  is_deleted: boolean | null;
  role: string;
  created_at: string;
  last_login_at?: string | null;
};

export default function AdminUserPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [todayViews, setTodayViews] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDeleted, setFilterDeleted] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      // ✅ 방문 기록 추가
      await supabase.from('site_views').insert({});

      // ✅ 로그인된 유저 확인
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/');
        return;
      }

      // ✅ 관리자 권한 확인
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        alert('접근 권한이 없습니다.');
        router.push('/');
        return;
      }

      // ✅ 유저 목록 (profiles_with_login 뷰)
      const { data: allProfiles } = await supabase
        .from('profiles_with_login')
        .select('*')
        .returns<UserProfile[]>();

      setUsers(allProfiles || []);

      // ✅ 전체 방문자 수
      const { count: total } = await supabase
        .from('site_views')
        .select('*', { count: 'exact', head: true });
      setTotalViews(total || 0);

      // ✅ 오늘 방문자 수
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('site_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', today.toISOString());
      setTodayViews(todayCount || 0);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  // 권한 변경
  const handleRoleChange = async (id: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  // 복구 (Soft Delete 해제)
  const handleRecover = async (id: string) => {
    await supabase.from('profiles').update({ is_deleted: false }).eq('id', id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_deleted: false } : u))
    );
  };

  // 강제 탈퇴 (Soft Delete 적용)
  const handleForceDelete = async (id: string) => {
    await supabase.from('profiles').update({ is_deleted: true }).eq('id', id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_deleted: true } : u))
    );
  };

  // 완전 삭제 (Hard Delete)
  const handleHardDelete = async (id: string) => {
    const confirmDelete = confirm(
      '정말 이 사용자를 완전 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.'
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('삭제 중 오류가 발생했습니다.');
      return;
    }

    // UI에서 삭제된 사용자 제거
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // 필터링
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nickname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesDeleted =
      filterDeleted === 'all' ||
      (filterDeleted === 'deleted' ? u.is_deleted : !u.is_deleted);

    return matchesSearch && matchesRole && matchesDeleted;
  });

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="container p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="filter_a text-3xl font-bold">회원 관리</h1>

      <div className='h-10' />

      <div className="bg-gray-100 rounded-lg p-4 flex justify-start text-sm sm:text-base">


        <div>
          Today: <strong>{todayViews?.toLocaleString()}</strong>
        </div>
        &nbsp;
        /
        &nbsp;
        <div>
          Total: <strong>{totalViews?.toLocaleString()}</strong>
        </div>
      </div>

      <div className='h-5' />

      {/* 검색 및 필터 */}
      <div className="flex flex-wrap gap-2 text-sm sm:text-base">
        <input
          type="text"
          placeholder=" 닉네임 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="padL border rounded px-3 py-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">전체 권한</option>
          <option value="user">일반</option>
          <option value="admin">관리자</option>
        </select>
        <select
          value={filterDeleted}
          onChange={(e) => setFilterDeleted(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">전체 상태</option>
          <option value="active">정상</option>
          <option value="deleted">탈퇴</option>
        </select>
      </div>

      <div className='h-3' />  

      {/* 유저 테이블 */}
      <table className="w-full border text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2">닉네임</th>
            <th className="p-2">이메일</th>
            <th className="p-2">권한</th>
            <th className="p-2">탈퇴 여부</th>
            <th className="p-2">최근 로그인</th>
            <th className="p-2">가입일</th>
            <th className="p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td className="p-2">{u.nickname ?? '-'}</td>
              <td className="p-2">{u.email}</td>

              {/* 권한 변경 */}
              <td className="p-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>

              {/* 탈퇴 여부 & 복구 또는 강제 탈퇴 */}
              <td className="p-2">
                {u.is_deleted ? (
                  <button
                    className="text-green-600 underline"
                    onClick={() => handleRecover(u.id)}
                  >
                    복구
                  </button>
                ) : (
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleForceDelete(u.id)}
                  >
                    강제 탈퇴
                  </button>
                )}
              </td>

              {/* 최근 로그인 */}
              <td className="p-2">
                {u.last_login_at
                  ? new Date(u.last_login_at).toLocaleDateString()
                  : '-'}
              </td>

              {/* 가입일 */}
              <td className="p-2">
                {u.created_at
                  ? new Date(u.created_at).toLocaleDateString()
                  : '-'}
              </td>

              {/* 완전 삭제 버튼 */}
              <td className="p-2">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleHardDelete(u.id)}
                >
                  완전 삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
