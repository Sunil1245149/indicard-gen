
import React from 'react';
import { IdCardData } from '../types';
import { IdCardFront, IdCardBack, BCAgentCard, BCAgentCardBack } from './IdCard';
import { ShieldCheck, UserCheck } from 'lucide-react';

interface PublicProfileProps {
  data: IdCardData;
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 overflow-y-auto">
      {/* Header Banner */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-t-4 border-green-600 p-4 mb-6 flex items-center gap-4">
         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
             <ShieldCheck size={28} />
         </div>
         <div>
             <h1 className="text-lg font-bold text-gray-800">Verified Profile</h1>
             <p className="text-xs text-green-600 font-medium flex items-center gap-1">
               <UserCheck size={12} /> Identity Confirmed via Supabase
             </p>
         </div>
      </div>

      <div className="flex flex-col gap-6 items-center w-full max-w-md">
        {/* Render Cards - Scale down slightly for mobile safety */}
        <div className="transform scale-90 sm:scale-100 origin-top">
            {data.cardType === 'kisan' ? <IdCardFront data={data} /> : <BCAgentCard data={data} />}
        </div>
        
        <div className="transform scale-90 sm:scale-100 origin-top -mt-4">
            {data.cardType === 'kisan' ? <IdCardBack data={data} /> : <BCAgentCardBack data={data} />}
        </div>
      </div>

      {/* Raw Data Table */}
      <div className="w-full max-w-md mt-4 bg-white rounded-lg shadow-sm p-4 text-sm">
         <h3 className="font-bold text-gray-500 uppercase text-xs mb-3 border-b pb-2">Record Details</h3>
         <div className="space-y-2">
            <div className="flex justify-between">
               <span className="text-gray-500">Record ID:</span>
               <span className="font-mono text-xs">{data.id?.substring(0,8)}...</span>
            </div>
            <div className="flex justify-between">
               <span className="text-gray-500">Holder Name:</span>
               <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex justify-between">
               <span className="text-gray-500">Former ID:</span>
               <span className="font-medium font-mono text-green-700">{data.idNumber}</span>
            </div>
            <div className="flex justify-between">
               <span className="text-gray-500">Mobile:</span>
               <span className="font-medium">{data.phone}</span>
            </div>
            
            {/* Extended Details for Kisan Cards */}
            {data.cardType === 'kisan' && (
                <>
                    <div className="border-t border-dashed my-2 pt-1"></div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Village:</span>
                        <span className="font-medium">{data.village}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">District:</span>
                        <span className="font-medium">{data.district}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Gat No:</span>
                        <span className="font-medium">{data.gatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Area:</span>
                        <span className="font-medium">{data.area} Ha</span>
                    </div>
                </>
            )}
            
            <div className="flex justify-between mt-2 pt-2 border-t">
               <span className="text-gray-500">Issue Date:</span>
               <span className="font-medium">{data.issueDate}</span>
            </div>
         </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
         This is a digital verification copy served directly from the secure cloud database. 
      </p>
    </div>
  );
};
