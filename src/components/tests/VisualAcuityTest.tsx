import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, Eye as EyeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Eye } from '@/src/types';

interface VisualAcuityTestProps {
  onComplete: (results: { leftEye: string; rightEye: string }) => void;
}

const SIZES = [80, 60, 40, 30, 20, 15, 10, 8];
const LABELS = ['20/200', '20/100', '20/70', '20/50', '20/40', '20/30', '20/25', '20/20'];

type Direction = 'up' | 'down' | 'left' | 'right';

export const VisualAcuityTest: React.FC<VisualAcuityTestProps> = ({ onComplete }) => {
  const [currentEye, setCurrentEye] = useState<Eye>('left');
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>('up');
  const [results, setResults] = useState({ leftEye: '', rightEye: '' });

  useEffect(() => {
    generateNewDirection();
  }, [step, currentEye]);

  const generateNewDirection = () => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    let next;
    do {
      next = directions[Math.floor(Math.random() * directions.length)];
    } while (next === direction);
    setDirection(next);
  };

  const handleInput = (selected: Direction) => {
    if (selected === direction) {
      if (step < SIZES.length - 1) {
        setStep(step + 1);
      } else {
        finishEye();
      }
    } else {
      finishEye();
    }
  };

  const finishEye = () => {
    const score = LABELS[Math.max(0, step - 1)];
    if (currentEye === 'left') {
      setResults((prev) => ({ ...prev, leftEye: score }));
      setCurrentEye('right');
      setStep(0);
    } else {
      const finalResults = { ...results, rightEye: score };
      onComplete(finalResults);
    }
  };

  const rotation = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
  };

  return (
    <Card className="max-w-xl mx-auto text-center" padding="lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            currentEye === 'left' ? "bg-google-blue text-white" : "bg-gray-100 text-gray-400"
          )}>
            Left Eye
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            currentEye === 'right' ? "bg-google-blue text-white" : "bg-gray-100 text-gray-400"
          )}>
            Right Eye
          </div>
        </div>
        <span className="text-sm font-medium text-gray-400">Step {step + 1}/{SIZES.length}</span>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Cover your {currentEye === 'left' ? 'Right' : 'Left'} Eye</h2>
        <p className="text-sm text-gray-500 mb-8">Indicate which direction the "E" is facing.</p>
        
        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-border-gray relative">
          <div className="absolute top-4 left-4 text-[10px] text-gray-400 font-mono uppercase tracking-tighter">ISO 8596 Standardized Viewport</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentEye}-${step}-${direction}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="font-bold flex leading-none text-black select-none"
              style={{ 
                fontSize: SIZES[step], 
                transform: `rotate(${rotation[direction]}deg)`,
                fontFamily: 'serif' 
              }}
            >
              E
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
        <div />
        <button 
          onClick={() => handleInput('up')}
          className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors group cursor-pointer"
        >
          <ChevronUp className="w-8 h-8 text-gray-400 group-hover:text-google-blue" />
        </button>
        <div />
        
        <button 
          onClick={() => handleInput('left')}
           className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors group cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8 text-gray-400 group-hover:text-google-blue" />
        </button>
        <div />
        <button 
          onClick={() => handleInput('right')}
           className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors group cursor-pointer"
        >
          <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-google-blue" />
        </button>
        
        <div />
        <button 
          onClick={() => handleInput('down')}
           className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors group cursor-pointer"
        >
          <ChevronDown className="w-8 h-8 text-gray-400 group-hover:text-google-blue" />
        </button>
        <div />
      </div>
    </Card>
  );
};

