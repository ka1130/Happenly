export function formatTimeRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const startStr = startDate.toLocaleTimeString('en-US', options);
  const endStr = endDate.toLocaleTimeString('en-US', options);

  return `${startStr} – ${endStr}`;
}
