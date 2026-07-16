const ROMAN_NUMERALS: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
  7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII',
};

export function toRoman(month: number): string {
  const result = ROMAN_NUMERALS[month];
  if (!result) throw new Error(`Invalid month: ${month}`);
  return result;
}
