export function validateACN(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  if (!/^\d{9}$/.test(digits)) {
    return false;
  }

  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  const weightedSum = weights.reduce(
    (sum, weight, index) => sum + Number(digits[index]) * weight,
    0,
  );
  const checkDigit = (10 - (weightedSum % 10)) % 10;

  return checkDigit === Number(digits[8]);
}
