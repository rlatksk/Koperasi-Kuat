import { toRoman } from './roman.util';
import { getDayName } from './day-name.util';

export function buildSequencePrefix(tanggal: Date): string {
  const day = getDayName(tanggal);
  const month = toRoman(tanggal.getMonth() + 1);
  const year = tanggal.getFullYear();
  return `STK/${day}/${month}/${year}`;
}

export function padNumber(n: number): string {
  return String(n).padStart(5, '0');
}
