'use client';

interface StatusPillProps {
  label: string;
  color: string;
  bg: string;
  size?: 'sm' | 'md';
}

export function StatusPill({ label, color, bg, size = 'sm' }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
