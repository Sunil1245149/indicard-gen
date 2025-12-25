
import React, { useState, useRef, useEffect } from 'react';
import { IdCardFront, IdCardBack, BCAgentCard, BCAgentCardBack } from './components/IdCard';
import { InputGroup } from './components/InputGroup';
import { DisclaimerModal } from './components/DisclaimerModal';
import { LoginPage } from './components/LoginPage';
import { PublicProfile } from './components/PublicProfile';
import { IdCardData, INITIAL_ID_DATA } from './types';
import { generateIdentityData } from './services/geminiService';
import { loginWithGoogle, logoutUser, saveCardToProfile, getUserCards, subscribeToAuth, User, getCardById } from './services/supabase';
import { Sparkles, Upload, RefreshCw, Printer, Tractor, Save, LogOut, FolderOpen, UserCircle, LayoutDashboard, Settings, Menu, Bell, Search, Lock, Briefcase, CreditCard, Image as ImageIcon, Trash2, Download, PenTool } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

export default function App() {
  // App Logic State
  const [data, setData] = useState<IdCardData>(INITIAL_ID_DATA);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  
  // Auth & View State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [view, setView] = useState<'login' | 'dashboard' | 'public_view'>('login');
  const [isDemo, setIsDemo] = useState(false);
  const [publicData, setPublicData] = useState<IdCardData | null>(null);

  // Storage State
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Check for Public View URL param (QR Code Scan)
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('id');

    if (cardId) {
      setView('public_view');
      setIsAuthLoading(true);
      getCardById(cardId).then((card) => {
        if (card) {
          setPublicData(card);
        } else {
          alert("Invalid or Expired ID Card Link.");
          setView('login');
        }
        setIsAuthLoading(false);
      });
      return; // Stop auth check if viewing public card
    }

    // 2. Listen for auth state changes if not public view
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setIsAuthLoading(false);
      if (u) {
        setView('dashboard');
        setIsDemo(false);
        loadUserCards(u.id);
      } else {
        if (!isDemo && view !== 'public_view') setView('login');
      }
    });
    return () => unsubscribe();
  }, [isDemo]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
      alert("Login failed. Check Supabase configuration.");
    }
  };

  const handleEnterDemo = () => {
    setIsDemo(true);
    setView('dashboard');
  };

  const handleLogout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setView('login');
      setData(INITIAL_ID_DATA);
    } else {
      await logoutUser();
      setView('login');
    }
  };

  const handleSaveCard = async () => {
    if (isDemo) {
      alert("Saving is disabled in Demo Mode. Please login to save your work.");
      return;
    }
    if (!user) return;

    setIsSaving(true);
    try {
      // Save to Supabase
      const newId = await saveCardToProfile(user.id, data);
      
      // Update local state with the new ID so the QR code generates the link
      const updatedData = { ...data, id: newId };
      setData(updatedData);
      
      await loadUserCards(user.id);
      alert("Card saved successfully! QR Code now links to online verification.");
    } catch (e) {
      alert("Error saving card to Supabase.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const loadUserCards = async (uid: string) => {
    try {
      const cards = await getUserCards(uid);
      setSavedCards(cards);
    } catch (e) {
      console.error("Failed to load cards", e);
    }
  };

  const handleLoadCard = (card: IdCardData) => {
    setData(card);
    setShowSavedList(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, signatureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const generatedData = await generateIdentityData(prompt);
      // Ensure we keep the current ID if we are editing an existing record, or clear it if it's new generation? 
      // Usually generation implies new data, so we clear ID to force a new save.
      setData(prev => ({ ...prev, ...generatedData, id: undefined }));
    } catch (error) {
      alert("Failed to generate identity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const frontElement = document.getElementById('card-front');
    const backElement = document.getElementById('card-back');

    if (!frontElement || !backElement) {
      alert("Could not find card elements to download.");
      return;
    }

    setIsDownloading(true);

    try {
      // 1. Capture High Quality Images
      const canvasFront = await html2canvas(frontElement, { 
        scale: 4, // High scale for sharp print quality
        useCORS: true,
        backgroundColor: null
      });
      const canvasBack = await html2canvas(backElement, { 
        scale: 4, 
        useCORS: true,
        backgroundColor: null
      });

      const imgDataFront = canvasFront.toDataURL('image/png');
      const imgDataBack = canvasBack.toDataURL('image/png');

      // 2. Initialize PDF (A4 Size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Standard ID Card Size (CR-80) in mm
      const cardWidth = 85.6; 
      const cardHeight = 54;
      
      // Margins
      const marginX = 15;
      const marginY = 15;
      const gap = 10;

      // Add Front
      pdf.setFontSize(10);
      pdf.text("Front Side:", marginX, marginY - 2);
      pdf.addImage(imgDataFront, 'PNG', marginX, marginY, cardWidth, cardHeight);

      // Add Back (Below Front)
      pdf.text("Back Side:", marginX, marginY + cardHeight + gap - 2);
      pdf.addImage(imgDataBack, 'PNG', marginX, marginY + cardHeight + gap, cardWidth, cardHeight);

      // Add Footer Info
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text("Generated by KisanID Pro - Private Use Only", marginX, 280);

      // Save
      pdf.save(`${data.name.replace(/\s+/g, '_')}_ID_Card.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTemplateChange = (type: 'kisan' | 'bc_agent') => {
    setData(prev => ({ ...prev, cardType: type }));
  };

  // RENDER LOGIC

  if (view === 'public_view') {
    if (isAuthLoading) return <div className="h-screen flex items-center justify-center bg-slate-100 text-gray-500">Verifying Record...</div>;
    if (!publicData) return <div className="h-screen flex items-center justify-center bg-slate-100 text-red-500">Record Not Found</div>;
    return <PublicProfile data={publicData} />;
  }
  
  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onDemo={handleEnterDemo} isLoading={isAuthLoading && !!user} />;
  }

  // DASHBOARD RENDER
  return (
    <div className="h-screen w-screen bg-slate-900 flex overflow-hidden font-sans text-slate-900">
      
      {/* Strict Disclaimer Modal */}
      <DisclaimerModal />

      {/* SOFTWARE SIDEBAR */}
      <div className="w-[280px] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 print:hidden z-30 shadow-xl">
        {/* Brand Area */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950">
           <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center text-white shadow-lg shadow-green-900/50">
              <Tractor size={18} />
           </div>
           <div>
             <h1 className="text-white font-bold text-lg tracking-tight">KisanID Pro</h1>
             <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Software Suite</p>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
           
           {/* Template Selection */}
           <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Select Template</div>
           <div className="grid grid-cols-2 gap-2 mb-6 px-1">
              <button 
                onClick={() => handleTemplateChange('kisan')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${data.cardType === 'kisan' ? 'bg-green-900/30 border-green-600 text-green-400' : 'border-slate-700 hover:bg-slate-800 text-slate-400'}`}
              >
                 <Tractor size={20} className="mb-1" />
                 <span className="text-[10px] font-bold">Kisan ID</span>
              </button>
              <button 
                onClick={() => handleTemplateChange('bc_agent')}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${data.cardType === 'bc_agent' ? 'bg-blue-900/30 border-blue-600 text-blue-400' : 'border-slate-700 hover:bg-slate-800 text-slate-400'}`}
              >
                 <Briefcase size={20} className="mb-1" />
                 <span className="text-[10px] font-bold">BC Agent</span>
              </button>
           </div>

           <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace</div>
           
           <button onClick={() => setActiveTab('manual')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'manual' ? 'bg-green-600/10 text-green-400 border border-green-600/20' : 'hover:bg-slate-800 hover:text-white'}`}>
              <LayoutDashboard size={18} />
              Manual Entry
           </button>
           
           <button onClick={() => setActiveTab('auto')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'auto' ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Sparkles size={18} />
              AI Auto-Fill
           </button>

           <div className="px-3 mt-8 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Management</div>
           
           <button 
             disabled={isDemo || isSaving}
             onClick={handleSaveCard}
             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isDemo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-white'}`}
           >
              {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Record'}
              {isDemo && <Lock size={12} className="ml-auto" />}
           </button>
           
           <button 
             disabled={isDemo}
             onClick={() => setShowSavedList(!showSavedList)}
             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isDemo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-white'} ${showSavedList ? 'bg-slate-800 text-white' : ''}`}
           >
              <FolderOpen size={18} />
              My Database
              {isDemo && <Lock size={12} className="ml-auto" />}
           </button>

           {showSavedList && !isDemo && (
             <div className="ml-4 mt-1 border-l border-slate-700 pl-3 space-y-1">
                {savedCards.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">No records found.</p>
                ) : (
                  savedCards.map((card, i) => (
                    <button key={i} onClick={() => handleLoadCard(card)} className="w-full text-left text-xs text-slate-400 hover:text-green-400 py-1 truncate">
                       {card.name}
                    </button>
                  ))
                )}
             </div>
           )}
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
           <div className="flex items-center gap-3 mb-3">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full border border-slate-600" alt="User" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <UserCircle size={20} />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{isDemo ? 'Demo User' : user?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{isDemo ? 'Restricted Access' : user?.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-400 rounded transition-colors"
           >
             <LogOut size={14} /> {isDemo ? 'Exit Demo' : 'Sign Out'}
           </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 print:hidden">
            <div className="flex items-center gap-4 text-gray-500">
               <Menu size={20} className="cursor-pointer hover:text-gray-800" />
               <div className="h-4 w-px bg-gray-300"></div>
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search parameters..." className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm border-none focus:ring-2 focus:ring-green-500 outline-none w-64" />
               </div>
            </div>

            <div className="flex items-center gap-4">
                {isDemo && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 animate-pulse">
                    DEMO MODE
                  </span>
                )}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer relative">
                   <Bell size={16} />
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer">
                   <Settings size={16} />
                </div>
            </div>
        </div>

        {/* Content Workspace */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Form Panel */}
            <div className="w-[400px] bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar p-6 print:hidden">
                <div className="mb-6">
                   <h2 className="text-lg font-bold text-gray-800 mb-1">
                      {data.cardType === 'bc_agent' ? 'Bank Agent Details' : (activeTab === 'auto' ? 'AI Generator' : 'Data Entry')}
                   </h2>
                   <p className="text-xs text-gray-500">Input details below to generate card.</p>
                </div>

                {activeTab === 'auto' && (
                  <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100 shadow-sm space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase mb-1">
                       <Sparkles size={14} /> Intelligent Prompt
                    </div>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Create a profile for Suresh from Satara, owning 2.5 Hectares in Village Koregaon..."
                      className="w-full p-3 rounded-lg border border-purple-200 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none h-24 bg-white/80"
                    />
                    <button 
                      onClick={handleAutoGenerate}
                      disabled={isLoading || !prompt}
                      className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isLoading ? <RefreshCw className="animate-spin" size={16} /> : "Generate Profile"}
                    </button>
                  </div>
                )}

                <div className="space-y-5">
                   
                   {/* Universal Customization Group */}
                   <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-blue-100">
                          <Settings size={14} className="text-blue-600" />
                          <h3 className="text-xs font-bold text-gray-700 uppercase">Card Branding</h3>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Logo / Watermark</label>
                          {data.logoUrl && (
                              <button 
                                onClick={() => setData(prev => ({...prev, logoUrl: null}))} 
                                className="text-[10px] flex items-center gap-1 text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded transition-colors"
                              >
                                <Trash2 size={10} /> Remove
                              </button>
                          )}
                      </div>
                      <div 
                          className={`border border-dashed rounded-md p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${data.logoUrl ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:bg-white bg-white'}`}
                          onClick={() => logoInputRef.current?.click()}
                      >
                          {data.logoUrl ? (
                              <div className="relative w-full flex items-center justify-center">
                                <img src={data.logoUrl} className="h-12 object-contain" alt="Logo Preview" />
                              </div>
                          ) : (
                              <>
                                <ImageIcon size={18} className="text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload Custom Logo</span>
                              </>
                          )}
                          <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                      </div>
                   </div>

                   {/* Personal Info Group - Shared by both */}
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                         <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                         <h3 className="text-xs font-bold text-gray-700 uppercase">Personal Information</h3>
                      </div>
                      
                      {data.cardType === 'kisan' && (
                         <InputGroup label="ID Number" name="idNumber" value={data.idNumber} onChange={handleInputChange} />
                      )}
                      
                      {data.cardType === 'bc_agent' && (
                         <InputGroup label="Agent ID / KO Code" name="idNumber" value={data.idNumber} onChange={handleInputChange} />
                      )}

                      <InputGroup label="Full Name (EN)" name="name" value={data.name} onChange={handleInputChange} />
                      
                      {data.cardType === 'kisan' && (
                        <InputGroup label="Full Name (Hindi)" name="hindiName" value={data.hindiName || ''} onChange={handleInputChange} className="font-hindi" />
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                          {data.cardType === 'kisan' && <InputGroup label="Father's Name" name="fatherName" value={data.fatherName} onChange={handleInputChange} />}
                          <InputGroup label="DOB" name="dob" value={data.dob} onChange={handleInputChange} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          {data.cardType === 'kisan' && <InputGroup label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} value={data.gender} onChange={handleInputChange} />}
                          <InputGroup label="Phone" name="phone" value={data.phone} onChange={handleInputChange} />
                      </div>
                   </div>

                   {/* BC Agent Specifics */}
                   {data.cardType === 'bc_agent' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <div className="w-1 h-4 bg-yellow-500 rounded-full"></div>
                          <h3 className="text-xs font-bold text-gray-700 uppercase">Bank Details</h3>
                        </div>
                        <InputGroup label="Issuer Company" name="issuerCompany" value={data.issuerCompany || ''} onChange={handleInputChange} />
                        <InputGroup label="Linked Branch (Shakha)" name="branchName" value={data.branchName || ''} onChange={handleInputChange} placeholder="e.g. Tuljapur Branch" />
                        <InputGroup label="BC Point Address" name="address" type="textarea" value={data.address} onChange={handleInputChange} />
                      </div>
                   )}

                   {/* Land Info Group - Kisan Only */}
                   {data.cardType === 'kisan' && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                          <h3 className="text-xs font-bold text-gray-700 uppercase">Land Records</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="District" name="district" value={data.district} onChange={handleInputChange} />
                            <InputGroup label="Taluka" name="taluka" value={data.taluka} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <InputGroup label="Village" name="village" value={data.village} onChange={handleInputChange} />
                            <InputGroup label="Gat No" name="gatNumber" value={data.gatNumber} onChange={handleInputChange} />
                            <InputGroup label="Area (H)" name="area" value={data.area} onChange={handleInputChange} />
                        </div>
                        <InputGroup label="Full Address" name="address" type="textarea" value={data.address} onChange={handleInputChange} />
                    </div>
                   )}

                   {/* Photo & Signature Group */}
                   <div className="pt-2">
                      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-gray-100">
                         <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                         <h3 className="text-xs font-bold text-gray-700 uppercase">Biometrics</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* Photo Upload */}
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all text-center"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {data.photoUrl ? (
                                <img src={data.photoUrl} className="w-14 h-16 object-cover rounded shadow-sm mb-1" />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-1">
                                <Upload size={16} />
                                </div>
                            )}
                            <span className="text-[10px] font-medium text-gray-600">Photo</span>
                            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                        </div>

                        {/* Signature Upload */}
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all text-center"
                            onClick={() => signatureInputRef.current?.click()}
                        >
                            {data.signatureUrl ? (
                                <img src={data.signatureUrl} className="w-full h-8 object-contain rounded mb-1" />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-1">
                                <PenTool size={16} />
                                </div>
                            )}
                            <span className="text-[10px] font-medium text-gray-600">Sign</span>
                            <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} className="hidden" accept="image/*" />
                        </div>
                      </div>

                   </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-gray-100/50 flex flex-col relative overflow-hidden">
               {/* Preview Toolbar */}
               <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center justify-between print:hidden">
                  <span className="text-xs font-bold text-gray-500 uppercase">Live Preview</span>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setData(INITIAL_ID_DATA)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors" title="Reset">
                        <RefreshCw size={16} />
                     </button>
                     
                     <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                     >
                        {isDownloading ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
                        Download PDF
                     </button>

                     <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold shadow-sm hover:bg-green-700 transition-all">
                        <Printer size={14} /> Print Card
                     </button>
                  </div>
               </div>

               {/* Card Canvas */}
               <div id="print-container" className="flex-1 overflow-auto custom-scrollbar p-10 flex flex-col items-center gap-8 print:p-0 print:block print:bg-white">
                  
                  {data.cardType === 'kisan' ? (
                    <>
                      {/* WRAPPER WITH ID FOR PDF CAPTURE */}
                      <div id="card-front" className="relative group print:break-inside-avoid print-card-wrapper inline-block">
                         <div className="absolute -inset-4 bg-white rounded-xl shadow-sm border border-gray-200 -z-10 print:hidden"></div>
                         <h4 className="absolute -top-10 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold print:hidden">Front Side</h4>
                         <IdCardFront data={data} />
                      </div>

                      <div id="card-back" className="relative group print:break-inside-avoid print-card-wrapper inline-block">
                         <div className="absolute -inset-4 bg-white rounded-xl shadow-sm border border-gray-200 -z-10 print:hidden"></div>
                         <h4 className="absolute -top-10 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold print:hidden">Back Side</h4>
                         <IdCardBack data={data} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div id="card-front" className="relative group print:break-inside-avoid print-card-wrapper inline-block">
                          <div className="absolute -inset-4 bg-white rounded-xl shadow-sm border border-gray-200 -z-10 print:hidden"></div>
                          <h4 className="absolute -top-10 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold print:hidden">BC Agent (Front)</h4>
                          <BCAgentCard data={data} />
                      </div>

                      <div id="card-back" className="relative group print:break-inside-avoid print-card-wrapper inline-block">
                          <div className="absolute -inset-4 bg-white rounded-xl shadow-sm border border-gray-200 -z-10 print:hidden"></div>
                          <h4 className="absolute -top-10 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold print:hidden">BC Agent (Back)</h4>
                          <BCAgentCardBack data={data} />
                      </div>
                    </>
                  )}

               </div>

               {/* Software Footer / Status Bar */}
               <div className="h-6 bg-slate-900 text-slate-400 text-[10px] px-4 flex items-center justify-between print:hidden z-30">
                  <div className="flex items-center gap-4">
                     <span>Ready</span>
                     <span>Server: Supabase Connected</span>
                     {isDemo && <span className="text-yellow-500">Demo Mode Active</span>}
                  </div>
                  <div>
                     AgreeStack ID Gen v2.5.1
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
