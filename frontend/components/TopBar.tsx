import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-black tracking-tight brand-font text-black">
          Scamstagram.
        </h1>
      </div>
      <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
        <Bell className="w-6 h-6 text-black" strokeWidth={2} />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
};