import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Patient } from '@/src/types';
import { db, collection, query, where, getDocs, addDoc, auth, orderBy } from '@/src/lib/firebase';
import { UserPlus, Search, ArrowRight, User } from 'lucide-react';

interface PatientDashboardProps {
  onSelectPatient: (patient: Patient) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newPatient, setNewPatient] = useState({ 
    name: '', 
    age: '', 
    externalId: '', 
    phone: '', 
    district: 'Madurai', 
    block: '' 
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.externalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'patients'), 
        where('ownerId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
      setPatients(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'patients'), {
        ...newPatient,
        age: parseInt(newPatient.age),
        ownerId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });
      setNewPatient({ name: '', age: '', externalId: '', phone: '', district: 'Madurai', block: '' });
      setShowAdd(false);
      fetchPatients();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Community Vision Registration</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Field Screening Portal</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <UserPlus className="w-4 h-4 mr-2" /> {showAdd ? 'Cancel' : 'Register Patient'}
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-google-blue transition-colors" />
        <input 
          type="text"
          placeholder="Search by patient name or registry ID..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-border-gray rounded-xl text-sm outline-none focus:ring-2 focus:ring-google-blue/10 focus:border-google-blue transition-all shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {showAdd && (
        <Card className="p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
              <input 
                required
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.name}
                onChange={e => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Age</label>
              <input 
                required
                type="number"
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.age}
                onChange={e => setNewPatient({...newPatient, age: e.target.value})}
              />
            </div>
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
              <input 
                required
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.phone}
                onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
              <select 
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.district}
                onChange={e => setNewPatient({...newPatient, district: e.target.value})}
              >
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Trichy">Trichy</option>
                <option value="Salem">Salem</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Block / Taluk</label>
              <input 
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.block}
                onChange={e => setNewPatient({...newPatient, block: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Aadhaar / ID</label>
              <input 
                required
                className="w-full px-3 py-2 bg-gray-50 border border-border-gray rounded-md text-sm outline-none focus:ring-2 focus:ring-google-blue/20"
                value={newPatient.externalId}
                onChange={e => setNewPatient({...newPatient, externalId: e.target.value})}
              />
            </div>
            <Button type="submit" className="md:col-span-3 mt-2 h-11 bg-google-blue">Finalize Registration</Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map(p => (
          <Card 
            key={p.id} 
            className="p-5 hover:border-google-blue transition-colors cursor-pointer group relative overflow-hidden"
            onClick={() => onSelectPatient(p)}
          >
            <div className="absolute top-0 right-0 px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase rounded-bl">
              {p.district}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-google-blue font-bold text-lg">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-400">{p.block || 'Main Block'} • ID: {p.externalId}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-google-blue group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        ))}
        {!loading && filteredPatients.length === 0 && (
          <div className="md:col-span-2 py-20 text-center text-gray-400">
            {searchTerm ? (
              <>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No matches found for "{searchTerm}"</p>
              </>
            ) : (
              <>
                <User className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No patient records found. Create one to begin testing.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
