'use client';

import React from 'react';
import { addressData } from '../../../data/addressData';
import TextInput from './Inputs/TextInput';
import SelectInput from './Inputs/SelectInput';


type LocationFields = 
  | 'location_1'
  | 'location_2'
  | 'location_3'
  | 'location_4'
  | 'location_5';

type LocationForm = Pick<{
  location_1: string;
  location_2: string;
  location_3: string;
  location_4: string;
  location_5: string;
}, LocationFields>;

type Props = {
  form: LocationForm;
  setForm: (updater: React.SetStateAction<LocationForm>) => void;
};

function isKeyOf<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return typeof key === 'string' && key in obj;
}

export default function LocationSelector({ form, setForm }: Props) {
  const level1Options = Object.keys(addressData);
  const level2Options =
    form.location_1 &&
    isKeyOf(form.location_1, addressData)
      ? Object.keys(addressData[form.location_1])
      : [];
  const level3Options =
    form.location_1 &&
    form.location_2 &&
    isKeyOf(form.location_1, addressData) &&
    isKeyOf(form.location_2, addressData[form.location_1])
      ? Array.isArray(addressData[form.location_1][form.location_2])
        ? (addressData[form.location_1][form.location_2] as string[])
        : Object.keys(addressData[form.location_1][form.location_2])
      : [];
  const level4Options =
    form.location_1 &&
    form.location_2 &&
    form.location_3 &&
    isKeyOf(form.location_1, addressData) &&
    isKeyOf(form.location_2, addressData[form.location_1]) &&
    !Array.isArray(addressData[form.location_1][form.location_2]) &&
    isKeyOf(form.location_3, addressData[form.location_1][form.location_2])
      ? (addressData[form.location_1][form.location_2][form.location_3] as string[])
      : [];

  const handleChange = (level: 1 | 2 | 3 | 4 | 5, value: string) => {
    setForm((prev) => {
      const newForm = { ...prev };
      const key = `location_${level}` as keyof LocationForm;
      newForm[key] = value;
      for (let i = level + 1; i <= 5; i++) {
        const lowerKey = `location_${i}` as keyof LocationForm;
        newForm[lowerKey] = '';
      }
      return newForm;
    });
  };

  return (

    <div className="space-y-4">
    <div className='create-a'>  
      <div className='h-3'></div>
      {/* 1단계: 시/도 */}
      <SelectInput
        id="location_1"
        name="location_1"
        label=" 시 / 도 "
        value={form.location_1}
        onChange={(e) => handleChange(1, e.target.value)}
        options={[
          { value: '', label: '선택하세요' },
          ...level1Options.map((v) => ({ value: v, label: v })),
        ]}
      />
    </div>  

      {/* 2단계: 시/군/구 */}
      <div className='create-a'>
      {level2Options.length > 0 && (
        <SelectInput
          id="location_2"
          name="location_2"
          label=" 시/군/구 "
          value={form.location_2}
          onChange={(e) => handleChange(2, e.target.value)}
          options={[
            { value: '', label: '선택하세요' },
            ...level2Options.map((v) => ({ value: v, label: v })),
          ]}
        />
      )}
      </div>

      {/* 3단계: 동/읍/면 */}
      <div className='create-a'>
      {level3Options.length > 0 && (
        <SelectInput
          id="location_3"
          name="location_3"
          label=" 동/읍/면 "
          value={form.location_3}
          onChange={(e) => handleChange(3, e.target.value)}
          options={[
            { value: '', label: '선택하세요' },
            ...level3Options.map((v) => ({ value: v, label: v })),
          ]}
        />
      )}
      </div>

      {/* 4단계: 리/세부 */}
      <div className='create-a'>
        
      {level4Options.length > 0 && form.location_3.endsWith('면') && (
        <SelectInput
          id="location_4"
          name="location_4"
          label="(리/세부)"
          value={form.location_4}
          onChange={(e) => handleChange(4, e.target.value)}
          options={[
            { value: '', label: '선택하세요' },
            ...level4Options.map((v) => ({ value: v, label: v })),
          ]}
          
        />
      )}
      </div>
      <div className='h-3'></div>

      {/* 5단계: 상세 주소 */}
      <div className='create-a'>
      <TextInput
        id="location_5"
        name="location_5"
        label="상세 주소"
        value={form.location_5}
        onChange={(e) => handleChange(5, e.target.value)}
        placeholder=" 예: 101동 1203호"
      />
      </div>
      <div className='h-3'></div>
    </div>
  );
}
