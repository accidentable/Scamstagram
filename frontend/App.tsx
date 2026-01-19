import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TopBar } from './components/TopBar';
import { Feed } from './components/Feed';
import { Scanner } from './components/Scanner';
import { Wallet } from './components/Wallet';
import { Tab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FEED);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.FEED:
        return <Feed />;
      case Tab.SCAN:
        return <Scanner />;
      case Tab.WALLET:
        return <Wallet />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopBar />
      <main className="w-full">
        {renderContent()}
      </main>
      <Navbar currentTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}