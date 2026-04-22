import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={cn('h-1 w-full bg-blue-50 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full bg-google-blue rounded-full"
      />
    </div>
  );
};
