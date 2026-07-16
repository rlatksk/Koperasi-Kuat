const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}
