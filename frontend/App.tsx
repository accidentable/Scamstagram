import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { TopBar } from './components/TopBar';
import { Feed } from './components/Feed';
import { Report } from './components/Report';
import { Quiz } from './components/Quiz';
import { Wallet } from './components/Wallet';
import { Tab } from './types';

type AppState = 'splash' | 'auth' | 'main';

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  is_verified: boolean;
  is_admin: boolean;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FEED);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      fetch(`${import.meta.env.VITE_API_BASE || 'https://scamkeep-api-932863380761.asia-northeast3.run.app/api/v1'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Invalid token');
        })
        .then((user) => {
          setCurrentUser(user);
          setAppState('main');
        })
        .catch(() => {
          localStorage.removeItem('token');
          // Continue to splash screen
        });
    }
  }, []);

  const handleSplashComplete = () => {
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      setAppState('main');
    } else {
      setAppState('auth');
    }
  };

  const handleLogin = (token: string, user: CurrentUser) => {
    setCurrentUser(user);
    setAppState('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAppState('auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.FEED:
        return <Feed />;
      case Tab.REPORT:
        return <Report />;
      case Tab.QUIZ:
        return <Quiz />;
      case Tab.WALLET:
        return <Wallet />;
      default:
        return <Feed />;
    }
  };

  // Splash Screen
  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Auth Screen
  if (appState === 'auth') {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Main App
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopBar user={currentUser} onLogout={handleLogout} onWallet={() => setActiveTab(Tab.WALLET)} />
      <main className="w-full">
        {renderContent()}
      </main>
      <Navbar currentTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
