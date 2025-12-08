import type { ReactNode } from 'react';
import { PremiumCard } from './PremiumCard';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <PremiumCard>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </PremiumCard>
  );
}
