import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Patient, TestResults } from '@/src/types';
import { db, collection, query, where, getDocs, orderBy, auth } from '@/src/lib/firebase';
import { History, Calendar, ExternalLink, ChevronLeft } from 'lucide-react';
import { ProgressionGraph } from './ProgressionGraph';

interface TestHistoryProps {
  patient: Patient;
  onBack: () => void;
  onNewTest: (mode: 'QUICK' | 'FULL') => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({ patient, onBack, onNewTest }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [patient.id]);

  const fetchHistory = async () => {
    if (!patient.id) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'testResults'), 
        where('ownerId', '==', auth.currentUser?.uid),
        where('patientId', '==', patient.id),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Vision History</h1>
            <p className="text-sm text-gray-500">{patient.name} • District Registry ID: {patient.externalId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onNewTest('QUICK')} variant="outline" className="border-google-blue text-google-blue">
            Quick Photo Scan
          </Button>
          <Button onClick={() => onNewTest('FULL')} className="bg-google-blue">
            Full Diagnostic Test
          </Button>
        </div>
      </div>

      {history.length > 0 && <ProgressionGraph data={history} />}

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Previous Records</h3>
        {history.map((record) => (
          <Card key={record.id} padding="md" className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center justify-center bg-gray-50 w-16 h-16 rounded-xl border border-border-gray">
                <Calendar className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-[10px] font-bold text-gray-600">
                  {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Cataract Screening Analysis</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-400">Acuity: <span className="text-google-blue font-semibold">{record.visualAcuityLeft}/{record.visualAcuityRight}</span></span>
                  <span className="text-xs text-gray-400">Contrast: <span className="text-google-green font-semibold">{record.contrastScore}%</span></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">
                 {record.aiDiagnosis || 'Screened'}
               </span>
               <Button variant="ghost" size="icon">
                 <ExternalLink className="w-4 h-4" />
               </Button>
            </div>
          </Card>
        ))}

        {!loading && history.length === 0 && (
          <div className="py-20 text-center text-gray-400 bg-white rounded-xl border border-border-gray border-dashed">
            <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p>No historical data for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};
