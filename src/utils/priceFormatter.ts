export function formatKoreanPrice(value?: number | string | null | undefined): string {
  if (value === undefined || value === null || value === "") return "-";

  const parsed =
    typeof value === "string"
      ? Number(value.replace(/[^0-9.-]+/g, ""))
      : value;

  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;    

  if (isNaN(parsed) || parsed <= 0) return "-";

  if (!num || isNaN(num)) return '0'; // 입력 없으면 빈 문자열

  if (parsed >= 1_0000_0000) {
    return `${(parsed / 1_0000_0000).toFixed(2)}억 원`;
  } else if (parsed >= 1_0000) {
    return `${(parsed / 1_0000).toFixed(2)}만 원`;
  } else {
    return `${parsed.toLocaleString()} 원`;
  }
}

