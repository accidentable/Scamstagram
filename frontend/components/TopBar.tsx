import React, { useState } from 'react';
import { Bell, Shield, LogOut, User } from 'lucide-react';
import { INITIAL_WALLET } from '../constants';

interface TopBarProps {
  user?: {
    username: string;
    avatar: string;
    level: number;
  } | null;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Shield className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-black">
          ScamKeep
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* 포인트 표시 */}
        <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full">
          <span className="text-lg">🪙</span>
          <span className="font-bold text-indigo-700 text-sm">{INITIAL_WALLET.balance}P</span>
        </div>

        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-6 h-6 text-black" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
            >
              <img 
                src={user.avatar || `https://picsum.photos/seed/${user.username}/200/200`} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">Lv.{user.level}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMenu(false);
                      onLogout?.();
                    }}
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
