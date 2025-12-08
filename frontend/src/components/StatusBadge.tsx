import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'draft' | 'sent' | 'closed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    draft: 'bg-muted text-muted-foreground border-border',
    sent: 'bg-primary text-primary-foreground border-primary',
    closed: 'bg-secondary text-secondary-foreground border-border',
  };

  const labels = {
    draft: 'Draft',
    sent: 'Sent',
    closed: 'Closed',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
