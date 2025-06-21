// utils/priceUtils.ts

export function formatKoreanPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') return '';
  const num = typeof price === 'string' ? Number(price.replace(/,/g, '')) : price;
  if (isNaN(num)) return '';

  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man}만` : `${eok}억`;
  } else if (num >= 10000) {
    return `${Math.floor(num / 10000)}만`;
  } else {
    return num.toString();
  }
}

export const handleCommaInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setRaw: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  const formatted = Number(value).toLocaleString('ko-KR');
  setRaw(formatted);
};
