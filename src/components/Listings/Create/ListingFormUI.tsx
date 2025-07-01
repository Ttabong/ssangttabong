'use client';

import React, { Dispatch, SetStateAction } from 'react';
import TextInput from './Inputs/TextInput';
import SelectInput from './Inputs/SelectInput';
import NumberInput from './Inputs/NumberInput';
import CheckboxInput from './Inputs/CheckboxInput';
import LocationSelector from './LocationSelector';
import ImageUploader from './ImageUploader';
import { ListingFormUIProps } from '@/types/listing';
import Image from 'next/image';
import { formatKoreanPrice, handleCommaInput } from '@/utils/priceUtils';

const usageOptions = [
  { value: '', label: '선택하세요' },
  { value: '원룸', label: '원룸' },
  { value: '투룸', label: '투룸' },
  { value: '아파트', label: '아파트' },
  { value: '다세대', label: '다세대' },
  { value: '단독주택', label: '단독주택' },
  { value: '오피스텔', label: '오피스텔' },
  { value: '상가', label: '상가' },
  { value: '사무실', label: '사무실' },
  { value: '건물', label: '건물' },
  { value: '토지', label: '토지' },
  { value: '기타', label: '기타' },
];

    export default function ListingFormUI({
        form,
        priceRaw,
        depositRaw,
        monthlyRaw,
        loanAmountRaw,
        loanAmountFormatted,
        setPriceRaw,
        setDepositRaw,
        setMonthlyRaw,
        setLoanAmountRaw,
        handleChange,
        handleAddImages,
        handleRemoveImage,
        handleSubmit,
        error,
        isSubmitting,
        onLoanAmountChange,
    }: ListingFormUIProps) {
      return (


    <form onSubmit={handleSubmit} className="container_c space-y-8 max-w-3xl mx-auto p-4">
      {/* 의뢰인, 전화번호 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="client"
            name="client"
            label="의뢰인"
            value={form.client}
            onChange={(e) => handleChange('client', e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="phone"
            name="phone"
            label="전화번호"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* 거래 유형, 용도 선택 */}
      <div className="create-h flex flex-wrap gap-4">
        {/* 거래 유형 */}
        <div className="flex-1 min-w-[200px]">
          <SelectInput
            id="type"
            name="type"
            label="거래 유형"
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value as '' | '매매' | '전세' | '월세')}
            options={[
              { value: '', label: '선택하세요' },
              { value: '매매', label: '매매' },
              { value: '전세', label: '전세' },
              { value: '월세', label: '월세' },
            ]}
            required
          />
        </div>

        {/* 용도 + 기타 입력 */}
        <div className="flex-1 min-w-[200px]">
          <SelectInput
            id="usage"
            name="usage"
            label="용도"
            value={form.usage}
            onChange={(e) => handleChange('usage', e.target.value)}
            options={usageOptions}
          />
          {form.usage === '기타' && (
            <TextInput
              id="usage_extra"
              name="usage_extra"
              label="기타 용도 입력"
              value={form.usage_extra}
              onChange={(e) => handleChange('usage_extra', e.target.value)}
            />
          )}
        </div>
      </div>

      {/* 주소 입력 (LocationSelector) */}
      <div className="create filter_a block font-semibold">주소</div>
      <div className="border border-gray-300 rounded-sm">
        <LocationSelector
          form={{
            location_1: form.location_1,
            location_2: form.location_2,
            location_3: form.location_3,
            location_4: form.location_4,
            location_5: form.location_5,
          }}
          // ★ 수정된 부분: setForm 대신 handleChange를 활용해 부분별로 상태 변경 ★
          setForm={(updater) => {
            if (typeof updater === 'function') {
              // updater가 함수면 현 상태를 인자로 호출해서 업데이트 결과 받음
              const updated = updater({
                location_1: form.location_1,
                location_2: form.location_2,
                location_3: form.location_3,
                location_4: form.location_4,
                location_5: form.location_5,
              });

              // 각각 key가 있으면 handleChange로 업데이트
              (Object.keys(updated) as (keyof typeof updated)[]).forEach((key) => {
                handleChange(key, updated[key]);
              });
            } else {
              // updater가 객체면 각 필드를 handleChange로 업데이트
              (Object.keys(updater) as (keyof typeof updater)[]).forEach((key) => {
                handleChange(key, updater[key]);
              });
            }
          }}
        />
      </div>

      {/* 거래 유형에 따른 가격 입력 분기 */}
      <div>
        {form.type === '매매' && (
          <div>
            <TextInput
              id="price"
              name="price"
              label="가격"
              value={priceRaw}
              onChange={(e) => {
                handleCommaInput(e, setPriceRaw);
                const numeric = e.target.value.replace(/,/g, '');
                handleChange('price', numeric === '' ? '' : Number(numeric));
              }}
              required
            />
            {form.price !== '' && (
              <p className="text-sm text-gray-500 mt-1">{formatKoreanPrice(form.price)} 원</p>
            )}
          </div>
        )}

        {form.type === '전세' && (
          <div>
            <TextInput
              id="deposit"
              name="deposit"
              label="보증금"
              value={depositRaw}
              onChange={(e) => {
                handleCommaInput(e, setDepositRaw);
                const numeric = e.target.value.replace(/,/g, '');
                handleChange('deposit', numeric === '' ? '' : Number(numeric));
              }}
              required
            />
            {form.deposit !== '' && (
              <p className="text-sm text-gray-500 mt-1">{formatKoreanPrice(form.deposit)} 원</p>
            )}
          </div>
        )}

        {form.type === '월세' && (
          <>
            <div>
              <TextInput
                id="deposit"
                name="deposit"
                label="보증금"
                value={depositRaw}
                onChange={(e) => {
                  handleCommaInput(e, setDepositRaw);
                  const numeric = e.target.value.replace(/,/g, '');
                  handleChange('deposit', numeric === '' ? '' : Number(numeric));
                }}
                required
              />
              {form.deposit !== '' && (
                <p className="text-sm text-gray-500 mt-1">{formatKoreanPrice(form.deposit)} 원</p>
              )}
            </div>
            <div>
              <TextInput
                id="monthly"
                name="monthly"
                label="월세"
                value={monthlyRaw}
                onChange={(e) => {
                  handleCommaInput(e, setMonthlyRaw);
                  const numeric = e.target.value.replace(/,/g, '');
                  handleChange('monthly', numeric === '' ? '' : Number(numeric));
                }}
                required
              />
              {form.monthly !== '' && (
                <p className="text-sm text-gray-500 mt-1">{formatKoreanPrice(form.monthly)} 원</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 관리비 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
        <TextInput
          id="maintenance_fee"
          name="maintenance_fee"
          label="관리비 (상세내역)"
          value={form.maintenance_fee}
          onChange={(e) => handleChange('maintenance_fee', e.target.value)}
        />
        </div>

        <div className="flex-1 min-w-[200px]">
        <NumberInput
          id="households"
          name="households"
          label="총세대수"
          value={form.households}
          onChange={(e) =>
            handleChange('households', e.target.value === '' ? '' : Number(e.target.value))
          }
        />
        </div>
      </div>

      {/* 방 개수, 욕실 개수 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="create-q flex-1 min-w-[230px] border border-gray-300">
          <div className="create-qa flex-1 min-w-[30px]">
            <NumberInput
              id="room_count"
              name="room_count"
              label="방 개수"
              value={form.room_count === '' ? '' : form.room_count}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('room_count', val === '' ? '' : Number(val));
              }}
              required
            />
          </div>
          <div className="create-qa flex-1 min-w-[30px]">
            <NumberInput
              id="bathrooms"
              name="bathrooms"
              label="욕실 개수"
              value={form.bathrooms === '' ? '' : form.bathrooms}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('bathrooms', val === '' ? '' : Number(val));
              }}
              required
            />
          </div>
        </div>

        {/* 공급면적, 전용면적 */}
        <div className="create-q flex-1 min-w-[230px] border border-gray-300">
          <div className="flex-1 min-w-[20px]">
            <label htmlFor="area_supply" className="filter_a block font-semibold mb-1">
              공급 면적 (㎡)
            </label>
            <input
              id="area_supply"
              name="area_supply"
              type="number"
              step="0.01"
              value={form.area_supply === '' ? '' : form.area_supply}
              onChange={(e) =>
                handleChange('area_supply', e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1 min-w-[20px]">
            <label htmlFor="area_private" className="filter_a block font-semibold mb-1">
              전용 면적 (㎡)
            </label>
            <input
              id="area_private"
              name="area_private"
              type="number"
              step="0.01"
              value={form.area_private === '' ? '' : form.area_private}
              onChange={(e) =>
                handleChange('area_private', e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* 층수, 총 층수, 방향, 발코니 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="create-q flex-1 min-w-[230px] border border-gray-300">
          <div className="flex-1 min-w-[20px]">
            <NumberInput
              id="floor"
              name="floor"
              label="층수"
              value={form.floor === '' ? '' : form.floor}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('floor', val === '' ? '' : Number(val));
              }}
            />
          </div>
          <div className="flex-1 min-w-[20px]">
            <NumberInput
              id="total_floors"
              name="total_floors"
              label="총 층수"
              value={form.total_floors === '' ? '' : form.total_floors}
              onChange={(e) => {
                const val = e.target.value;
                handleChange('total_floors', val === '' ? '' : Number(val));
              }}
            />
          </div>
        </div>


        <div className="create-q flex-1 min-w-[230px] border border-gray-300">
          <div className="flex-1 min-w-[20px]">
            <SelectInput
              id="direction"
              name="direction"
              label="방향"
              value={form.direction}
              onChange={(e) => handleChange('direction', e.target.value)}
              options={[
                { value: '', label: '선택하세요' },
                { value: '남', label: '남' },
                { value: '북', label: '북' },
                { value: '동', label: '동' },
                { value: '서', label: '서' },
                { value: '남동', label: '남동' },
                { value: '남서', label: '남서' },
                { value: '북동', label: '북동' },
                { value: '북서', label: '북서' },
              ]}
            />
          </div>

          <div className="flex-1 min-w-[20px]">
                      <SelectInput
              id="direction_base"
              name="direction_base"
              label="방향 기준"
              value={form.direction_base}
              onChange={(e) => handleChange('direction_base', e.target.value)}
              options={[
                { value: '', label: '선택하세요' },
                { value: '안방', label: '안방' },
                { value: '거실', label: '거실' },
                // 필요한 다른 옵션 추가 가능
              ]}
            />    
          </div>    

        </div>
      </div>

      {/* 난방 방식, 난방 연료 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="create-q flex-1 min-w-[230px] border border-gray-300">
          <div className="flex-1 min-w-[20px]">
            <SelectInput
              id="warmerType"
              name="warmerType"
              label="난방 방식"
              value={form.warmerType}
              onChange={(e) => handleChange('warmerType', e.target.value)}
              options={[
                { value: '', label: '선택하세요' },
                { value: '개별난방', label: '개별난방' },
                { value: '중앙난방', label: '중앙난방' },
                { value: '지역난방', label: '지역난방' },
              ]}
            />
          </div>

          <div className="flex-1 min-w-[20px]">
            <SelectInput
              id="warmer"
              name="warmer"
              label="난방 연료"
              value={form.warmer}
              onChange={(e) => handleChange('warmer', e.target.value)}
              options={[
                { value: '', label: '선택하세요' },
                { value: '도시가스', label: '도시가스' },
                { value: '기름', label: '기름' },
                { value: '전기', label: '전기' },
                { value: '기타', label: '기타' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="create-h flex flex-wrap gap-4">
        {/* 융자금 */}
        <div className="create-q flex-1 min-w-[200px] border border-gray-300 ">
          <TextInput
            id="loan_amount"
            name="loan_amount"
            label="융자금"
            value={loanAmountFormatted}
            onChange={(e) => {
              setLoanAmountRaw(e.target.value);
              onLoanAmountChange(e.target.value);
            }}
            placeholder="0"
          />
            {form.loan_amount === 0 ? (
              <p className="text-sm text-gray-500 mt-1">융자금 없음</p>
            ) : form.loan_amount === '' || form.loan_amount == null ? (
              <p className="text-sm text-gray-400 mt-1">표시하지 않음</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">{formatKoreanPrice(form.loan_amount)} 원</p>
            )}
        </div>

        {/* 사용승인일 */}
        <div className="flex-1 min-w-[200px] border border-gray-300">
          <label htmlFor="approval_date" className="filter_a block font-semibold mb-1">
            사용승인일
          </label>
          <input
            type="date"
            id="approval_date"
            name="approval_date"
            value={form.approval_date ?? ''}
            onChange={(e) => handleChange('approval_date', e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div> 

      <div className="create-h flex flex-wrap gap-4 ">
        <div className="create-q flex-1 min-w-[50px]">
          <div className="flex-1 min-w-[20px]">
            <CheckboxInput
              id="parking"
              name="parking"
              label=" &nbsp; 주차가능"
              checked={form.parking}
              onChange={(e) => handleChange('parking', e.target.checked)}
            />
          </div>
        </div>   

        {/* 주차가능 대수와 총주차대수를 한 행에 나란히 배치 - 여기에 테두리 적용 */}
        <div className="create-q flex-1 min-w-[50px] border border-gray-300 rounded-md p-2 flex gap-4">
          <div className="flex-1">
            <NumberInput
              id="parking_count"
              name="parking_count"
              label="세대당"
              value={form.parking_count}
              onChange={(e) =>
                handleChange(
                  'parking_count',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
            />
          </div>
          
          <div className="flex-1">
            <NumberInput
              id="all_parking"
              name="all_parking"
              label="총주차"
              value={form.all_parking}
              onChange={(e) =>
                handleChange(
                  'all_parking',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
            />
          </div>
        </div>
             
 
        <div className="create-q flex-1 min-w-[230px] ">
          {/* 애완동물 가능 */}
          <div className="create-qa flex-1 min-w-[30px]">
            <CheckboxInput
              id="pet_allowed"
              name="pet_allowed"
              label=" &nbsp; 동물가능"
              checked={form.pet_allowed}
              onChange={(e) => handleChange('pet_allowed', e.target.checked)}
            />
          </div>

          <div className="create-qa flex-1 min-w-[30px]">
            <SelectInput
              id="balcony"
              name="balcony"
              label="발코니"
              value={form.balcony}
              onChange={(e) => handleChange('balcony', e.target.value)}
              options={[
                { value: '', label: '선택하세요' },
                { value: '기본', label: '기본' },
                { value: '확장', label: '확장' },
              ]}
            />
          </div>  

        </div>
      </div>         

      {/* 입주가능일, 임대 현황 */}
      <div className="create-h flex flex-wrap gap-4">
        <div className="flex-1 min-w-[100px]">
          <div className="filter_a block font-semibold mb-1">입주가능일</div>
          <input
            type="date"
            id="available_date"
            name="available_date"
            value={form.available_date}
            onChange={(e) => handleChange('available_date', e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex-1 min-w-[100px]">
          <SelectInput
            id="lease_status"
            name="lease_status"
            label="임대 현황"
            value={form.lease_status}
            onChange={(e) => handleChange('lease_status', e.target.value)}
            options={[
              { value: '', label: '선택하세요' },
              { value: '입주협의', label: '입주협의' },
              { value: '공실', label: '공실' },
              { value: '임대중', label: '임대중' },
            ]}
          />
        </div>
      </div>

      {/* 이미지 업로더 */}
      <ImageUploader onUpload={handleAddImages} />

      {/* 업로드된 이미지 미리보기 및 삭제 */}
      <div className="create-f">
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((url, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`uploaded-${index}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="96px" // 24 * 4 (tailwind w-24 = 6rem = 96px)
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  aria-label="이미지 삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 매물 제목 */}
      <div className="create-f">
        <TextInput
          id="title"
          name="title"
          label="매물 제목"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      {/* 매물 설명 */}
      <div>
        <label
          htmlFor="description"
          className="filter_a block font-semibold mb-1"
        >
          매물 설명
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="매물의 상세 설명을 입력하세요"
        />
      </div>

 

      
      {/* 제출 버튼 */}
      <button
        type="submit"
        className="btn-create bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? '등록 중...' : '등록하기'}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-600 font-semibold mt-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
