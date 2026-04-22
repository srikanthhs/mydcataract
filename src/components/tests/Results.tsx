import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TestResults, Patient } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { AlertTriangle, CheckCircle, RefreshCcw, Stethoscope, Mail, Save, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { getDiagnosticAssessment } from '@/src/services/geminiService';
import { db, collection, addDoc, auth } from '@/src/lib/firebase';

interface ResultsProps {
  patient: Patient;
  results: TestResults;
  testMode: 'QUICK' | 'FULL';
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ patient, results, testMode, onReset }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1A73E8', '#34A853', '#FBBC05', '#EA4335']
    });
    
    performAiDiagnosis();
  }, []);

  const performAiDiagnosis = async () => {
    setLoading(true);
    try {
      const structuredData = {
        visualAcuityLeft: results.visualAcuity?.leftEye,
        visualAcuityRight: results.visualAcuity?.rightEye,
        contrastScore: results.contrast?.score,
        amslerResult: results.amsler?.detectedDistortions,
        glareScore: results.glareScore,
        lensOpacity: results.lensOpacity
      };

      const diagnosis = await getDiagnosticAssessment(structuredData, results.photo?.base64);
      setAdvice(diagnosis || "Unable to generate AI assessment at this time.");
      
      // Auto-save the results
      if (auth.currentUser && patient.id) {
        await addDoc(collection(db, 'testResults'), {
          patientId: patient.id,
          ownerId: auth.currentUser.uid,
          testType: testMode === 'QUICK' ? 'QUICK_SCAN' : 'FULL_DIAGNOSTIC',
          date: new Date().toISOString(),
          visualAcuityLeft: results.visualAcuity?.leftEye || 'N/A',
          visualAcuityRight: results.visualAcuity?.rightEye || 'N/A',
          contrastScore: results.contrast?.score || 0,
          amslerResult: results.amsler?.detectedDistortions || false,
          glareScore: results.glareScore || 0,
          lensOpacity: results.lensOpacity || 0,
          aiAssessment: diagnosis,
          aiDiagnosis: diagnosis?.length ? (diagnosis.includes('Severe') ? 'Severe' : diagnosis.includes('Moderate') ? 'Moderate' : 'Mild') : 'Inconclusive'
        });
        setIsSaved(true);
      }
    } catch (e) {
      console.error(e);
      setAdvice("Error processing diagnostic data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card padding="lg" className="text-center overflow-visible">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-white shadow-google rounded-2xl border border-border-gray">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-google-blue font-bold">
            {patient.name.charAt(0)}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2 mt-4 px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-google-blue uppercase tracking-widest">
                <Clock className="w-3 h-3" /> Latest Session
            </div>
            {isSaved && (
              <span className="flex items-center gap-1 text-[10px] text-google-green font-bold uppercase transition-all">
                <Save className="w-3 h-3" /> Record Persisted
              </span>
            )}
        </div>

        <h1 className="text-2xl font-semibold mb-1">Clinic Diagnostic Report</h1>
        <p className="text-gray-500 text-sm mb-8">Patient: {patient.name} • ID: {patient.externalId}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-gray-50/50 border border-border-gray">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[.15em] mb-3">Acuity L/R</p>
            <div className="text-lg font-bold text-google-blue">
                {results.visualAcuity?.leftEye} / {results.visualAcuity?.rightEye}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-border-gray">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[.15em] mb-3">Contrast</p>
            <div className="text-lg font-bold text-gray-800">
              {results.contrast?.score}%
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-border-gray">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[.15em] mb-3">Amsler</p>
            <div className={cn(
              "text-[10px] font-bold uppercase py-1 px-2 rounded inline-block",
              results.amsler?.detectedDistortions ? "bg-red-50 text-google-red" : "bg-green-50 text-google-green"
            )}>
              {results.amsler?.detectedDistortions ? "Distortion" : "Nominal"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-border-gray">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[.15em] mb-3">Lens Opacity</p>
            <div className="text-lg font-bold text-gray-800">
              {results.lensOpacity || 0}
              <span className="text-xs text-gray-400 ml-1">grade</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-gray p-0 rounded-xl text-left mb-8 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-border-gray flex items-center justify-between">
            <h3 className="text-xs font-bold flex items-center gap-2 text-gray-700 uppercase tracking-widest">
              <Stethoscope className="w-4 h-4 text-google-blue" />
              AI Diagnostic Assistance
            </h3>
            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Beta Module</div>
          </div>
          <div className="p-6 min-h-[160px]">
             {loading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-11/12" />
                  <div className="h-4 bg-gray-100 rounded w-10/12" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
             ) : (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {advice}
                  </p>
                </div>
             )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-2">
          <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
            <RefreshCcw className="w-4 h-4 mr-2" /> Finish & Exit
          </Button>
          <Button onClick={() => window.print()} size="lg" className="flex-1 bg-google-blue">
            <Mail className="w-4 h-4 mr-2" /> Share Report
          </Button>
        </div>

        <div className="mt-8 border-t border-border-gray pt-8 text-left">
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Clinical Referral Management</h3>
           <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-border-gray">
              <div className="flex-1">
                 <p className="text-xs font-bold text-gray-700">Assign to Government Hospital</p>
                 <select className="mt-2 w-full bg-white border border-border-gray rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-google-blue/20">
                    <option>Madurai Rajaji Govt Hospital</option>
                    <option>Chennai Regional Eye Hospital</option>
                    <option>Coimbatore Medical College</option>
                    <option>Trichy Govt Hospital</option>
                 </select>
              </div>
              <Button className="mt-5 bg-google-green hover:bg-green-700">
                 Generate Referral
              </Button>
           </div>
        </div>
      </Card>

      <div className="bg-google-red/5 border border-google-red/20 p-6 rounded-2xl flex gap-4">
        <AlertTriangle className="w-6 h-6 text-google-red shrink-0" />
        <div className="text-[10px] text-google-red/80 space-y-1">
          <p className="font-bold">Automated Analysis Disclaimer</p>
          <p>
            This AI-generated assessment is intended for preliminary screening and decision support only. 
            Final clinical diagnosis must be made by a qualified ophthalmologist using specialized bio-microscopy equipment.
          </p>
        </div>
      </div>
    </div>
  );
};
