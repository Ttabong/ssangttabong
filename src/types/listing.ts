// src/types/listing.ts

import React from 'react'; // React 타입 필요

// src/types/listing.ts
export interface ListingFormState {
  client: string;
  phone: string;
  type: string;
  usage: string;
  usage_extra: string;
  location_1: string;
  location_2: string;
  location_3: string;
  location_4: string;
  location_5: string;
  price: string | number;
  deposit: string | number;
  monthly: string | number;
  maintenance_fee: string;
  room_count: string | number;
  bathrooms: string | number;
  area_supply: number | '';
  area_private: number | '';
  floor: string | number;
  total_floors: string | number;
  direction: string;
  balcony: string;
  warmer: string;
  warmerType: string;
  loan_amount: string | number;
  parking: boolean;
  pet_allowed: boolean;
  available_date: string;
  lease_status: string;
  images: string[];
  title: string;
  description: string;
  parking_count: string | number;
  approval_date: string;
  direction_base: string;
  households: string | number;
  all_parking: string | number;
}

export interface ListingFormUIProps {
  form: ListingFormState;
  priceRaw: string;
  depositRaw: string;
  monthlyRaw: string;
  setPriceRaw: React.Dispatch<React.SetStateAction<string>>;   
  setDepositRaw: React.Dispatch<React.SetStateAction<string>>;
  setMonthlyRaw: React.Dispatch<React.SetStateAction<string>>;
  handleChange: <K extends keyof ListingFormState>(name: K, value: ListingFormState[K]) => void;
  handleAddImages: (url: string) => void;
  handleRemoveImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  isSubmitting: boolean;
  onLoanAmountChange: (value: string) => void;
}