//useUser.ts

'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

// 사용자 프로필 타입 정의
type UserProfile = {
  id: string;
  email: string | null;
  nickname: string | null;
  role: string; // admin / user 등 권한 구분
};

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null); // 현재 로그인한 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 사용자 정보 로딩 상태

  useEffect(() => {
    // 유저 정보 및 프로필을 가져오는 함수
    async function fetchUser() {
      // supabase 인증에서 현재 로그인한 유저 정보 획득
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 로그인된 유저가 있으면 프로필 테이블에서 상세 정보 조회
        // is_deleted = false 조건 추가: 탈퇴한 유저는 제외 처리
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, nickname, role')
          .eq('id', user.id)
          .eq('is_deleted', false)  // 탈퇴 처리된 계정은 조회하지 않음
          .maybeSingle();           // single() 대신 maybeSingle() 사용 -> 0개도 에러 안남

        if (error) {
          // 조회 중 에러 발생 시 콘솔에 출력하고 user 상태 초기화
          console.error('프로필 조회 실패', error);
          setUser(null);
        } else if (!profile) {
          // 탈퇴했거나 프로필이 없는 경우 (데이터가 없으면)
          setUser(null);
          // 필요시 로그아웃 처리나 리다이렉트 로직 추가 가능
        } else {
          // 정상 프로필 데이터가 있으면 상태 업데이트
          setUser(profile);
        }
      } else {
        // 로그인한 유저가 없으면 user 상태 초기화
        setUser(null);
      }
      setLoading(false); // 로딩 완료 처리
    }

    fetchUser();

    // 인증 상태 변경 리스너 (로그인/로그아웃 실시간 반영)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // 세션이 존재하면 해당 유저 프로필을 다시 조회
        supabase
          .from('profiles')
          .select('id, email, nickname, role')
          .eq('id', session.user.id)
          .eq('is_deleted', false)  // 탈퇴한 유저 제외
          .maybeSingle()            // single() 대신 maybeSingle() 사용
          .then(({ data, error }) => {
            if (error) {
              console.error('프로필 조회 실패', error);
              setUser(null);
            } else if (!data) {
              // 탈퇴 처리된 계정이거나 데이터가 없으면 user 초기화
              setUser(null);
              // 필요시 로그아웃 또는 리다이렉트 추가 가능
            } else {
              setUser(data);
            }
            setLoading(false); // 프로필 조회 완료 후 로딩 상태 false 처리
          });
      } else {
        // 로그아웃 혹은 세션 없음 상태 처리
        setUser(null);
        setLoading(false); // 로딩 종료
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // user와 loading 상태 반환
  return { user, loading };
}
