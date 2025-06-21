// react-slick용 타입 선언 (필요 시 유지)
declare module 'react-slick' {
  import React from 'react';

  interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    [key: string]: any;
  }

  export default class Slider extends React.Component<Settings> {}
}

// ✅ 우리가 사용하는 Listing 타입 정의
export type Listing = {
  id: string;
  title: string;
  price?: number | null;
  deposit?: number | null;
  monthly?: number | null;
  image_url_1?: string;
  type: '매매' | '전세' | '월세';
  usage: string[]; // 예: ['아파트'], ['오피스텔']
  room_count?: number | null;
  pet_allowed?: boolean;
  parking?: boolean;
};
