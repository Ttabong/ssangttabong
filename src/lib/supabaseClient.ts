// src/lib/supabaseClient.ts
//import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

//const supabase = createClient(supabaseUrl, supabaseAnonKey);

//export default supabase;


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      Accept: 'application/json',  // 여기 꼭 추가
    },
  },
});

export default supabase;
