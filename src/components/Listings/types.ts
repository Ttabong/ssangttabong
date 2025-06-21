'use client';

// types.ts
export type Listing = {
  id: number;
  title: string;
  type: '매매' | '전세' | '월세';
  usage: string[] | string;
  price?: number;
  deposit?: number;
  monthly?: number;
  room_count?: number;
  parking: 'O' | 'X';             // optional 제거
  pet_allowed: 'O' | 'X';         // optional 제거
  image_url_1: string;
};