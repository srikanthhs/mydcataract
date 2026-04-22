import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white rounded-lg shadow-google border border-border-gray overflow-hidden',
          paddings[padding],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
