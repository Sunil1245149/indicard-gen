import React from 'react';
import { Tractor, ShieldCheck, PlayCircle, LogIn, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onDemo: () => void;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onDemo, isLoading }) => {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-700 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl h-[600px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex border border-slate-700">
        
        {/* Left Side - Brand */}
        <div className="w-1/2 bg-gradient-to-br from-green-700 to-emerald-900 p-10 flex flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-green-700 shadow-lg">
                <Tractor size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">KisanID Pro</h1>
            </div>
            <p className="text-green-100 text-sm leading-relaxed opacity-90">
              Professional identity card generation software for agricultural profiles. 
              Features AI-powered autofill, cloud sync, and secure local printing.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm opacity-80">
              <ShieldCheck size={18} />
              <span>Personal Use Only • Not Govt ID</span>
            </div>
            <div className="h-px bg-white/20 w-full"></div>
            <p className="text-[10px] uppercase tracking-widest opacity-60">Version 2.4.0 (Stable)</p>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
             <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
             </svg>
          </div>
        </div>

        {/* Right Side - Auth Controls */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please authenticate to access the software dashboard.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  Login with Google
                </>
              )}
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR CONTINUE AS GUEST</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              onClick={onDemo}
              className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] group"
            >
              <PlayCircle size={18} className="group-hover:text-green-600 transition-colors" />
              Try Demo Mode
            </button>
          </div>

          <div className="mt-8 bg-yellow-50 p-3 rounded-md border border-yellow-100 flex gap-2">
             <Lock size={14} className="text-yellow-700 mt-1 flex-shrink-0" />
             <p className="text-[10px] text-yellow-800 leading-tight">
               <strong>Demo Mode Restriction:</strong> Cloud storage (Save/Load) is disabled. You can only generate and print cards locally.
             </p>
          </div>
        </div>

      </div>
      
      <div className="absolute bottom-4 text-slate-500 text-xs">
         &copy; 2024 AgreeStack Software Solutions. All rights reserved.
      </div>
    </div>
  );
};