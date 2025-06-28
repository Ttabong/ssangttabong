// 로그인처럼 SignupForm을 가져와서 페이지 컴포넌트에서 감싸서 export
'use client';

import SignupForm from '@/components/sign/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <SignupForm />
    </div>
  );
}