import type { PropsWithChildren } from 'react';

interface InfoCardProps extends PropsWithChildren {
  className?: string;
}

export function InfoCard({ children, className = '' }: InfoCardProps) {
  return (
    <section
      className={`rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] p-4 ${className}`}
    >
      {children}
    </section>
  );
}
