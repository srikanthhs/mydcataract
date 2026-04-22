import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Eye, LogIn } from 'lucide-react';
import { signIn } from '@/src/lib/firebase';

export const AuthScreen: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
      <Card className="max-w-md w-full text-center" padding="lg">
        <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-google-blue rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                <Eye className="text-white w-9 h-9" />
            </div>
        </div>
        <h1 className="text-2xl font-bold font-display mb-2">VisionScan Pro</h1>
        <p className="text-sm text-gray-400 mb-8 px-8">Clinic edition for ophthalmic diagnostic support and patient vision tracking.</p>
        
        <Button onClick={signIn} className="w-full py-6 flex items-center justify-center gap-3">
          <LogIn className="w-5 h-5" /> Sign in with Clinic Account
        </Button>
        
        <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          Authorized Practitioner Access Only
        </p>
      </Card>
    </div>
  );
};
