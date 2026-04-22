import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Eye, LogIn } from 'lucide-react';
import { signIn } from '@/src/lib/firebase';

export const AuthScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized in Firebase. Please add your Vercel URL to 'Authorized Domains' in your Firebase Console (Authentication > Settings).");
      } else {
        setError(e.message || "An error occurred during login. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

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
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 leading-relaxed text-left">
            <p className="font-bold mb-1 underline">Login Error</p>
            {error}
          </div>
        )}

        <Button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full py-6 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" /> Sign in with Clinic Account
            </>
          )}
        </Button>
        
        <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          Authorized Practitioner Access Only
        </p>
      </Card>
    </div>
  );
};
