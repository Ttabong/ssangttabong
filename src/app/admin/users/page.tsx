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

type RoleFilter = 'all' | 'user' | 'admin';
type DeletedFilter = 'all' | 'active' | 'deleted';

export default function AdminUserPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [todayViews, setTodayViews] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<RoleFilter>('all');
  const [filterDeleted, setFilterDeleted] = useState<DeletedFilter>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log('방문 기록 삽입 시도...');
        const { data: insertData, error: insertError } = await supabase
          .from('site_views')
          .insert({});
        if (insertError) {
          console.error('방문 기록 삽입 실패:', insertError);
        } else {
       //   console.log('방문 기록 삽입 성공:', insertData);
        }

        // 로그인된 유저 확인
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn('로그인된 유저가 없거나 에러 발생:', userError);
          router.push('/');
          return;
        }
        //console.log('로그인된 유저:', user);

        // 관리자 권한 확인
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('프로필 조회 실패:', profileError);
          router.push('/');
          return;
        }
        if (!profile || profile.role !== 'admin') {
          alert('접근 권한이 없습니다.');
          router.push('/');
          return;
        }
        //console.log('관리자 프로필:', profile);

        // 유저 목록 (profiles_with_login 뷰)
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles_with_login')
          .select('*')
          .returns<UserProfile[]>();

        if (profilesError) {
          console.error('유저 목록 조회 실패:', profilesError);
          setUsers([]);
        } else {
          //console.log('유저 목록 조회 성공:', allProfiles);
          setUsers(allProfiles || []);
        }

        // 전체 방문자 수 조회
        const { count: total, error: totalError } = await supabase
          .from('site_views')
          .select('id', { count: 'exact' });
        if (totalError) {
          console.error('전체 방문자 수 조회 실패:', totalError);
        } else {
          //console.log('전체 방문자 수:', total);
          setTotalViews(total || 0);
        }

        // 오늘 방문자 수 조회 (한국 시간 기준 0시로 보정)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const kstOffset = 9 * 60; // 분 단위
        const utc = today.getTime() + today.getTimezoneOffset() * 60000;
        const kstTime = new Date(utc + kstOffset * 60000);
        //console.log('한국 시간 기준 오늘 0시 ISO:', kstTime.toISOString());

        const { count: todayCount, error: todayError } = await supabase
          .from('site_views')
          .select('id', { count: 'exact' })
          .gte('viewed_at', kstTime.toISOString());

        if (todayError) {
          console.error('오늘 방문자 수 조회 실패:', todayError);
        } else {
         // console.log('오늘 방문자 수:', todayCount);
          setTodayViews(todayCount || 0);
        }
      } catch (err) {
        console.error('fetchData 중 에러 발생:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // 권한 변경
  const handleRoleChange = async (id: string, newRole: string) => {
    //console.log(`권한 변경 시도: id=${id}, newRole=${newRole}`);
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    if (error) {
      console.error('권한 변경 실패:', error);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      //console.log('권한 변경 성공:', id, newRole);
    }
  };

  // 복구 (Soft Delete 해제)
  const handleRecover = async (id: string) => {
    //console.log(`복구 시도: id=${id}`);
    const { error } = await supabase.from('profiles').update({ is_deleted: false }).eq('id', id);
    if (error) {
      console.error('복구 실패:', error);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_deleted: false } : u))
      );
      console.log('복구 성공:', id);
    }
  };

  // 강제 탈퇴 (Soft Delete 적용)
  const handleForceDelete = async (id: string) => {
    //console.log(`강제 탈퇴 시도: id=${id}`);
    const { error } = await supabase.from('profiles').update({ is_deleted: true }).eq('id', id);
    if (error) {
      console.error('강제 탈퇴 실패:', error);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_deleted: true } : u))
      );
      console.log('강제 탈퇴 성공:', id);
    }
  };

  // 완전 삭제 (Hard Delete)
  const handleHardDelete = async (id: string) => {
    //console.log(`완전 삭제 시도: id=${id}`);
    const confirmDelete = confirm(
      '정말 이 사용자를 완전 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.'
    );
    if (!confirmDelete) {
      //console.log('완전 삭제 취소됨:', id);
      return;
    }

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error('완전 삭제 실패:', error);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
    //console.log('완전 삭제 성공:', id);
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

  if (loading) {
    return (
      <div className="p-4 text-center text-sm sm:text-base md:text-lg lg:text-xl">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-6xl mx-auto space-y-6 text-sm sm:text-base md:text-lg lg:text-xl">
      <h1 className="filter_a font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        회원 관리
      </h1>

      <div className="h-10" />

      <div className="bg-gray-100 rounded-lg p-4 flex justify-start text-xs sm:text-sm md:text-base lg:text-lg">
        <div>
          Today: <strong>{todayViews?.toLocaleString() ?? '-'}</strong>
        </div>
        &nbsp;/&nbsp;
        <div>
          Total: <strong>{totalViews?.toLocaleString() ?? '-'}</strong>
        </div>
      </div>

      <div className="h-5" />

      {/* 검색 및 필터 */}
      <div className="flex flex-wrap gap-2 text-xs sm:text-sm md:text-base lg:text-lg">
        <input
          type="text"
          placeholder=" 닉네임 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="padL border rounded px-3 py-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as RoleFilter)}
          className="border rounded px-3 py-1"
        >
          <option value="all">전체 권한</option>
          <option value="user">일반</option>
          <option value="admin">관리자</option>
        </select>
        <select
          value={filterDeleted}
          onChange={(e) => setFilterDeleted(e.target.value as DeletedFilter)}
          className="border rounded px-3 py-1"
        >
          <option value="all">전체 상태</option>
          <option value="active">정상</option>
          <option value="deleted">탈퇴</option>
        </select>
      </div>

      <div className="h-3" />

      {/* 유저 테이블 */}
      <table className="w-full border text-xs sm:text-sm md:text-base lg:text-lg">
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
              <td className="pad">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs sm:text-sm md:text-base lg:text-lg"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>

              {/* 탈퇴 여부 & 복구 또는 강제 탈퇴 */}
              <td className="p-2">
                {u.is_deleted ? (
                  <button
                    className="text-green-600 underline text-xs sm:text-sm md:text-base lg:text-lg"
                    onClick={() => handleRecover(u.id)}
                  >
                    복구
                  </button>
                ) : (
                  <button
                    className="text-red-600 underline text-xs sm:text-sm md:text-base lg:text-lg"
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
                  className="text-red-500 hover:underline text-xs sm:text-sm md:text-base lg:text-lg"
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
