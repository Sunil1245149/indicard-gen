
import React from 'react';
import { IdCardData } from '../types';

interface IdCardProps {
  data: IdCardData;
}

// Helper to generate QR code URL
// If card has an ID (saved in DB), QR points to the Web App View URL
// If not, QR contains static text data
const getQrUrl = (data: IdCardData) => {
  if (data.id) {
    // Dynamic URL for Online Verification
    // CRITICAL: Use window.location.href to include subdirectory path (e.g. /indicard-gen/) on GitHub Pages
    const baseUrl = window.location.href.split('?')[0].replace(/\/$/, ""); 
    const fullUrl = `${baseUrl}?id=${data.id}`;
    
    return `https://quickchart.io/qr?text=${encodeURIComponent(fullUrl)}&size=400&ecLevel=M&margin=1&format=svg`;
  }
  // Return empty if not saved yet
  return '';
};

const QrPlaceholder = () => (
    <div className="w-full h-full bg-gray-100 border border-dashed border-gray-400 flex flex-col items-center justify-center p-1">
        <span className="text-[8px] text-center font-bold text-gray-500 leading-tight">SAVE TO<br/>GENERATE</span>
    </div>
);

// Professional SVG Logo Construction for AgreeStack
const AgreeStackLogo = () => (
  <div className="flex items-center gap-1">
    {/* Icon Part */}
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5L30 12V28L20 35L10 28V12L20 5Z" fill="#EAB308" stroke="#A16207" strokeWidth="2"/>
      <path d="M20 12C20 12 25 18 25 22C25 25 22.5 27 20 27C17.5 27 15 25 15 22C15 18 20 12 20 12Z" fill="#16A34A"/>
      <path d="M20 27V35" stroke="#166534" strokeWidth="2"/>
      <path d="M10 12L20 18L30 12" stroke="#A16207" strokeWidth="1.5" strokeOpacity="0.5"/>
    </svg>
    
    {/* Text Part */}
    <div className="flex flex-col leading-none justify-center">
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-gray-800 tracking-tight font-serif">Agree</span>
        <span className="text-xl font-bold text-yellow-600 tracking-tight font-serif">Stack</span>
      </div>
      <span className="text-[6px] text-green-700 tracking-widest font-sans uppercase font-bold text-right -mt-1">Private Services</span>
    </div>
  </div>
);

// Realistic Bank of Maharashtra Logo SVG (Blue Deepstambh Seal)
const BOMLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Ring */}
    <circle cx="100" cy="100" r="95" fill="none" stroke="#0072bc" strokeWidth="4" />
    <circle cx="100" cy="100" r="75" fill="none" stroke="#0072bc" strokeWidth="2" />
    
    {/* Text in Ring - Top */}
    <path id="curveTop" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
    <text width="200" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0072bc" letterSpacing="2">
      <textPath href="#curveTop" startOffset="50%">
         BANK OF MAHARASHTRA
      </textPath>
    </text>

    {/* Text in Ring - Bottom */}
    <path id="curveBottom" d="M 30 100 A 70 70 0 0 0 170 100" fill="none" />
    <text width="200" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0072bc">
      <textPath href="#curveBottom" startOffset="50%">
         ONE FAMILY ONE BANK
      </textPath>
    </text>

    {/* Central Pillar (Deepstambh) */}
    <g transform="translate(100, 100)">
        {/* Base */}
        <path d="M-15 40 L15 40 L15 50 L-15 50 Z" fill="#0072bc" />
        <path d="M-10 40 L-10 -20 L10 -20 L10 40 Z" fill="#0072bc" />
        
        {/* Lamps Left */}
        <path d="M-10 30 L-25 25 L-10 28 Z" fill="#0072bc" />
        <path d="M-10 15 L-25 10 L-10 13 Z" fill="#0072bc" />
        <path d="M-10 0 L-25 -5 L-10 -2 Z" fill="#0072bc" />
        
        {/* Lamps Right */}
        <path d="M10 30 L25 25 L10 28 Z" fill="#0072bc" />
        <path d="M10 15 L25 10 L10 13 Z" fill="#0072bc" />
        <path d="M10 0 L25 -5 L10 -2 Z" fill="#0072bc" />
        
        {/* Top Flame */}
        <circle cx="0" cy="-30" r="5" fill="#0072bc" />
        <path d="M0 -30 Q5 -40 0 -50 Q-5 -40 0 -30" fill="#0072bc" />
    </g>

    {/* Flanking M Shapes */}
    <path d="M 40 90 L 50 70 L 60 90" stroke="#0072bc" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 140 90 L 150 70 L 160 90" stroke="#0072bc" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Paddy (Dhan) Background Component - Blurred
const PaddyBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
    <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
       <filter id="blurMe">
         <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
       </filter>
       <g filter="url(#blurMe)" opacity="0.15">
          {/* Wheat/Paddy Stalks Pattern */}
          {[...Array(20)].map((_, i) => {
             const x = Math.random() * 400;
             const y = 100 + Math.random() * 200;
             const rotation = (Math.random() - 0.5) * 40;
             const scale = 0.5 + Math.random() * 1.5;
             return (
               <g key={i} transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
                  {/* Stem */}
                  <path d="M0 0 Q 5 -50 0 -100" stroke="#15803d" strokeWidth="2" fill="none" />
                  {/* Grains Left */}
                  <path d="M0 -20 L -5 -25 M 0 -35 L -5 -40 M 0 -50 L -5 -55 M 0 -65 L -5 -70 M 0 -80 L -5 -85" stroke="#eab308" strokeWidth="2" />
                  {/* Grains Right */}
                  <path d="M0 -20 L 5 -25 M 0 -35 L 5 -40 M 0 -50 L 5 -55 M 0 -65 L 5 -70 M 0 -80 L 5 -85" stroke="#eab308" strokeWidth="2" />
                  {/* Top Grain */}
                  <path d="M0 -100 L 0 -110" stroke="#eab308" strokeWidth="2" />
               </g>
             )
          })}
       </g>
    </svg>
    {/* Green tint overlay */}
    <div className="absolute inset-0 bg-green-50 opacity-30 mix-blend-multiply"></div>
  </div>
);

// Guilloche Pattern Background Component
const GuillochePattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="guilloche" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 Q 10 0 20 10 T 40 10" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
        <path d="M0 10 Q 10 20 20 10 T 40 10" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#guilloche)" />
  </svg>
);

// Decorative Border Frame SVG
const BorderFrame = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-50" xmlns="http://www.w3.org/2000/svg">
     {/* Outer Green Border */}
     <rect x="1" y="1" width="340" height="214" rx="11" fill="none" stroke="#15803d" strokeWidth="3" />
  </svg>
);

// New Reusable Watermark Component
const Watermark: React.FC<{ logoUrl?: string | null }> = ({ logoUrl }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <div className="w-64 h-64 opacity-[0.07] transform scale-125 flex items-center justify-center">
         {logoUrl ? (
            <img src={logoUrl} className="w-full h-full object-contain grayscale" style={{ filter: 'grayscale(100%)' }} />
         ) : (
            <BOMLogo />
         )}
      </div>
    </div>
  );
};

export const IdCardFront: React.FC<IdCardProps> = ({ data }) => {
  const qrUrl = getQrUrl(data);
  const showQr = !!data.id;

  return (
    <div className="w-[342px] h-[216px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col print:shadow-none font-sans select-none box-border">
      
      {/* SVG Border Frame */}
      <BorderFrame />

      {/* Background - Priority to Logo Watermark if present, else Paddy */}
      {data.logoUrl ? (
        <Watermark logoUrl={data.logoUrl} />
      ) : (
        <PaddyBackground />
      )}

      {/* Guilloche Pattern */}
      <GuillochePattern />

      {/* Header Section */}
      <div className="h-[58px] w-full bg-gradient-to-r from-white/90 via-green-50/90 to-white/90 flex items-center justify-between px-3 relative z-10 pt-1 ml-[4px] mr-[4px] mt-[4px] rounded-t-lg backdrop-blur-[1px]">
        <div className="flex items-center gap-2">
           <div className="flex flex-col justify-center pl-1">
              <span className="text-[14px] font-bold text-green-900 leading-none uppercase tracking-wide">Farmer Profile Card</span>
              <span className="text-[8px] font-medium text-gray-500 mt-[2px]">Issued for Personal Record Only</span>
           </div>
        </div>
        <div className="scale-75 origin-right">
           {data.logoUrl ? (
              <img src={data.logoUrl} className="h-10 object-contain" alt="Logo" />
           ) : (
              <AgreeStackLogo />
           )}
        </div>
      </div>

      <div className="flex-1 p-3 flex gap-3 relative z-10 pl-4 pr-4">
        
        {/* Photo Box */}
        <div className="flex flex-col gap-1 w-[85px] flex-shrink-0 z-20">
          <div className="w-[85px] h-[100px] bg-white border border-gray-400 p-[2px] shadow-sm">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-[8px] text-gray-400 text-center">PHOTO</span>
              </div>
            )}
          </div>
          <div className="w-full h-6 border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
             {data.signatureUrl ? (
                <img src={data.signatureUrl} className="h-full object-contain" alt="Sign" />
             ) : (
                <span className="text-[6px] text-gray-400 italic">Signature</span>
             )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-start pt-1 relative z-20">
          <div className="mb-2 border-b border-dashed border-gray-300 pb-1 w-[60%]">
            <h1 className="text-sm font-bold text-gray-900 leading-tight">{data.name}</h1>
            <h2 className="text-sm font-bold text-gray-800 font-hindi leading-tight mt-[1px]">{data.hindiName || data.name}</h2>
          </div>
          
          <div className="grid grid-cols-[60px_1fr] gap-y-[2px] text-[10px] text-gray-800 leading-tight bg-white/60 p-1 rounded">
            <span className="font-semibold text-gray-600">DOB:</span>
            <span className="font-bold">{data.dob}</span>
            
            <span className="font-semibold text-gray-600">Gender:</span>
            <span className="font-bold">{data.gender}</span>
            
            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="font-bold">{data.phone}</span>
            
            <span className="font-semibold text-gray-600">Farmer ID:</span>
            <span className="font-bold text-green-700">{data.idNumber}</span>
          </div>

          {/* Large QR Front - Positioned bottom right inside borders */}
          <div className="absolute bottom-1 right-2 w-20 h-20 bg-white border border-gray-300 shadow-sm p-[2px]">
             {showQr ? (
                <img src={qrUrl} alt="QR" className="w-full h-full" />
             ) : (
                <QrPlaceholder />
             )}
          </div>
        </div>
        
      </div>

      {/* Footer */}
      <div className="h-7 bg-[#15803d] flex items-center justify-between px-4 relative z-20 shadow-inner ml-[4px] mr-[4px] mb-[4px] rounded-b-lg">
         <div className="flex flex-col">
             <span className="text-[9px] text-white font-bold tracking-widest uppercase">Kisan Identity Card</span>
         </div>
         <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      </div>
      
    </div>
  );
};

export const IdCardBack: React.FC<IdCardProps> = ({ data }) => {
  const qrUrl = getQrUrl(data);
  const showQr = !!data.id;

  return (
    <div className="w-[342px] h-[216px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col print:shadow-none font-sans select-none box-border">
       
       {/* SVG Border Frame */}
       <BorderFrame />
       
       {/* Background */}
       {data.logoUrl ? (
          <Watermark logoUrl={data.logoUrl} />
       ) : (
          <PaddyBackground />
       )}

       <GuillochePattern />

       {/* Top Bar */}
       <div className="h-8 bg-gray-100/90 border-b border-gray-300 flex items-center justify-between px-3 pt-1 ml-[4px] mr-[4px] mt-[4px] rounded-t-lg relative z-10 backdrop-blur-sm">
          <span className="text-[8px] text-gray-500">Card No: <span className="text-black font-mono font-bold">{data.idNumber}</span></span>
          <span className="text-[8px] text-gray-500">Issued: <span className="text-black font-bold">{data.issueDate}</span></span>
       </div>

       <div className="flex-1 p-3 flex flex-col relative z-10 pl-4 pr-4">
          
          {/* Address Block */}
          <div className="mb-2 pl-1 bg-white/50 rounded p-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase block mb-[2px]">Permanent Address / पत्ता</span>
            <p className="text-[10px] font-medium text-gray-900 leading-snug">{data.address}</p>
          </div>

          {/* Land Details Table */}
          <div className="mt-1 w-full border border-gray-400 rounded-sm overflow-hidden mb-1 shadow-sm">
            <div className="grid grid-cols-5 bg-green-100/90 border-b border-gray-400">
                <div className="p-1 text-[7px] font-bold text-center border-r border-gray-300 text-green-900">DISTRICT</div>
                <div className="p-1 text-[7px] font-bold text-center border-r border-gray-300 text-green-900">TALUKA</div>
                <div className="p-1 text-[7px] font-bold text-center border-r border-gray-300 text-green-900">VILLAGE</div>
                <div className="p-1 text-[7px] font-bold text-center border-r border-gray-300 text-green-900">GAT NO</div>
                <div className="p-1 text-[7px] font-bold text-center text-green-900">AREA (H)</div>
            </div>
            <div className="grid grid-cols-5 bg-white/90">
                <div className="p-1 text-[9px] font-bold text-center border-r border-gray-300 truncate">{data.district}</div>
                <div className="p-1 text-[9px] font-bold text-center border-r border-gray-300 truncate">{data.taluka}</div>
                <div className="p-1 text-[9px] font-bold text-center border-r border-gray-300 truncate">{data.village}</div>
                <div className="p-1 text-[9px] font-bold text-center border-r border-gray-300 truncate">{data.gatNumber}</div>
                <div className="p-1 text-[9px] font-bold text-center truncate">{data.area}</div>
            </div>
          </div>

          <div className="flex items-end justify-between mt-auto px-1">
             <div className="text-[6px] text-gray-400 max-w-[120px] leading-tight opacity-75 pb-1 bg-white/40 rounded p-0.5">
                <p>1. Card property of the holder.</p>
                <p>2. Return to owner if found.</p>
                <p className="mt-1 font-bold text-red-800">PERSONAL USE ONLY.</p>
                <p className="text-red-600">NOT A GOVT DOCUMENT.</p>
             </div>
             
             {/* Large Scanner - Maximized Size */}
             <div className="flex flex-col items-center gap-0.5 -mb-2 -mr-1 z-20">
                <div className="w-[90px] h-[90px] border border-gray-400 p-[2px] bg-white shadow-sm mb-1">
                    {showQr ? (
                        <img src={qrUrl} alt="QR Code" className="w-full h-full" />
                    ) : (
                        <QrPlaceholder />
                    )}
                </div>
             </div>
          </div>
       </div>

       {/* Bottom Stripe */}
       <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-500 mb-[4px] ml-[4px] mr-[4px] rounded-b-lg relative z-10 opacity-90"></div>
    </div>
  );
};

export const BCAgentCard: React.FC<IdCardProps> = ({ data }) => {
  const qrUrl = getQrUrl(data);
  const showQr = !!data.id;
  
  return (
    <div className="w-[342px] h-[216px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col print:shadow-none font-sans select-none box-border text-[#1e3a8a]">
       
       {/* Reusable Watermark for both sides */}
       <Watermark logoUrl={data.logoUrl} />

       {/* Top Header */}
       <div className="h-[55px] border-b-2 border-yellow-500 bg-white flex items-center px-4 gap-3 relative z-10">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
             {data.logoUrl ? (
                <img src={data.logoUrl} className="w-full h-full object-contain" />
             ) : (
                <BOMLogo />
             )}
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-bold text-[#1e3a8a] uppercase tracking-wide leading-none mb-0.5">Bank of Maharashtra</span>
             <span className="text-[8px] font-bold text-yellow-600 uppercase tracking-wide">भारत सरकार का उद्यम | A Govt of India Undertaking</span>
             <span className="text-[9px] font-extrabold text-[#1e3a8a] uppercase mt-0.5 bg-yellow-100 px-1 w-fit rounded-sm border border-yellow-200">Corporate BC Agent Identity Card</span>
          </div>
       </div>

       <div className="flex-1 flex p-4 gap-4 relative z-10">
          {/* Photo Section */}
          <div className="flex flex-col gap-1 w-[80px]">
             <div className="w-[80px] h-[95px] bg-gray-100 border-2 border-yellow-400 p-[2px] rounded-sm shadow-sm">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="Agent" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 uppercase font-bold">Photo</div>
                )}
             </div>
             <div className="text-[6px] text-center font-bold text-[#1e3a8a] uppercase mt-1 leading-tight flex items-center justify-center h-6">
                 {data.signatureUrl ? (
                     <img src={data.signatureUrl} className="h-full object-contain" alt="Auth Sign" />
                 ) : (
                     <>Authorized<br/>Signature</>
                 )}
             </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-2 pt-1">
             <div className="grid grid-cols-[70px_1fr] gap-y-1.5 text-[10px] leading-tight">
                <span className="font-bold text-gray-500">Agent ID / KO:</span>
                <span className="font-bold text-[#1e3a8a] text-xs font-mono">{data.idNumber}</span>

                <span className="font-bold text-gray-500">Name:</span>
                <span className="font-bold text-black uppercase">{data.name}</span>

                <span className="font-bold text-gray-500">DOB:</span>
                <span className="font-bold text-black">{data.dob}</span>
                
                <span className="font-bold text-gray-500">Contact:</span>
                <span className="font-bold text-black">{data.phone}</span>

                <span className="font-bold text-gray-500">Issued By:</span>
                <span className="font-bold text-[#1e3a8a] leading-none">{data.issuerCompany}</span>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="h-6 bg-[#1e3a8a] flex items-center justify-between px-4 relative z-10">
          <span className="text-[8px] text-yellow-400 font-medium tracking-widest uppercase">Ek Parivaar • Ek Bank</span>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
       </div>
    </div>
  );
};

export const BCAgentCardBack: React.FC<IdCardProps> = ({ data }) => {
  const qrUrl = getQrUrl(data);
  const showQr = !!data.id;
  
  return (
    <div className="w-[342px] h-[216px] bg-white rounded-xl shadow-lg relative overflow-hidden flex flex-col print:shadow-none font-sans select-none box-border text-[#1e3a8a]">
       
       {/* Reusable Watermark for both sides */}
       <Watermark logoUrl={data.logoUrl} />

       {/* Top Header */}
       <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 relative z-10">
          <span className="text-[8px] font-bold text-gray-500 uppercase">Agent Details Record</span>
          <span className="text-[8px] font-bold text-[#1e3a8a]">ID: {data.idNumber}</span>
       </div>

       <div className="flex-1 p-5 flex gap-4 relative z-10">
          
          <div className="flex-1 flex flex-col gap-3">
             {/* Branch Details */}
             <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-sm">
                 <span className="text-[8px] font-bold text-yellow-700 uppercase block mb-0.5">Linked Branch (Shakha)</span>
                 <p className="text-sm font-bold text-[#1e3a8a]">{data.branchName || "Main Branch"}</p>
             </div>

             {/* Address Details */}
             <div>
                 <span className="text-[9px] font-bold text-gray-500 uppercase block border-b border-gray-200 pb-0.5 mb-1">BC Point Address & Location</span>
                 <p className="text-[10px] font-medium text-black leading-snug">{data.address}</p>
             </div>

             {/* Disclaimer */}
             <div className="mt-auto">
                 <p className="text-[7px] text-gray-400 leading-tight text-justify">
                    This card is the property of the issuer. If found, please return to the nearest Bank of Maharashtra branch. 
                    Usage of this card is limited to official Business Correspondent duties. 
                    <br/><span className="text-red-600 font-bold">NOT FOR IDENTITY PROOF IN OTHER SECTORS.</span>
                 </p>
             </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center w-[80px]">
             <div className="w-[80px] h-[80px] border-2 border-gray-200 p-1 bg-white mb-1">
                 {showQr ? (
                     <img src={qrUrl} alt="QR" className="w-full h-full" />
                 ) : (
                     <QrPlaceholder />
                 )}
             </div>
             <span className="text-[7px] text-center font-bold text-gray-400 uppercase">Scan for<br/>Agent Verification</span>
          </div>

       </div>

       {/* Footer Stripe */}
       <div className="h-3 bg-gradient-to-r from-[#1e3a8a] via-yellow-400 to-[#1e3a8a]"></div>
    </div>
  );
};
