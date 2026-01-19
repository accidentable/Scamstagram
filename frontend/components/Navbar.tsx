import React from 'react';
import { Home, Plus, User } from 'lucide-react';
import { Tab } from '../types';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white border-t border-slate-100 h-20 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto px-6">
        
        {/* Feed Tab */}
        <button 
          onClick={() => onTabChange(Tab.FEED)} 
          className="flex flex-col items-center justify-center w-12 h-12 transition-transform active:scale-90"
        >
          <Home 
            className={`w-7 h-7 ${currentTab === Tab.FEED ? 'text-black fill-black' : 'text-slate-300'}`} 
            strokeWidth={currentTab === Tab.FEED ? 2.5 : 2}
          />
        </button>

        {/* Scan/Hunt Button - BeReal Style Shutter */}
        <button 
          onClick={() => onTabChange(Tab.SCAN)} 
          className="flex flex-col items-center justify-center -mt-6"
        >
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all shadow-xl ${
            currentTab === Tab.SCAN 
              ? 'bg-black border-slate-200 scale-110' 
              : 'bg-black border-transparent hover:scale-105'
          }`}>
             <Plus className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </button>

        {/* Wallet/Profile Tab */}
        <button 
          onClick={() => onTabChange(Tab.WALLET)} 
          className="flex flex-col items-center justify-center w-12 h-12 transition-transform active:scale-90"
        >
          <User 
            className={`w-7 h-7 ${currentTab === Tab.WALLET ? 'text-black fill-black' : 'text-slate-300'}`} 
            strokeWidth={currentTab === Tab.WALLET ? 2.5 : 2}
          />
        </button>
      </div>
    </nav>
  );
};