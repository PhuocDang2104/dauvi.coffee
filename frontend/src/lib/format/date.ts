type DateInput = Date | string | number;

const DEFAULT_DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function formatDate(value: DateInput): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
  return DEFAULT_DATE_FORMAT.format(date);
}

export function formatIsoDate(value: string): string {
  return formatDate(`${value}T00:00:00+07:00`);
}

