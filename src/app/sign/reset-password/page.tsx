// /app/sign/reset-password/page.tsx
import React, { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient'; // 아래에서 새로 만듭니다

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}