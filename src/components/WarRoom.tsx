'use client';

import { FC } from 'react';
import TopicChart from './TopicChart';
import { TOPICS, YIELD_COLORS } from '@/data/topics';

interface WarRoomProps {
  onNavigate: (tabId: string) => void;
}

const WarRoom: FC<WarRoomProps> = ({ onNavigate }) => {
  const includedTopics = TOPICS.filter(t => t.category !== 'excluded');
  const postMidsem = includedTopics.filter(t => t.category === 'post-midsem');
  const preMidsemExtra = includedTopics.filter(t => t.category === 'pre-midsem-extra');
  const preMidsemCore = includedTopics.filter(t => t.category === 'pre-midsem-core');

  const triageOrder = [
    ...postMidsem.sort((a, b) => b.totalMarks - a.totalMarks),
    ...preMidsemExtra.sort((a, b) => b.totalMarks - a.totalMarks),
    ...preMidsemCore.sort((a, b) => b.totalMarks - a.totalMarks),
  ];

  return (
    <div className="space-y-8">
      {/* Exam Pattern Summary */}
      <div className="bg-cream border-[3px] border-navy rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-navy mb-4">
          📋 Exam Pattern Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-parchment rounded-lg p-4 text-center">
            <div className="font-ui text-3xl font-bold text-navy">135</div>
            <div className="font-ui text-xs text-muted-text mt-1">Total Marks</div>
          </div>
          <div className="bg-parchment rounded-lg p-4 text-center">
            <div className="font-ui text-3xl font-bold text-navy">3</div>
            <div className="font-ui text-xs text-muted-text mt-1">Hours</div>
          </div>
          <div className="bg-parchment rounded-lg p-4 text-center">
            <div className="font-ui text-3xl font-bold text-red-700">Closed</div>
            <div className="font-ui text-xs text-muted-text mt-1">Book Exam</div>
          </div>
          <div className="bg-parchment rounded-lg p-4 text-center">
            <div className="font-ui text-3xl font-bold text-navy">✓</div>
            <div className="font-ui text-xs text-muted-text mt-1">Equations Provided</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg font-ui text-sm">
          <span className="font-semibold text-amber-800">⚡ Key Insight:</span>
          <span className="text-amber-900 ml-1">Equations are provided in QP → Focus on METHOD + APPLICATION, not memorization!</span>
        </div>
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg font-ui text-sm">
          <span className="font-semibold text-red-800">🚫 EXCLUDED:</span>
          <span className="text-red-900 ml-1">Magnetic Circuits & Transformers (but they appear in older papers — don&apos;t get confused!)</span>
        </div>
      </div>

      {/* Topic Heat Map Chart */}
      <div className="bg-cream border border-border-warm rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-navy mb-2">
          🔥 Topic Heat Map — Marks Distribution
        </h2>
        <p className="font-ui text-sm text-muted-text mb-4">
          Grouped bar chart showing marks per topic across 5 comprehensive exams (Dec 2023 – Dec 2025)
        </p>
        <TopicChart showExcluded={true} height={450} />
      </div>

      {/* 48hr Triage */}
      <div className="bg-cream border-[3px] border-navy rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-navy mb-2">
          ⚔️ 48-Hour Triage — Priority Order
        </h2>
        <p className="font-ui text-sm text-muted-text mb-4">
          Higher weightage: Post-midsem topics. Among pre-midsem: emphasis on topics NOT in midsem (Transients, Filters).
        </p>

        <div className="space-y-3">
          {triageOrder.map((topic, idx) => (
            <div
              key={topic.id}
              className="flex items-center gap-3 bg-parchment rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div
                className="font-ui text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center text-cream"
                style={{ backgroundColor: topic.color }}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-bold text-navy">{topic.name}</span>
                  <span
                    className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full text-cream"
                    style={{ backgroundColor: topic.category === 'post-midsem' ? '#059669' : topic.category === 'pre-midsem-extra' ? '#d97706' : '#64748b' }}
                  >
                    {topic.categoryLabel}
                  </span>
                  <span
                    className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full text-cream"
                    style={{ backgroundColor: YIELD_COLORS[topic.yieldLevel] }}
                  >
                    {topic.yieldLabel}
                  </span>
                </div>
                <div className="font-ui text-xs text-muted-text mt-0.5">
                  {topic.examsAppeared}/5 exams · {topic.totalMarks} total marks
                </div>
              </div>
              <div
                className="w-20 h-3 rounded-full overflow-hidden bg-secondary"
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((topic.totalMarks / 101) * 100, 100)}%`,
                    backgroundColor: topic.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('pyqvault')}
          className="bg-cream border-2 border-border-warm rounded-lg p-5 text-left hover:border-navy hover:shadow-md transition-all group"
        >
          <div className="font-heading text-lg font-bold text-navy group-hover:underline">🏛️ PYQ Vault</div>
          <div className="font-ui text-sm text-muted-text mt-1">Browse 50+ questions with solutions</div>
        </button>
        <button
          onClick={() => onNavigate('cheatsheet')}
          className="bg-cream border-2 border-border-warm rounded-lg p-5 text-left hover:border-navy hover:shadow-md transition-all group"
        >
          <div className="font-heading text-lg font-bold text-navy group-hover:underline">📋 Cheat Sheet</div>
          <div className="font-ui text-sm text-muted-text mt-1">All formulas in one place, color-coded</div>
        </button>
        <button
          onClick={() => onNavigate('methods')}
          className="bg-cream border-2 border-border-warm rounded-lg p-5 text-left hover:border-navy hover:shadow-md transition-all group"
        >
          <div className="font-heading text-lg font-bold text-navy group-hover:underline">🗺️ Method Maps</div>
          <div className="font-ui text-sm text-muted-text mt-1">Step-by-step analysis procedures</div>
        </button>
      </div>
    </div>
  );
};

export default WarRoom;
