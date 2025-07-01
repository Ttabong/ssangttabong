// src/types/listing.ts

import React from 'react'; // React 타입 필요

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
  parking_count: number | '';         
  approval_date: string;              
  direction_base: string;  
  households: number | '';       
  all_parking: number | '';     
};

export type ListingFormUIProps = {
  form: ListingFormState;
  priceRaw: string;
  depositRaw: string;
  monthlyRaw: string;
  loanAmountRaw: string;
  setPriceRaw: React.Dispatch<React.SetStateAction<string>>;
  setDepositRaw: React.Dispatch<React.SetStateAction<string>>;
  setMonthlyRaw: React.Dispatch<React.SetStateAction<string>>;
  setLoanAmountRaw: React.Dispatch<React.SetStateAction<string>>;
  handleChange: <K extends keyof ListingFormState>(key: K, value: ListingFormState[K]) => void;
  handleAddImages: (url: string) => void;
  handleRemoveImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  isSubmitting: boolean;
  onLoanAmountChange: (value: string) => void;
};