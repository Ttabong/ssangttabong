// src/types/listing.ts
export type ListingFormState = {
  client: string;
  phone: string;
  type: '' | '매매' | '전세' | '월세';
  usage: string;
  usage_extra: string;
  location_1: string;
  location_2: string;
  location_3: string;
  location_4: string;
  location_5: string;
  price: number | '';
  deposit: number | '';
  monthly: number | '';
  maintenance_fee: string;
  room_count: number | '';
  bathrooms: number | '';
  area_supply: number | '';
  area_private: number | '';
  floor: number | '';
  total_floors: number | '';
  direction: string;
  balcony: string;
  warmer: string;
  warmerType: string;
  loan_amount: number | '';
  parking: boolean;
  pet_allowed: boolean;
  available_date: string;
  lease_status: string;
  images: string[];
  title: string;
  description: string;
  parking_count: number | '';         // ✅ 주차 대수
  approval_date: string;              // ✅ 사용승인일 (예: '2024-03-01')
  direction_base: string;  // 방향기준
  households: number | '';       // 총세대수
  all_parking: number | '';     // 총주차대수

};
