'use client';

import { FC } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  shortLabel: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TABS: Tab[] = [
  { id: 'warroom', label: 'War Room', icon: '⚔️', shortLabel: 'War Room' },
  { id: 'pyqvault', label: 'PYQ Vault', icon: '🏛️', shortLabel: 'PYQ Vault' },
  { id: 'cheatsheet', label: 'Cheat Sheet', icon: '📋', shortLabel: 'Cheat Sheet' },
  { id: 'methods', label: 'Method Maps', icon: '🗺️', shortLabel: 'Methods' },
  { id: 'circuits', label: 'Circuit Atlas', icon: '🔌', shortLabel: 'Circuits' },
  { id: 'traps', label: 'Trap Cards', icon: '🃏', shortLabel: 'Traps' },
];

const TabNavigation: FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-cream border-b-[3px] border-navy sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-heading text-navy tracking-tight">
              EEE F111
            </span>
            <span className="hidden sm:inline text-muted-text font-ui text-sm">
              Electrical Sciences · Comp Exam
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-ui text-muted-text bg-secondary/60 px-2.5 py-1 rounded">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="font-semibold text-navy">135 marks</span>
            <span>·</span>
            <span>3 hrs</span>
            <span>·</span>
            <span>Closed Book</span>
          </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-0.5 px-2 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-t text-sm font-ui font-medium
                transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-navy text-cream shadow-sm'
                  : 'text-muted-text hover:bg-secondary hover:text-navy'
                }
              `}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
