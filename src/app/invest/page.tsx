'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatKoreanPrice } from '@/utils/priceUtils'; // 꼭 경로 확인해주세요
import { Scale, Tick } from 'chart.js';
import Image from 'next/image';

// Chart.js 필수 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function RealEstateSimulatorPage() {
  // 입력 상태 (문자열로 관리해 쉼표 가능)
  const [price, setPrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [managementFee, setManagementFee] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanInterest, setLoanInterest] = useState('');
  const [vacancyRate, setVacancyRate] = useState('');
  const [otherCost, setOtherCost] = useState('');

  // 쉼표 제거 후 숫자 변환
  const parseNum = (val: string) => Number(val.replace(/,/g, '')) || 0;

  // 계산 로직
  const annualRent = parseNum(monthlyRent) * 12 * (1 - parseNum(vacancyRate) / 100);
  const annualManagement = parseNum(managementFee) * 12;
  const annualLoanInterest = parseNum(loanAmount) * (parseNum(loanInterest) / 100);
  const netIncome = annualRent - annualManagement - annualLoanInterest - parseNum(otherCost);
  const returnRate = parseNum(price) > 0 ? (netIncome / parseNum(price)) * 100 : 0;

  // 차트 데이터
  const data = {
    labels: ['월세수입', '관리비', '대출이자', '기타비용', '순수익'],
    datasets: [
      {
        label: '금액 (원)',
        data: [annualRent, annualManagement, annualLoanInterest, parseNum(otherCost), netIncome],
        backgroundColor: ['#4ade80', '#f87171', '#facc15', '#93c5fd', '#3b82f6'],
      },
    ],
  };

  // 차트 옵션
const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: {
      display: true,
      text: '부동산 투자 수익 구성 (연간 기준)',
      font: { size: 18 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback(this: Scale, value: string | number, index: number, ticks: Tick[]) {
          return typeof value === 'number'
            ? value.toLocaleString() + '원'
            : value;
        },
      },
    },
  },
};

  // 입력 필드 구성 배열
  const inputs = [
    { id: 'price', label: '매매가 (원)', value: price, setter: setPrice, format: true },
    { id: 'monthlyRent', label: '월세 수입 (원)', value: monthlyRent, setter: setMonthlyRent, format: true },
    { id: 'managementFee', label: '관리비 (원)', value: managementFee, setter: setManagementFee, format: true },
    { id: 'loanAmount', label: '대출금액 (원)', value: loanAmount, setter: setLoanAmount, format: true },
    { id: 'loanInterest', label: '대출 이자율 (%)', value: loanInterest, setter: setLoanInterest, format: false },
    { id: 'vacancyRate', label: '공실률 (%)', value: vacancyRate, setter: setVacancyRate, format: false },
    { id: 'otherCost', label: '기타 비용 (연간, 원)', value: otherCost, setter: setOtherCost, format: true },
  ];

  // 입력값 변경 핸들러 (쉼표 자동 추가)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    format: boolean
  ) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (format) {
      const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setter(formatted);
    } else {
      setter(raw);
    }
  };


  // 수익률 기반 스마일 이미지 결정 함수
const getSmileImage = (rate: number) => {
  if (rate < 1) return '/images/sad.png';
  if (rate < 4) return '/images/neutral.png';
  if (rate < 8) return '/images/smile.png';
  return '/images/grin.png';
};


  return (
    <main className="container_i mx-auto p-6">
      {/* 🧾 상단 설명 */}
      <div className="padT text-center mb-10">
        <h1 className="filter_a text-xl sm:text-2xl lg:text-4xl font-extrabold drop-shadow-md">
          💸 부동산 투자 수익 시뮬레이터
        </h1>

        <div className='h-7'/>
        <p className="text-sm sm:text-base lg:text-lg text-gray-500 mt-2">
          입력값에 따라 연간 수익과 수익률을
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-gray-500 mt-2">
         시각적으로 확인해보세요!
        </p>
      </div>

      <div className="h-8" /> {/* 💨 여백 유지 */}

      {/* 📊 메인 콘텐츠 영역: 반응형 레이아웃 */}
      <div className="flex items-center justify-center grid grid-cols-1 lg:grid-cols-10 gap-10">
        {/* 📥 좌측 입력 영역 (30%) */}
        <div className="filter_a lg:col-span-4 space-y-4 bg-white/60 p-6 rounded-lg shadow">
          {inputs.map(({ id, label, value, setter, format }) => (
            <div key={id} className="flex items-center gap-2">

              {/* 인풋 필드 */}
              <div className="padL w-4/5">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => handleChange(e, setter, format)}
                  className="padL w-full px-3 py-2 border rounded-md shadow-sm"
                  placeholder="숫자 입력"
                />
                <div className="h-2" /> {/* 🔹 여백 유지 */}
              </div>

              {/* 💬 한글 금액 표기 */}
              <div className="text-sm text-gray-600 mt-6 w-1/2">
                {format ? formatKoreanPrice(value) : ''}
              </div>
            </div>
          ))}
        </div>

        {/* 📈 우측 결과 및 차트 (70%) */}
        <div className="lg:col-span-6 space-y-6">
       {/* 계산 결과 영역 */}
            <div className="text-center flex items-center justify-center lg:justify-start gap-4">
            <div>
                <p className="magB text-base md:xl font-semibold text-green-600 mb-2">
                🟢 예상 순수익: {netIncome.toLocaleString()} 원 / 연간
                </p>
                <p className="text-xl font-semibold text-blue-600">
                📈 예상 수익률: {returnRate.toFixed(2)}%
                </p>
            </div>

            {/* 넓은 화면용 스마일 이미지 (계산 결과 옆) */}
            <div className="hidden lg:flex">
                <Image
                src={getSmileImage(returnRate)}
                alt="수익률 표정"
                width={100}
                height={100}
                className="rounded-full"
                />
            </div>
            </div>

            {/* 좁은 화면용 스마일 이미지 (결과 하단 중앙) */}
            <div className="flex lg:hidden justify-center mt-6">
            <Image
                src={getSmileImage(returnRate)}
                alt="수익률 표정"
                width={100}
                height={100}
                className="rounded-full"
            />
            </div>

          <div className='h-5'/>

            {/* 📊 차트 컴포넌트 */}
            <div className="bg-white p-6 rounded-lg shadow">
            {/* 화면 너비에 따라 유동적으로 비율 유지 */}
                <div className="aspect-[5/1] sm:aspect-[5/1] md:aspect-[2/1] lg:aspect-[2/1] xl:aspect-[2/1] 2xl:aspect-[2/1] aspect-[4/5] w-full">
                <Bar options={options} data={data} />
                </div>
            </div>
         </div>  
      </div>
    </main>
  );
}
