import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sun, Layers } from 'lucide-react';

interface CalibrationProps {
  onNext: (glare: number, opacity: number) => void;
}

export const CalibrationStep: React.FC<CalibrationProps> = ({ onNext }) => {
  const [glare, setGlare] = useState(20);
  const [opacity, setOpacity] = useState(0);

  return (
    <Card className="max-w-xl mx-auto w-full" padding="lg">
      <div className="text-center mb-10">
        <h2 className="text-xl font-semibold mb-2 text-google-blue">Clinical Parameters</h2>
        <p className="text-sm text-gray-500">Record observed glare sensitivity and lens opacity grade.</p>
      </div>

      <div className="space-y-10 mb-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Sun className="w-4 h-4 text-google-yellow" /> Glare Score
            </h3>
            <span className="text-lg font-bold text-google-blue">{glare}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={glare} 
            onChange={(e) => setGlare(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-google-blue"
          />
          <p className="text-[10px] text-gray-400">Calculated based on contrast reduction under bright focal light.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-google-green" /> Lens Opacity (NC)
            </h3>
            <span className="text-lg font-bold text-google-blue">Grade {opacity}</span>
          </div>
          <div className="flex justify-between gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map(v => (
              <button 
                key={v}
                onClick={() => setOpacity(v)}
                className={`flex-1 py-3 rounded-md border text-sm font-bold transition-all ${
                  opacity === v 
                    ? 'bg-google-blue border-google-blue text-white shadow-md scale-105' 
                    : 'bg-white border-border-gray text-gray-400 hover:bg-gray-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400">Standard LOCS III Nuclear Coloration grading from 0 to 6.9.</p>
        </div>
      </div>

      <Button className="w-full py-4 text-base" onClick={() => onNext(glare, opacity)}>
        Continue to AI Analysis
      </Button>
    </Card>
  );
};
