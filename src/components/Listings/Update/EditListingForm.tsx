'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import ListingFormUI from '@/components/Listings/Create/ListingFormUI';
import toast from 'react-hot-toast';
import { formatKoreanPrice } from '@/utils/priceUtils';
import { ListingFormState } from '@/types/listing';

// 빈 초기 상태: 모든 입력값을 빈 문자열 또는 기본값으로 초기화
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

  // 폼 상태 (입력 데이터)
  const [form, setForm] = useState<ListingFormState>(initialFormState);

  // 원본 입력 문자열 (통화 입력 등 포맷 전 상태)
  const [priceRaw, setPriceRaw] = useState('');
  const [depositRaw, setDepositRaw] = useState('');
  const [monthlyRaw, setMonthlyRaw] = useState('');
  const [loanAmountRaw, setLoanAmountRaw] = useState('');

  // 융자금 포맷 문자열 (쉼표 포함)
  const [loanAmountFormatted, setLoanAmountFormatted] = useState('');

  // 에러 메시지 상태
  const [error, setError] = useState<string | null>(null);
  // 제출 중복 방지를 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 매물 정보 불러오기 (초기 렌더링 시 실행) ---
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

      // Supabase에서 받아온 데이터를 폼 상태로 세팅
      setForm({
        ...data,
        // null -> '' 처리: 숫자 필드 등
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
        // 이미지 필드는 배열로 만들어 UI에서 쉽게 관리
        images: [
          data.image_url_1, data.image_url_2, data.image_url_3,
          data.image_url_4, data.image_url_5, data.image_url_6
        ].filter(Boolean), // null 또는 빈 값 제거
      });

      // 숫자 필드 원본 문자열 상태 세팅 (쉼표 포함 포맷 전 값)
      setPriceRaw(data.price?.toLocaleString() ?? '');
      setDepositRaw(data.deposit?.toLocaleString() ?? '');
      setMonthlyRaw(data.monthly?.toLocaleString() ?? '');
      setLoanAmountRaw(data.loan_amount?.toLocaleString() ?? '');

    };
    fetchData();
  }, [listingId]);

  // --- 입력값 변경 함수 ---
  // 제네릭을 사용하여 타입 안정성 확보
  const handleChange = <K extends keyof ListingFormState>(name: K, value: ListingFormState[K]) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // --- 빈 문자열 ''은 null로 변환하고, 숫자면 Number 타입으로 변환 ---
  const toNullable = (value: number | '' | string) => value === '' ? null : Number(value);

  /*
  // --- 통화 입력값을 숫자만 추출하고 쉼표 넣어 리턴 ---
  // 현재 정의는 되어 있지만 사용하지 않으므로 주석 처리했습니다.
  const formatCurrency = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    return numeric ? Number(numeric).toLocaleString('ko-KR') : '';
  };
  */

  // --- 융자금 입력 핸들러 ---
  // 입력값을 상태에 저장하고, 포맷된 문자열도 별도 상태로 저장
    const handleLoanAmountChange = (input: string) => {
    setLoanAmountRaw(input);

    const numericValue = input.replace(/[^0-9]/g, '');
    setForm(prev => ({
      ...prev,
      loan_amount: numericValue === '' ? '' : Number(numericValue),
    }));
  };

  // --- 이미지 추가 ---
  const handleAddImages = (url: string) => {
    setForm(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  // --- 이미지 삭제 ---
  const handleRemoveImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // --- 폼 제출 처리 (매물 수정) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // 중복 제출 방지
    setIsSubmitting(true);
    setError(null);

    // 필수 입력 검증
    if (!form.title.trim() || !form.location_1 || !form.location_2 || !form.location_3 || !form.type ||
        (form.type === '매매' && form.price === '') ||
        (form.type === '전세' && form.deposit === '') ||
        (form.type === '월세' && (form.deposit === '' || form.monthly === '')) ||
        form.room_count === '' || form.bathrooms === '') {
      toast.error('필수 항목을 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    // images 배열 제외하고 나머지 필드만 update 할 객체 생성
    const { images, ...formWithoutImages } = form;

    // supabase 업데이트 실행
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
      // 이미지 URL을 각각 컬럼에 매핑 (최대 6장)
      image_url_1: images[0] ?? null,
      image_url_2: images[1] ?? null,
      image_url_3: images[2] ?? null,
      image_url_4: images[3] ?? null,
      image_url_5: images[4] ?? null,
      image_url_6: images[5] ?? null,
    }).eq('id', listingId);

    // 에러 처리 및 알림
    if (error) {
      toast.error('수정 실패: ' + error.message);
    } else {
      toast.success('수정 완료!');
      router.push('/listings'); // 완료 후 매물 목록 페이지로 이동
    }

    setIsSubmitting(false);
  };

  // --- 최종 렌더링: 공통 UI 컴포넌트에 props 전달 ---
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
      onLoanAmountChange={handleLoanAmountChange}
      handleChange={handleChange}
      handleAddImages={handleAddImages}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      error={error}
      setLoanAmountRaw={setLoanAmountRaw} 
      isSubmitting={isSubmitting}
    />
  );
}
