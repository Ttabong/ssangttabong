// src/utils/getUserRole.ts
{/*}
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getUserRole() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error } = await supabase
    .from('profiles') // ⬅️ 당신이 권한을 저장한 테이블 이름
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) return null;

  return profile.role as 'admin' | 'user';
}  */}

// utils/getUserRole.ts
import supabase from '@/lib/supabaseClient';

export async function getUserRole(): Promise<'admin' | 'user' | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: userData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !userData?.role) return null;
  return userData.role === 'admin' ? 'admin' : 'user';
}
