import React from 'react';
import { cn } from '@/lib/utils';

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full h-full flex items-center justify-center font-medium transition-all text-sm break-words',
      className,
      selected ? 'font-bold' : ''
    )}
    {...props}
  />
));
BaseNode.displayName = 'BaseNode';
