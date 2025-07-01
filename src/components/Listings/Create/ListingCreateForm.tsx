'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { ListingFormState } from '@/types/listing';
import ListingFormUI from '@/components/Listings/Create/ListingFormUI';
import toast from 'react-hot-toast';
import { formatKoreanPrice } from '@/utils/priceUtils';

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
  households: '',
  all_parking: '',
};

export default function ListingCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<ListingFormState>(initialFormState);
  const [priceRaw, setPriceRaw] = useState('');
  const [depositRaw, setDepositRaw] = useState('');
  const [monthlyRaw, setMonthlyRaw] = useState('');
  const [loanAmountRaw, setLoanAmountRaw] = useState('');
  const [loanAmountFormatted, setLoanAmountFormatted] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof ListingFormState>(
    name: K,
    value: ListingFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toNullable = (value: number | '' | string) => {
    if (value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const handleLoanAmountChange = (input: string) => {
    const numeric = input.replace(/[^0-9]/g, '');
    setLoanAmountRaw(numeric);
    setLoanAmountFormatted(numeric === '' ? '' : Number(numeric).toLocaleString('ko-KR'));
    setForm(prev => ({
      ...prev,
      loan_amount: numeric === '' ? '' : Number(numeric),
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    if (
      !form.location_1 ||
      !form.location_2 ||
      !form.location_3 ||
      !form.title.trim() ||
      !form.type ||
      (form.type === '매매' && form.price === '') ||
      (form.type === '전세' && form.deposit === '') ||
      (form.type === '월세' && (form.deposit === '' || form.monthly === '')) ||
      form.room_count === '' ||
      form.bathrooms === ''
    ) {
      toast.error('필수 항목을 모두 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const price = form.type === '매매' ? form.price : '';
    const deposit = form.type === '전세' || form.type === '월세' ? form.deposit : '';
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
        area_supply: toNullable(form.area_supply),
        area_private: toNullable(form.area_private),
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
        approval_date: form.approval_date ? new Date(form.approval_date) : null,
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
      setLoanAmountRaw={setLoanAmountRaw}
      onLoanAmountChange={handleLoanAmountChange}
      handleChange={handleChange}
      handleAddImages={handleAddImages}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
      loanAmountFormatted={formatKoreanPrice(loanAmountRaw.replace(/,/g, '') || '0')}
    />
  );
}
