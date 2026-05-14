'use client';

import { FC, useState, useMemo } from 'react';
import { TOPICS, YIELD_COLORS } from '@/data/topics';
import { QUESTIONS, type Question, type YieldLevel, type Difficulty } from '@/data/questions';
import TopicChart from './TopicChart';

interface PyqVaultProps {
  onNavigate: (tabId: string) => void;
}

const ITEMS_PER_PAGE = 12;

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
    return TOPICS.find(t => t.id === topicId)?.color || '#8B867D';
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

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-cream border-[3px] border-navy rounded-lg p-6 shadow-sm">
        <h2 className="font-heading text-2xl font-bold text-navy mb-2">
          📊 Topic-wise Marks Distribution
        </h2>
        <p className="font-ui text-sm text-muted-text mb-4">
          Interactive chart: hover for exact marks per topic per year
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
        <div className="flex-1 space-y-3">
          {paginatedQuestions.length === 0 && (
            <div className="bg-cream border border-border-warm rounded-lg p-8 text-center font-ui text-muted-text">
              No questions match your filters. Try adjusting them.
            </div>
          )}
          {paginatedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-cream border border-border-warm rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Question Header */}
              <button
                className="w-full text-left p-4 flex gap-3"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <div
                  className="w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: getTopicColor(q.topicId) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-ui text-[10px] font-semibold text-muted-text">
                      {q.exam} · {q.questionNumber}
                    </span>
                    <span
                      className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full text-cream"
                      style={{ backgroundColor: getTopicColor(q.topicId) }}
                    >
                      {q.subtopic}
                    </span>
                    {getYieldBadge(q.yieldLevel)}
                    {getDifficultyBadge(q.difficulty)}
                    <span className="font-ui text-[10px] font-bold text-navy ml-auto">
                      {q.marks} marks
                    </span>
                  </div>
                  <p className="font-body text-sm text-navy leading-relaxed">
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

              {/* Expanded Solution */}
              {expandedId === q.id && q.solution && (
                <div className="px-4 pb-4 pl-8">
                  <div className="bg-parchment border border-border-warm rounded-lg p-4">
                    <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-2">
                      Solution Method
                    </div>
                    <p className="font-body text-sm text-navy leading-relaxed whitespace-pre-line">
                      {q.solution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

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

export default PyqVault;
