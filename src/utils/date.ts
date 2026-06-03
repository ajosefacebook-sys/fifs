export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr).getTime() < Date.now();
}

export function getOverdueDuration(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} mins overdue`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hrs overdue`;
  const days = Math.floor(hours / 24);
  return `${days} days overdue`;
}

export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.floor((d2.getTime() - d1.getTime()) / 86400000);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
