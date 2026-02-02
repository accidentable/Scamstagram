import React from 'react';
import { Home, Camera, HelpCircle } from 'lucide-react';
import { Tab } from '../types';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: Tab.FEED, icon: Home, label: '피드' },
    { id: Tab.REPORT, icon: Camera, label: '' },
    { id: Tab.QUIZ, icon: HelpCircle, label: '퀴즈' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white border-t border-slate-100 h-20 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const isReport = tab.id === Tab.REPORT;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-all ${
                isReport ? '-mt-4' : ''
              }`}
            >
              {isReport ? (
                // 신고 버튼 - 중앙 강조
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 scale-110'
                    : 'bg-blue-600 hover:scale-105'
                }`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon
                    className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
