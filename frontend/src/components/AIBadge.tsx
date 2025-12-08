import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIBadgeProps {
  className?: string;
  label?: string;
}

export function AIBadge({ className, label = 'AI Generated' }: AIBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full gradient-ai px-3 py-1 text-xs font-medium text-primary-foreground',
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      {label}
    </span>
  );
}
