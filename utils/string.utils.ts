export function formatNumberCommas(number: Number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

