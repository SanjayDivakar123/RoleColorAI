import React, { useState } from 'react';
import ScreeningPanel from '../components/ScreeningPanel';
import { UploadCloud, FileText } from 'lucide-react';

export default function Screening() {
  const [activeMode, setActiveMode] = useState('Resume'); // 'Resume' | 'Manual'

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI Screening</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="flex border-b border-gray-200 bg-gray-50">
            <button
               onClick={() => setActiveMode('Resume')}
               className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeMode === 'Resume' ? 'bg-white text-[#28BCE8] border-b-2 border-[#28BCE8]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
               <UploadCloud size={18} /> Mode A: Resume Parsing
            </button>
            <button
               onClick={() => setActiveMode('Manual')}
               className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeMode === 'Manual' ? 'bg-white text-[#28BCE8] border-b-2 border-[#28BCE8]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
               <FileText size={18} /> Mode B: Manual Assessment
            </button>
         </div>

         <div className="p-8 bg-gray-50/30">
            <ScreeningPanel mode={activeMode} />
         </div>
      </div>
    </div>
  );
}
