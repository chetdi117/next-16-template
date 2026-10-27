import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
export function formatDateTimeToDateJs(value?: string | null): dayjs.Dayjs {
  if (!value) return null;

  return dayjs.utc(value).local();
}

export function formatDateToDateJs(value?: string | null): dayjs.Dayjs {
  if (!value) return null;

  return dayjs(value);
}

export function toUtcDateTime(value?: string | dayjs.Dayjs, format = 'YYYY-MM-DDTHH:mm:ss[Z]'): string {
  if (!value) return null;
  if (typeof value === 'string') return formatDateTimeToDateJs(value).format(format);
  return value.format(format);
}

export function toDateOnly(value?: string | dayjs.Dayjs): string {
  if (!value) return null;
  if (typeof value === 'string') return formatDateToDateJs(value).format('YYYY-MM-DD');
  return value.format('YYYY-MM-DD');
}
