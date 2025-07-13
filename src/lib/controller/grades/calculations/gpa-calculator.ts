export function calculateGPA(
  input: Record<string, number>,
  gpaFactor: number = 4
): number | null {
  const totalEntries = Object.entries(input).length;
  if (totalEntries === 0) {
    return null;
  }
  const sum = Object.entries(input).reduce((acc, [, value]) => {
    return acc + value;
  }, 0);

  const averagePercentage = sum / totalEntries;

  return (averagePercentage * gpaFactor) / 100;
}
