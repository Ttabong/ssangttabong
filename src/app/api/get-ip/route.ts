import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // x-forwarded-for 헤더가 있으면 첫 번째 IP 사용
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';

  return NextResponse.json({ ip });
}
