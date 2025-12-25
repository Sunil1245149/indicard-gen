
import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-t-4 border-red-600">
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle size={32} />
            <h2 className="text-xl font-bold uppercase tracking-wide">Important Disclaimer</h2>
          </div>
          
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-lg text-black">
              This application is for PERSONAL USE ONLY.
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                This Generated Card is <strong>NOT a Government Identity Document</strong>.
              </li>
              <li>
                It does <strong>NOT</strong> grant any legal rights, benefits, or government scheme access (PM Kisan, etc.).
              </li>
              <li>
                Using this card to impersonate a government document or for fraudulent purposes is a <strong>punishable offense</strong> under Indian Law.
              </li>
              <li>
                The "AgreeStack" and "Digital India Services" branding used here is fictional for design aesthetics only.
              </li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-yellow-800 text-xs mt-4">
              <strong>Privacy Policy:</strong> Data entered here is processed for generating the image. If you choose to "Save" via Login, data is stored securely in your personal cloud account. We do not share your data with third parties.
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
          >
            <ShieldCheck size={18} />
            I AGREE & UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
};
