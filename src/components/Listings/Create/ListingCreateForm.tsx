'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import ListingFormUI from './ListingFormUI';
import toast from 'react-hot-toast'; // toast 알림 추가
import { ListingFormState } from '@/types/listing';

const initialFormState: ListingFormState = {
  client: '',
  phone: '',
  type: '',
  usage: '',
  usage_extra: '',
  location_1: '',
  location_2: '',
  location_3: '',
  location_4: '',
  location_5: '',
  price: '',
  deposit: '',
  monthly: '',
  maintenance_fee: '',
  room_count: '',
  bathrooms: '',
  area_supply: '',
  area_private: '',
  floor: '',
  total_floors: '',
  direction: '',
  balcony: '',
  warmer: '',
  warmerType: '',
  loan_amount: '',
  parking: false,
  pet_allowed: false,
  available_date: '',
  lease_status: '',
  images: [],
  title: '',
  description: '',
  parking_count: '',
  approval_date: '',
  direction_base: '',
  households: '',       // 총세대수
  all_parking: '',

};

export default function ListingCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<ListingFormState>(initialFormState);
  const [priceRaw, setPriceRaw] = useState('');
  const [depositRaw, setDepositRaw] = useState('');
  const [monthlyRaw, setMonthlyRaw] = useState('');
  const [loanAmountRaw, setLoanAmountRaw] = useState(''); // 융자금 원본 입력
  const [loanAmountFormatted, setLoanAmountFormatted] = useState(''); // 포맷된 문자열
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 방지용 상태

  // ⚡ 제네릭으로 타입 맞춤 (images:string[] 타입도 지원)
  const handleChange = <K extends keyof ListingFormState>(
    name: K,
    value: ListingFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // '' 빈 문자열을 null로 변환, 숫자 타입만 변환
  const toNullable = (value: number | '' | string) =>
    value === '' ? null : Number(value);

  // 3자리마다 쉼표 넣는 함수 (한국 통화 형식)
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return Number(numericValue).toLocaleString('ko-KR');
  };

  // 융자금 입력값 처리 함수
  const handleLoanAmountChange = (input: string) => {
    setLoanAmountRaw(input);
    setLoanAmountFormatted(formatCurrency(input));

    // form 상태 업데이트 (숫자 또는 빈 문자열)
    const numericValue = input.replace(/[^0-9]/g, '');
    setForm(prev => ({
      ...prev,
      loan_amount: numericValue === '' ? '' : Number(numericValue),
    }));
  };

  const handleAddImages = (url: string) => {
    setForm(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // 중복 제출 방지

    setIsSubmitting(true);
    setError(null);

    // 필수 입력 검증
    if (
      !form.location_1 ||
      !form.location_2 ||
      !form.location_3 ||
      !form.title.trim() ||
      !form.type ||
      (form.type === '매매' && form.price === '') || // 매매는 price 필수
      (form.type === '전세' && form.deposit === '') || // 전세는 deposit 필수
      (form.type === '월세' && (form.deposit === '' || form.monthly === '')) || // 월세는 deposit + monthly 둘 다 필수
      form.room_count === '' ||
      form.bathrooms === ''
    ) {
      toast.error('필수 항목을 모두 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    // 거래 타입에 따른 가격값 설정
    const price = form.type === '매매' ? form.price : '';
    const deposit =
      form.type === '전세' || form.type === '월세' ? form.deposit : '';
    const monthly = form.type === '월세' ? form.monthly : '';
    const imageUrls = form.images;

    const { error } = await supabase.from('listings').insert([
      {
        location_1: form.location_1,
        location_2: form.location_2,
        location_3: form.location_3,
        location_4: form.location_4,
        location_5: form.location_5,
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        usage: form.usage === '기타' ? form.usage_extra : form.usage,
        usage_extra: form.usage_extra,
        price: toNullable(price),
        deposit: toNullable(deposit),
        monthly: toNullable(monthly),
        loan_amount: toNullable(form.loan_amount),
        room_count: toNullable(form.room_count),
        bathrooms: toNullable(form.bathrooms),
        maintenance_fee: form.maintenance_fee,
        total_floors: toNullable(form.total_floors),
        floor: toNullable(form.floor),
        area_supply: form.area_supply,
        area_private: form.area_private,
        parking: form.parking,
        pet_allowed: form.pet_allowed,
        direction: form.direction,
        balcony: form.balcony,
        warmerType: form.warmerType,
        warmer: form.warmer,
        lease_status: form.lease_status,
        available_date: form.available_date ? new Date(form.available_date) : null,
        client: form.client,
        phone: form.phone,
        image_url_1: imageUrls[0] ?? null,
        image_url_2: imageUrls[1] ?? null,
        image_url_3: imageUrls[2] ?? null,
        image_url_4: imageUrls[3] ?? null,
        image_url_5: imageUrls[4] ?? null,
        image_url_6: imageUrls[5] ?? null,
        parking_count: toNullable(form.parking_count),
        approval_date: form.approval_date || null,       
        direction_base: form.direction_base,
        households: toNullable(form.households),
        all_parking: toNullable(form.all_parking),
        

      },
    ]);

    if (error) {
      toast.error('저장 실패: ' + error.message);
      setIsSubmitting(false);
      return;
    }

    toast.success('매물 등록 완료!');
    setForm(initialFormState);
    setLoanAmountRaw('');
    setLoanAmountFormatted('');
    setIsSubmitting(false);
    router.push('/listings');
  };

  return (
    <ListingFormUI
      form={form}
      priceRaw={priceRaw}
      setPriceRaw={setPriceRaw}
      depositRaw={depositRaw}
      setDepositRaw={setDepositRaw}
      monthlyRaw={monthlyRaw}
      setMonthlyRaw={setMonthlyRaw}
      loanAmountRaw={loanAmountRaw} 
      setLoanAmountRaw={setLoanAmountRaw}              // 추가: 융자금 원본 문자열
      loanAmountFormatted={loanAmountFormatted}   // 추가: 포맷된 문자열
      onLoanAmountChange={handleLoanAmountChange} // 추가: 변경 핸들러
      handleChange={handleChange}
      handleAddImages={handleAddImages}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
    />
  );
}
