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

// 차트 관련 필수 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RealEstateSimulatorPage() {
  // 입력값 상태 관리
  const [price, setPrice] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanInterest, setLoanInterest] = useState<number>(0);
  const [vacancyRate, setVacancyRate] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);

  // 계산 로직
  const annualRent = monthlyRent * 12 * (1 - vacancyRate / 100);
  const annualManagement = managementFee * 12;
  const annualLoanInterest = loanAmount * (loanInterest / 100);
  const netIncome = annualRent - annualManagement - annualLoanInterest - otherCost;
  const returnRate = price > 0 ? (netIncome / price) * 100 : 0;

  // 차트 데이터
  const data = {
    labels: ['월세수입', '관리비', '대출이자', '기타비용', '순수익'],
    datasets: [
      {
        label: '금액 (원)',
        data: [annualRent, annualManagement, annualLoanInterest, otherCost, netIncome],
        backgroundColor: [
          '#4ade80', // 초록
          '#f87171', // 빨강
          '#facc15', // 노랑
          '#93c5fd', // 파랑
          '#3b82f6', // 진파랑
        ],
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
        font: { size: 16 },
      },
    },
  };

  return (
    <main className="container mx-auto p-6">
      {/* 타이틀 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-sky-400 drop-shadow-md">
          💸 부동산 투자 수익 시뮬레이터
        </h1>
        <p className="text-gray-500 mt-2">입력값에 따라 수익률을 시각적으로 확인해보세요!</p>
      </div>

      {/* 입력 폼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/60 p-6 rounded-lg shadow mb-10">
        {[
          { id: 'price', label: '매매가 (원)', value: price, setter: setPrice },
          { id: 'monthlyRent', label: '월세 수입 (원)', value: monthlyRent, setter: setMonthlyRent },
          { id: 'managementFee', label: '관리비 (원)', value: managementFee, setter: setManagementFee },
          { id: 'loanAmount', label: '대출금액 (원)', value: loanAmount, setter: setLoanAmount },
          { id: 'loanInterest', label: '대출 이자율 (%)', value: loanInterest, setter: setLoanInterest },
          { id: 'vacancyRate', label: '공실률 (%)', value: vacancyRate, setter: setVacancyRate },
          { id: 'otherCost', label: '기타 비용 (연간, 원)', value: otherCost, setter: setOtherCost },
        ].map(({ id, label, value, setter }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              id={id}
              type="number"
              min="0"
              value={value === 0 ? '' : value}
              onChange={(e) => setter(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md shadow-sm"
              placeholder="숫자를 입력하세요"
            />
          </div>
        ))}
      </div>

      {/* 계산 결과 */}
      <div className="text-center mb-8">
        <p className="text-xl font-semibold text-green-600 mb-2">
          🟢 예상 순수익: {netIncome.toLocaleString()} 원 / 연간
        </p>
        <p className="text-xl font-semibold text-blue-600">
          📈 예상 수익률: {returnRate.toFixed(2)}%
        </p>
      </div>

      {/* 차트 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar options={options} data={data} />
      </div>
    </main>
  );
}
