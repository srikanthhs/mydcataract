import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';

interface ContrastTestProps {
  onComplete: (score: number) => void;
}

const LETTERS = "HCOVNZRDKS".split("");
const CONTRASTS = [100, 80, 60, 40, 20, 10, 5, 2, 1];

export const ContrastTest: React.FC<ContrastTestProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  const [options, setOptions] = useState<string[]>([]);

  React.useEffect(() => {
    generateStep();
  }, [step]);

  const generateStep = () => {
    const correct = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    setCurrentLetter(correct);
    
    // Generate 4 options
    const others = LETTERS.filter(l => l !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
  };

  const handleChoice = (choice: string) => {
    if (choice === currentLetter) {
      if (step < CONTRASTS.length - 1) {
        setStep(step + 1);
      } else {
        onComplete(100);
      }
    } else {
      onComplete(Math.round((step / CONTRASTS.length) * 100));
    }
  };

  return (
    <Card className="max-w-xl mx-auto text-center" padding="lg">
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Contrast Sensitivity</h2>
        <p className="text-sm text-gray-500 mb-8">What letter do you see below?</p>
        
        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-border-gray relative">
          <div className="absolute top-4 left-4 text-[10px] text-gray-400 font-mono uppercase tracking-tighter">Diagnostic Luminance CAL: 85 CD/M²</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: CONTRASTS[step] / 100 }}
              className="text-7xl font-bold font-display"
              style={{ color: '#000' }}
            >
              {currentLetter}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <Button key={opt} variant="tonal" onClick={() => handleChoice(opt)} className="text-xl py-6 font-display">
            {opt}
          </Button>
        ))}
      </div>
      
      <div className="mt-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-google-blue"
            animate={{ width: `${(step / CONTRASTS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">Level {step + 1} of {CONTRASTS.length}</p>
      </div>
    </Card>
  );
};
