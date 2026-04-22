import React, { useState, useEffect } from 'react';
import { TestStep, TestResults, Patient } from './types';
import { Onboarding } from './components/tests/Onboarding';
import { VisualAcuityTest } from './components/tests/VisualAcuityTest';
import { ContrastTest } from './components/tests/ContrastTest';
import { AmslerGrid } from './components/tests/AmslerGrid';
import { Results } from './components/tests/Results';
import { EyeCapture } from './components/tests/EyeCapture';
import { CalibrationStep } from './components/tests/CalibrationStep';
import { Progress } from './components/ui/Progress';
import { PatientDashboard } from './components/PatientDashboard';
import { TestHistory } from './components/TestHistory';
import { AuthScreen } from './components/AuthScreen';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Eye, User, Settings, Activity, LogOut, ChevronLeft } from 'lucide-react';
import { auth, logOut, onAuthStateChanged } from '@/src/lib/firebase';
import { Button } from './components/ui/Button';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [step, setStep] = useState<TestStep>('dashboard');
  const [testMode, setTestMode] = useState<'QUICK' | 'FULL'>('FULL');
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [results, setResults] = useState<TestResults>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getProgressLabel = () => {
    switch (step) {
      case 'dashboard': return 'State Registry';
      case 'history': return 'Case History';
      case 'onboarding': return 'Initialization';
      case 'visual-acuity': return 'Acuity Analysis';
      case 'contrast': return 'Contrast Sensitivity';
      case 'amsler': return 'Grid distortion';
      case 'photo': return 'Diagnostic Photography';
      case 'results': return 'Diagnostic Summary';
      default: return 'Ophthalmic Analysis';
    }
  };

  const currentProgress = () => {
    if (testMode === 'QUICK') {
        switch (step) {
            case 'onboarding': return 20;
            case 'photo': return 60;
            case 'results': return 100;
            default: return 0;
        }
    }
    switch (step) {
      case 'onboarding': return 10;
      case 'visual-acuity': return 30;
      case 'contrast': return 50;
      case 'amsler': return 70;
      case 'photo': return 90;
      case 'results': return 100;
      default: return 0;
    }
  };

  const handleSelectPatient = (p: Patient) => {
    setActivePatient(p);
    setStep('history');
  };

  const startTest = (mode: 'QUICK' | 'FULL' = 'FULL') => {
    setResults({});
    setTestMode(mode);
    setStep('onboarding');
  };

  if (authLoading) return null;
  if (!user) return <AuthScreen />;

  return (
    <div className="h-screen bg-[#F8F9FA] flex flex-col overflow-hidden text-[#202124]">
      {/* Professional Header */}
      <header className="h-16 bg-white border-b border-border-gray flex items-center px-6 justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center">
            <Eye className="text-white w-5 h-5" />
          </div>
          <div>
              <span className="text-xl font-medium tracking-tight text-gray-700">VisionScan Pro</span>
              <p className="text-[9px] -mt-1 font-bold text-google-blue uppercase tracking-tighter">Unified Diagnostic Module</p>
          </div>
          <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
            Field Unit
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <button 
            onClick={() => { setActivePatient(null); setStep('dashboard'); }}
            className={`hover:text-google-blue transition-colors cursor-pointer py-5 ${step === 'dashboard' ? 'text-google-blue border-b-2 border-google-blue' : ''}`}
          >
            Patients
          </button>
          {activePatient && (
             <button 
                onClick={() => setStep('history')}
                className={`hover:text-google-blue transition-colors cursor-pointer py-5 ${step === 'history' ? 'text-google-blue border-b-2 border-google-blue' : ''}`}
             >
               Profile
             </button>
          )}
          <button className="hover:text-google-blue transition-colors cursor-pointer py-5">Diagnostics</button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Practitioner</p>
               <p className="text-xs font-semibold">{user.displayName || 'Clinic Staff'}</p>
            </div>
            <button onClick={logOut} className="h-8 w-8 rounded-full bg-gray-100 border border-border-gray flex items-center justify-center hover:bg-red-50 hover:text-google-red transition-all group">
              <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-google-red" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Clinical Sidebar */}
        <aside className="w-72 bg-white border-r border-border-gray p-6 flex flex-col gap-8 shrink-0">
          <section>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Patient Profile</h3>
            {activePatient ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-google-blue font-bold text-sm">
                        {activePatient.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{activePatient.name}</p>
                        <p className="text-xs text-gray-500">ID: {activePatient.externalId}</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-border-gray border-dashed text-center">
                    <p className="text-[10px] font-medium text-gray-400">Select patient to view details</p>
                </div>
            )}
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Current Parameters</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs border-b border-gray-50 pb-2">
                <span className="text-gray-500">Operation</span>
                <span className="font-semibold text-google-blue">{getProgressLabel()}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-gray-50 pb-2">
                <span className="text-gray-500">Illumination</span>
                <span className="font-semibold italic">Standard 85 cd/m²</span>
              </div>
              <div className="flex justify-between text-xs border-b border-gray-50 pb-2">
                <span className="text-gray-500">Reference Std</span>
                <span className="font-semibold">ISO 8596</span>
              </div>
            </div>
          </section>

          <div className="mt-auto p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-[11px] text-blue-800 leading-relaxed font-medium flex gap-2">
              <Activity className="w-3 h-3 shrink-0 mt-0.5" />
              Real-time diagnostic assistance active. Secure clinical cloud link established.
            </p>
          </div>
        </aside>

        {/* Dynamic Area */}
        <section className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col pt-4"
              >
                {step === 'dashboard' && (
                  <PatientDashboard onSelectPatient={handleSelectPatient} />
                )}

                {step === 'history' && activePatient && (
                  <TestHistory 
                    patient={activePatient} 
                    onBack={() => setStep('dashboard')}
                    onNewTest={startTest}
                  />
                )}

                {step === 'onboarding' && (
                  <Onboarding onStart={() => {
                    if (testMode === 'QUICK') setStep('photo');
                    else setStep('visual-acuity');
                  }} />
                )}
                
                {step === 'visual-acuity' && (
                  <VisualAcuityTest 
                    onComplete={(acuity) => {
                      setResults(prev => ({ ...prev, visualAcuity: acuity }));
                      setStep('contrast');
                    }} 
                  />
                )}

                {step === 'contrast' && (
                  <ContrastTest 
                    onComplete={(score) => {
                      setResults(prev => ({ ...prev, contrast: { score } }));
                      setStep('amsler');
                    }} 
                  />
                )}

                {step === 'amsler' && (
                  <AmslerGrid 
                    onComplete={(detected) => {
                      setResults(prev => ({ ...prev, amsler: { detectedDistortions: detected } }));
                      setStep('photo');
                    }} 
                  />
                )}

                {step === 'photo' && (
                  <EyeCapture 
                    onCapture={(base64) => {
                      setResults(prev => ({ ...prev, photo: { base64 } }));
                      setStep('calibration');
                    }}
                  />
                )}

                {step === 'calibration' && (
                  <CalibrationStep 
                    onNext={(glare, opacity) => {
                      setResults(prev => ({ ...prev, glareScore: glare, lensOpacity: opacity }));
                      setStep('results');
                    }}
                  />
                )}

                {step === 'results' && activePatient && (
                  <Results 
                    patient={activePatient}
                    results={results} 
                    testMode={testMode}
                    onReset={() => {
                        setStep('history');
                    }} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step !== 'dashboard' && step !== 'history' && (
            <div className="mt-8 h-12 bg-white border border-border-gray rounded-lg px-6 flex items-center gap-4 shrink-0 shadow-sm max-w-4xl mx-auto w-full">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Test Progress</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-google-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress()}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600 w-12 text-right">{currentProgress()}%</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
