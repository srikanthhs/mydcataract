import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Eye, Info, Sun, Ruler } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onStart: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <Card className="max-w-2xl mx-auto text-center" padding="lg">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="mb-8 flex justify-center"
      >
        <div className="p-4 bg-blue-50 rounded-full">
          <Eye className="w-12 h-12 text-google-blue" />
        </div>
      </motion.div>

      <h1 className="text-3xl font-display font-bold mb-4">Vision Health Screen</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        This screening tool helps identify potential signs of cataracts. 
        It is not a replacement for a professional eye exam.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
        <div className="flex gap-4 p-4 rounded-xl border border-border-gray bg-white">
          <Sun className="w-5 h-5 text-google-yellow shrink-0" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-tight">Bright Lighting</h3>
            <p className="text-xs text-gray-500 mt-1">Ensure your room is well-lit but without direct glare on the screen.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl border border-border-gray bg-white">
          <Ruler className="w-5 h-5 text-google-green shrink-0" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-tight">Proper Distance</h3>
            <p className="text-xs text-gray-500 mt-1">Sit about 50-60cm (arm's length) away from your display.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-xl border border-border-gray bg-white md:col-span-2">
          <Info className="w-5 h-5 text-google-blue shrink-0" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-tight">One Eye at a Time</h3>
            <p className="text-xs text-gray-500 mt-1">You will be asked to cover one eye while testing the other.</p>
          </div>
        </div>
      </div>

      <Button onClick={onStart} size="lg" className="w-full sm:w-auto px-12">
        Get Started
      </Button>
      
      <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
        Personal Health Tool • Not Diagnostic
      </p>
    </Card>
  );
};
