'use client';

import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import WarRoom from '@/components/WarRoom';
import PyqVault from '@/components/PyqVault';
import CheatSheet from '@/components/CheatSheet';
import MethodMaps from '@/components/MethodMaps';
import CircuitAtlas from '@/components/CircuitAtlas';
import TrapCards from '@/components/TrapCards';

export default function Home() {
  const [activeTab, setActiveTab] = useState('warroom');

  const renderTab = () => {
    switch (activeTab) {
      case 'warroom':
        return <WarRoom onNavigate={setActiveTab} />;
      case 'pyqvault':
        return <PyqVault onNavigate={setActiveTab} />;
      case 'cheatsheet':
        return <CheatSheet />;
      case 'methods':
        return <MethodMaps />;
      case 'circuits':
        return <CircuitAtlas />;
      case 'traps':
        return <TrapCards />;
      default:
        return <WarRoom onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTab()}
      </main>
      <footer className="mt-12 border-t border-border-warm bg-cream py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-ui text-xs text-muted-text">
            EEE F111 Electrical Sciences · BITS Pilani · Comprehensive Exam Prep
          </div>
          <div className="font-ui text-xs text-muted-text">
            Based on analysis of 5 comprehensive exams (Dec 2023 – Dec 2025)
          </div>
        </div>
      </footer>
    </div>
  );
}
