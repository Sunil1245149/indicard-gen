
import React, { useState } from 'react';
import { Tractor, ShieldCheck, LogIn, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onGoogleLogin: () => void;
  onEmailLogin: (e: string, p: string) => Promise<void>;
  onEmailSignup: (e: string, p: string) => Promise<void>;
  onGuestLogin: () => void;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onGoogleLogin, 
  onEmailLogin, 
  onEmailSignup,
  onGuestLogin, 
  isLoading 
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }
    
    try {
      if (isSignUp) {
        await onEmailSignup(email, password);
      } else {
        await onEmailLogin(email, password);
      }
    } catch (err: any) {
       // Error is handled by parent, but we can catch local format errors if needed
       console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-700 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl h-auto md:h-[600px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700 mx-4">
        
        {/* Left Side - Brand */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-green-700 to-emerald-900 p-8 md:p-10 flex flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-green-700 shadow-lg">
                <Tractor size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">KisanID Pro</h1>
            </div>
            <p className="text-green-100 text-sm leading-relaxed opacity-90">
              Professional identity card generation software for Indian Farmers. 
              Features AI-powered autofill, photo uploading, and secure printing.
            </p>
          </div>

          <div className="space-y-4 mt-8 md:mt-0">
            <div className="flex items-center gap-3 text-sm opacity-80">
              <ShieldCheck size={18} />
              <span>Personal Use Only • Not Govt ID</span>
            </div>
            <div className="h-px bg-white/20 w-full"></div>
            <p className="text-[10px] uppercase tracking-widest opacity-60">Version 2.5.0</p>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
             <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 L100 0 L100 100 Z" fill="white" />
             </svg>
          </div>
        </div>

        {/* Right Side - Auth Controls */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-slate-500 text-sm">
              {isSignUp ? 'Sign up to start saving your ID cards.' : 'Please login to access your saved cards.'}
            </p>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {localError && <p className="text-xs text-red-500">{localError}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
               {isLoading ? (
                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
               ) : (
                 <>
                   {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={16} />
                 </>
               )}
            </button>
          </form>

          <div className="flex justify-center mb-6">
             <button 
               type="button" 
               onClick={() => { setIsSignUp(!isSignUp); setLocalError(''); }}
               className="text-sm text-green-700 hover:underline font-medium"
             >
               {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
             </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button"
              onClick={onGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
               <LogIn size={18} />
               Google
            </button>
            
            <button 
              type="button"
              onClick={onGuestLogin}
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              <User size={18} />
              Guest Mode
            </button>
          </div>
          
          <p className="text-[10px] text-center text-slate-400 mt-4">
             Note: Google Login requires additional configuration in Supabase Dashboard. Use Email/Password if Google fails.
          </p>
        </div>

      </div>
      
      <div className="absolute bottom-4 text-slate-500 text-xs hidden md:block">
         &copy; 2025 KisanID Solutions. All rights reserved.
      </div>
    </div>
  );
};
