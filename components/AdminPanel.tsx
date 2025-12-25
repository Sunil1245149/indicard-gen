
import React, { useState, useEffect } from 'react';
import { getAllCards, deleteCard } from '../services/supabase';
import { Search, Trash2, Eye, Lock, LogOut, RefreshCw } from 'lucide-react';
import { IdCardData } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [cards, setCards] = useState<any[]>([]);
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'swara@2024') {
      setIsAuthenticated(true);
      fetchCards();
    } else {
      alert('Access Denied: Invalid Password');
    }
  };

  const fetchCards = async () => {
    setIsLoading(true);
    const data = await getAllCards();
    setCards(data);
    setFilteredCards(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCards(cards);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = cards.filter((item) => {
        const d = item.data as IdCardData;
        return (
          d.name?.toLowerCase().includes(lower) ||
          d.idNumber?.toLowerCase().includes(lower) ||
          d.phone?.toLowerCase().includes(lower) ||
          d.village?.toLowerCase().includes(lower)
        );
      });
      setFilteredCards(filtered);
    }
  }, [searchTerm, cards]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this card permanently?')) {
      const success = await deleteCard(id);
      if (success) {
        setCards(cards.filter(c => c.id !== id));
      } else {
        alert('Failed to delete card. Check database permissions.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-sm w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold">Admin Access</h2>
            <p className="text-slate-400 text-sm">Restricted Area</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
          <button onClick={onLogout} className="mt-4 text-sm text-slate-500 hover:text-white w-full">
            Back to Public App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
             <Lock size={18} className="text-red-500" /> Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400">Manage all generated records</p>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={fetchCards} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded flex items-center gap-2">
            <LogOut size={14} /> Lock
            </button>
            <button onClick={onLogout} className="text-xs text-slate-400 hover:text-white px-2">
                Exit
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Name, Mobile..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium ml-auto">
            Total Records: {filteredCards.length}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Former ID / Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCards.map((item) => {
                const d = item.data || {};
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                         {d.photoUrl ? (
                            <img src={d.photoUrl} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">IMG</div>
                         )}
                      </div>
                    </td>
                    <td className="p-3">
                       <div className="font-bold text-gray-800">{d.name || 'Unknown'}</div>
                       <div className="text-xs text-blue-600 font-mono">{d.idNumber || 'No ID'}</div>
                    </td>
                    <td className="p-3 text-gray-600">{d.phone || '-'}</td>
                    <td className="p-3 text-gray-600">
                        <div className="truncate max-w-[150px]">{d.village}, {d.district}</div>
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                        {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                        <a 
                          href={`/?id=${item.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          title="View Card"
                        >
                            <Eye size={16} />
                        </a>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCards.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">No records found matching your search.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
