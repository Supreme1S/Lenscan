export function formatAddressMiddle(
  addr: string,
  startChars = 8,
  endChars = 4,
): string {
  const a = addr.trim();
  if (a.length <= startChars + endChars + 3) return a;
  return `${a.slice(0, startChars)}...${a.slice(-endChars)}`;
}
