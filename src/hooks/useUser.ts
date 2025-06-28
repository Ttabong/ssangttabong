'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

// 사용자 프로필 타입 정의
type UserProfile = {
  id: string;
  email: string | null;
  nickname: string | null;
  role: string; // admin / user 등
};

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 유저 정보 및 프로필을 가져오는 함수
    async function fetchUser() {
      // supabase 인증에서 현재 로그인한 유저 정보 획득
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 로그인된 유저가 있으면 프로필 테이블에서 상세 정보 조회
        // 여기서 .single()을 써서 반드시 하나의 row만 가져오도록 하며,
        // 프로필이 없거나 중복 데이터가 있을 경우 에러 발생
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, nickname, role')
          .eq('id', user.id)
          .single();  // single() 적용

        if (error) {
          console.error('프로필 조회 실패', error);
          setUser(null);
        } else {
          setUser(profile);
        }
      } else {
        // 로그인한 유저가 없으면 user 상태 초기화
        setUser(null);
      }
      setLoading(false);
    }

    fetchUser();

    // 인증 상태 변경 리스너 (로그인/로그아웃 등 실시간 반영)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // 세션이 존재하면 해당 유저 프로필을 다시 조회
        supabase
          .from('profiles')
          .select('id, email, nickname, role')
          .eq('id', session.user.id)
          .single()  // single() 적용
          .then(({ data, error }) => {
            if (error) {
              console.error('프로필 조회 실패', error);
              setUser(null);
            } else {
              setUser(data);
            }
          });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
