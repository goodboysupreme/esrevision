'use client';

import { FC, useState, useMemo } from 'react';
import { TOPICS, YIELD_COLORS } from '@/data/topics';
import { QUESTIONS, type Question, type YieldLevel, type Difficulty, type SolutionStep } from '@/data/questions';
import TopicChart from './TopicChart';
import CircuitDiagram from './CircuitDiagram';

interface PyqVaultProps {
  onNavigate: (tabId: string) => void;
}

const ITEMS_PER_PAGE = 6;

const TOPIC_COLORS: Record<string, { main: string; bg: string }> = {
  bjt: { main: '#2563eb', bg: '#dbeafe' },
  diodes: { main: '#d97706', bg: '#fef3c7' },
  ac3phase: { main: '#0d9488', bg: '#ccfbf1' },
  dc: { main: '#059669', bg: '#d1fae5' },
  mosfet: { main: '#7c3aed', bg: '#ede9fe' },
  opamps: { main: '#4338ca', bg: '#eef2ff' },
  filters: { main: '#be185d', bg: '#fce7f3' },
  transients: { main: '#64748b', bg: '#f1f5f9' },
  semiconductors: { main: '#92400e', bg: '#fffbeb' },
  transformers: { main: '#78716c', bg: '#f5f5f4' },
  machines: { main: '#a3a3a3', bg: '#fafafa' },
};

const PyqVault: FC<PyqVaultProps> = ({ onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedYield, setSelectedYield] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const includedTopics = TOPICS.filter(t => t.category !== 'excluded');

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (selectedYear !== 'all' && q.exam !== selectedYear) return false;
      if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
      if (selectedYield !== 'all' && q.yieldLevel !== selectedYield) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase()) && !q.subtopic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedYear, selectedTopic, selectedYield, selectedDifficulty, searchQuery]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTopicColor = (topicId: string) => {
    return TOPIC_COLORS[topicId]?.main || TOPICS.find(t => t.id === topicId)?.color || '#8B867D';
  };

  const getTopicBgColor = (topicId: string) => {
    return TOPIC_COLORS[topicId]?.bg || TOPICS.find(t => t.id === topicId)?.bgColor || '#F8FAFC';
  };

  const getYieldBadge = (level: YieldLevel) => {
    const colors: Record<YieldLevel, string> = YIELD_COLORS;
    const labels: Record<YieldLevel, string> = { high: 'High', mid: 'Mid', low: 'Low' };
    return (
      <span
        className="font-ui text-[10px] font-bold px-2 py-0.5 rounded-full text-cream"
        style={{ backgroundColor: colors[level] }}
      >
        {labels[level]}
      </span>
    );
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    const config: Record<Difficulty, { color: string; label: string }> = {
      easy: { color: '#059669', label: 'Easy' },
      medium: { color: '#d97706', label: 'Medium' },
      hard: { color: '#B91C1C', label: 'Hard' },
    };
    return (
      <span
        className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full border"
        style={{ borderColor: config[diff].color, color: config[diff].color }}
      >
        {config[diff].label}
      </span>
    );
  };

  const isExcluded = (topicId: string) => {
    const topic = TOPICS.find(t => t.id === topicId);
    return topic?.category === 'excluded';
  };

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-cream border-[3px] border-navy rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-navy mb-2">
          📊 Topic-wise Marks Distribution
        </h2>
        <p className="font-ui text-sm text-muted-text mb-4">
          Interactive chart: hover for exact marks per topic per year. Excluded topics shown in grey.
        </p>
        <TopicChart showExcluded={false} height={380} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-cream border border-border-warm rounded-lg p-4 space-y-4 sticky top-32">
            <h3 className="font-heading font-bold text-navy text-sm uppercase tracking-wider">Filters</h3>

            {/* Search */}
            <div>
              <label className="font-ui text-xs text-muted-text block mb-1">Search</label>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-parchment border border-border-warm rounded px-3 py-1.5 font-ui text-sm text-navy focus:outline-none focus:border-navy"
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="font-ui text-xs text-muted-text block mb-1">Exam Year</label>
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                className="w-full bg-parchment border border-border-warm rounded px-3 py-1.5 font-ui text-sm text-navy focus:outline-none focus:border-navy"
              >
                <option value="all">All Years</option>
                <option value="Dec 2023">Dec 2023</option>
                <option value="May 2024">May 2024</option>
                <option value="Dec 2024">Dec 2024</option>
                <option value="May 2025">May 2025</option>
                <option value="Dec 2025">Dec 2025</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="font-ui text-xs text-muted-text block mb-1">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1); }}
                className="w-full bg-parchment border border-border-warm rounded px-3 py-1.5 font-ui text-sm text-navy focus:outline-none focus:border-navy"
              >
                <option value="all">All Topics</option>
                {includedTopics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Yield Filter */}
            <div>
              <label className="font-ui text-xs text-muted-text block mb-1">Yield</label>
              <select
                value={selectedYield}
                onChange={(e) => { setSelectedYield(e.target.value); setCurrentPage(1); }}
                className="w-full bg-parchment border border-border-warm rounded px-3 py-1.5 font-ui text-sm text-navy focus:outline-none focus:border-navy"
              >
                <option value="all">All Yields</option>
                <option value="high">High Yield</option>
                <option value="mid">Mid Yield</option>
                <option value="low">Low Yield</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="font-ui text-xs text-muted-text block mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
                className="w-full bg-parchment border border-border-warm rounded px-3 py-1.5 font-ui text-sm text-navy focus:outline-none focus:border-navy"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="pt-2 border-t border-border-warm">
              <div className="font-ui text-xs text-muted-text">
                {filteredQuestions.length} of {QUESTIONS.length} questions
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedTopic('all');
                setSelectedYield('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="w-full font-ui text-xs text-navy underline hover:no-underline"
            >
              Reset all filters
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 space-y-4">
          {paginatedQuestions.length === 0 && (
            <div className="bg-cream border border-border-warm rounded-lg p-8 text-center font-ui text-muted-text">
              No questions match your filters. Try adjusting them.
            </div>
          )}
          {paginatedQuestions.map((q) => {
            const excluded = isExcluded(q.topicId);
            const topicColor = getTopicColor(q.topicId);
            const topicBgColor = getTopicBgColor(q.topicId);
            return (
              <div
                key={q.id}
                className={`bg-cream rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${excluded ? 'opacity-50' : ''}`}
                style={{ borderLeft: `4px solid ${topicColor}` }}
              >
                {/* Question Header */}
                <button
                  className="w-full text-left p-4 flex gap-3"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-ui text-[10px] font-semibold text-muted-text">
                        {q.exam} · {q.questionNumber}
                      </span>
                      <span
                        className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full text-cream"
                        style={{ backgroundColor: topicColor }}
                      >
                        {q.subtopic}
                      </span>
                      {getYieldBadge(q.yieldLevel)}
                      {getDifficultyBadge(q.difficulty)}
                      {excluded && (
                        <span className="font-ui text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-400 text-white">
                          EXCLUDED
                        </span>
                      )}
                      <span className="font-ui text-[10px] font-bold text-navy ml-auto">
                        {q.marks} marks
                      </span>
                    </div>
                    <p className="font-body text-sm text-navy leading-relaxed line-clamp-2">
                      {q.text}
                    </p>
                  </div>
                  <div className="shrink-0 self-center text-muted-text">
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedId === q.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Solution — Circuit Left + Steps Right */}
                {expandedId === q.id && (
                  <div className="px-4 pb-4">
                    {/* Excluded warning */}
                    {excluded && (
                      <div className="mb-3 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg font-ui text-sm text-gray-600 font-semibold">
                        🚫 This topic is EXCLUDED from the upcoming exam (Magnetic Circuits & Transformers). Skip this question.
                      </div>
                    )}

                    {/* Two-column layout: Circuit Left (40%) + Steps Right (56%) */}
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* LEFT: Circuit Diagram Panel */}
                      <div className="md:w-[40%] shrink-0">
                        {q.circuitSvg ? (
                          <CircuitDiagram
                            circuit={q.circuitSvg}
                            topicColor={topicColor}
                            topicBgColor={topicBgColor}
                          />
                        ) : q.circuitDescription ? (
                          <div
                            className="rounded-lg p-4 border h-full"
                            style={{ backgroundColor: topicBgColor, borderColor: topicColor + '40' }}
                          >
                            <div className="font-ui text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: topicColor }}>
                              🔌 Circuit Description
                            </div>
                            <p className="font-body text-sm text-navy leading-relaxed">{q.circuitDescription}</p>
                          </div>
                        ) : (
                          <div
                            className="rounded-lg p-4 border h-full flex items-center justify-center"
                            style={{ backgroundColor: topicBgColor, borderColor: topicColor + '40' }}
                          >
                            <div className="text-center">
                              <div className="font-ui text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: topicColor }}>
                                📐 Conceptual
                              </div>
                              <p className="font-body text-xs text-muted-text">No circuit diagram needed for this question</p>
                            </div>
                          </div>
                        )}

                        {/* Key Trap Warning — below circuit */}
                        {q.keyTrap && (
                          <div className="mt-3 p-3 rounded-lg border-2 border-red-200 bg-red-50">
                            <div className="font-ui text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
                              🚨 Common Trap
                            </div>
                            <p className="font-ui text-sm text-red-800 leading-relaxed">{q.keyTrap}</p>
                          </div>
                        )}
                      </div>

                      {/* RIGHT: Step-by-Step Solution (56%) */}
                      <div className="md:w-[56%] min-w-0">
                        {q.detailedSteps && q.detailedSteps.length > 0 ? (
                          <div className="space-y-2">
                            <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-2">
                              📝 Step-by-Step Solution
                            </div>
                            {q.detailedSteps.map((step: SolutionStep) => (
                              <StepCard key={step.stepNumber} step={step} topicColor={topicColor} />
                            ))}
                          </div>
                        ) : q.solution ? (
                          <div className="bg-parchment border border-border-warm rounded-lg p-4">
                            <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-2">
                              Solution Method
                            </div>
                            <p className="font-body text-sm text-navy leading-relaxed whitespace-pre-line">
                              {q.solution}
                            </p>
                          </div>
                        ) : null}

                        {/* Final Answers — highlighted box */}
                        {q.finalAnswers && q.finalAnswers.length > 0 && (
                          <div className="mt-3 p-3 rounded-lg border-2" style={{ backgroundColor: '#ecfdf5', borderColor: '#6ee7b7' }}>
                            <div className="font-ui text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#059669' }}>
                              ✅ Final Answers
                            </div>
                            <div className="space-y-1">
                              {q.finalAnswers.map((ans, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="font-ui text-xs mt-0.5" style={{ color: '#059669' }}>▸</span>
                                  <code className="font-mono text-sm font-bold" style={{ color: '#065f46' }}>{ans}</code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="font-ui text-sm px-3 py-1.5 rounded border border-border-warm bg-cream text-navy disabled:opacity-40 hover:bg-secondary transition-colors"
              >
                ← Prev
              </button>
              <span className="font-ui text-sm text-muted-text">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="font-ui text-sm px-3 py-1.5 rounded border border-border-warm bg-cream text-navy disabled:opacity-40 hover:bg-secondary transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: SolutionStep;
  topicColor: string;
}

const StepCard: FC<StepCardProps> = ({ step, topicColor }) => {
  const getStepStyle = () => {
    if (step.isVerification) return { bg: '#f0fdf4', border: '#86efac', badge: '✓', badgeBg: '#059669', label: 'Verify' };
    if (step.isAnswer) return { bg: '#ecfdf5', border: '#6ee7b7', badge: '★', badgeBg: '#059669', label: 'Answer' };
    if (step.isWarning) return { bg: '#fef2f2', border: '#fca5a5', badge: '⚠', badgeBg: '#dc2626', label: 'Watch' };
    return { bg: '#fafaf9', border: '#e7e5e4', badge: String(step.stepNumber), badgeBg: topicColor, label: `Step ${step.stepNumber}` };
  };

  const style = getStepStyle();

  return (
    <div className="flex gap-2">
      {/* Step number badge */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-ui text-[10px] font-bold text-white"
          style={{ backgroundColor: style.badgeBg }}
        >
          {style.badge}
        </div>
      </div>

      {/* Step content */}
      <div
        className="flex-1 rounded-lg p-2.5 border-l-[3px]"
        style={{ backgroundColor: style.bg, borderLeftColor: style.badgeBg }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-ui text-[11px] font-semibold text-navy">{step.label}</span>
          {step.isVerification && (
            <span className="font-ui text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              VERIFY
            </span>
          )}
          {step.isWarning && (
            <span className="font-ui text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
              TRAP
            </span>
          )}
          {step.isAnswer && (
            <span className="font-ui text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
              ANSWER
            </span>
          )}
        </div>
        {step.calculation && (
          <div className="font-mono text-[11px] text-muted-text leading-relaxed mb-0.5 whitespace-pre-line">
            {step.calculation}
          </div>
        )}
        <div className={`font-mono text-[12px] leading-relaxed ${step.isAnswer ? 'font-bold text-emerald-800' : step.isWarning ? 'text-red-800 font-semibold' : 'text-navy'}`}>
          {step.result}
        </div>
      </div>
    </div>
  );
};

export default PyqVault;
