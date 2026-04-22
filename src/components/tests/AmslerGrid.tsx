import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AmslerGridProps {
  onComplete: (distorted: boolean) => void;
}

export const AmslerGrid: React.FC<AmslerGridProps> = ({ onComplete }) => {
  const gridSize = 20;

  return (
    <Card className="max-w-xl mx-auto text-center" padding="lg">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-google-blue">Amsler Grid Calibration</h2>
        <p className="text-sm text-gray-500 mb-6">Focus on the center dot. Do any lines appear wavy, blurred, or missing?</p>
        
        <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-white border border-border-gray shadow-sm">
          {/* Dot in middle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-google-blue rounded-full z-10" />
          
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-gray-300" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => onComplete(false)}
          className="flex-1 border-google-green text-google-green hover:bg-green-50"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Lines are straight
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onComplete(true)}
          className="flex-1 border-google-red text-google-red hover:bg-red-50"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          I see waves/blurring
        </Button>
      </div>
      
      <p className="mt-6 text-xs text-center text-gray-400">
        Test each eye individually by covering the other eye.
      </p>
    </Card>
  );
};
