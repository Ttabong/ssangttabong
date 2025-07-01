'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import ListingFormUI from '@/components/Listings/Create/ListingFormUI';
import toast from 'react-hot-toast';
import { ListingFormState } from '@/types/listing';

const initialFormState: ListingFormState = {
  client: '', phone: '', type: '', usage: '', usage_extra: '',
  location_1: '', location_2: '', location_3: '', location_4: '', location_5: '',
  price: '', deposit: '', monthly: '', maintenance_fee: '',
  room_count: '', bathrooms: '', area_supply: '', area_private: '',
  floor: '', total_floors: '', direction: '', balcony: '',
  warmer: '', warmerType: '', loan_amount: '', parking: false, pet_allowed: false,
  available_date: '', lease_status: '', images: [], title: '', description: '',
  parking_count: '', approval_date: '', direction_base: '', households: '',
  all_parking: '',
};

type Props = { listingId: string };

export default function ListingEditForm({ listingId }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ListingFormState>(initialFormState);
  const [priceRaw, setPriceRaw] = useState('');
  const [depositRaw, setDepositRaw] = useState('');
  const [monthlyRaw, setMonthlyRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error || !data) {
        toast.error('매물 정보를 불러올 수 없습니다.');
        return;
      }

      setForm({
        ...data,
        price: data.price ?? '',
        deposit: data.deposit ?? '',
        monthly: data.monthly ?? '',
        loan_amount: data.loan_amount ?? '',
        room_count: data.room_count ?? '',
        bathrooms: data.bathrooms ?? '',
        area_supply: data.area_supply ?? '',
        area_private: data.area_private ?? '',
        floor: data.floor ?? '',
        total_floors: data.total_floors ?? '',
        images: [
          data.image_url_1, data.image_url_2, data.image_url_3,
          data.image_url_4, data.image_url_5, data.image_url_6
        ].filter(Boolean),
      });

      setPriceRaw(data.price?.toLocaleString() ?? '');
      setDepositRaw(data.deposit?.toLocaleString() ?? '');
      setMonthlyRaw(data.monthly?.toLocaleString() ?? '');
      // loanAmountRaw 제거됨
    };
    fetchData();
  }, [listingId]);

  const handleChange = <K extends keyof ListingFormState>(name: K, value: ListingFormState[K]) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toNullable = (value: number | '' | string) => value === '' ? null : Number(value);

  // 융자금 변경 핸들러
  const onLoanAmountChange = (input: string) => {
    const numeric = input.replace(/[^0-9]/g, '');
    setForm(prev => ({
      ...prev,
      loan_amount: numeric === '' ? '' : Number(numeric),
    }));
  };

  const handleAddImages = (url: string) => {
    setForm(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    if (!form.title.trim() || !form.location_1 || !form.location_2 || !form.location_3 || !form.type ||
      (form.type === '매매' && form.price === '') ||
      (form.type === '전세' && form.deposit === '') ||
      (form.type === '월세' && (form.deposit === '' || form.monthly === '')) ||
      form.room_count === '' || form.bathrooms === '') {
      toast.error('필수 항목을 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const { images, ...formWithoutImages } = form;

    const { error } = await supabase.from('listings').update({
      ...formWithoutImages,
      price: toNullable(form.price),
      deposit: toNullable(form.deposit),
      monthly: toNullable(form.monthly),
      loan_amount: toNullable(form.loan_amount),
      room_count: toNullable(form.room_count),
      bathrooms: toNullable(form.bathrooms),
      total_floors: toNullable(form.total_floors),
      floor: toNullable(form.floor),
      usage: form.usage === '기타' ? form.usage_extra : form.usage,
      available_date: form.available_date ? new Date(form.available_date) : null,
      image_url_1: images[0] ?? null,
      image_url_2: images[1] ?? null,
      image_url_3: images[2] ?? null,
      image_url_4: images[3] ?? null,
      image_url_5: images[4] ?? null,
      image_url_6: images[5] ?? null,
    }).eq('id', listingId);

    if (error) {
      toast.error('수정 실패: ' + error.message);
    } else {
      toast.success('수정 완료!');
      router.push('/listings');
    }

    setIsSubmitting(false);
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
      handleChange={handleChange}
      handleAddImages={handleAddImages}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
      onLoanAmountChange={onLoanAmountChange}
    />
  );
}
