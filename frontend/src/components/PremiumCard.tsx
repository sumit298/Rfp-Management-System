import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function PremiumCard({ children, className, hoverable = false, onClick }: PremiumCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-border bg-card p-6 transition-all duration-200',
        hoverable && 'cursor-pointer hover:border-foreground/20 hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
