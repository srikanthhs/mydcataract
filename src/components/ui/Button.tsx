import * as React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tonal';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-google-blue text-white hover:bg-blue-700 shadow-sm',
      secondary: 'bg-google-green text-white hover:bg-green-700 shadow-sm',
      tonal: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      outline: 'border border-border-gray text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:bg-gray-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 font-medium',
      lg: 'px-6 py-2.5 text-base font-medium',
      icon: 'p-2 rounded-full',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
