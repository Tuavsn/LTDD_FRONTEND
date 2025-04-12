export function formatNumberCommas(number: Number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function maximizeString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
}

export function formatDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', options).replace(/\//g, '-');
}