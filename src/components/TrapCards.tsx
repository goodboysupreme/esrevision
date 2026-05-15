'use client';

import { FC, useState } from 'react';
import { TRAPS, type Trap } from '@/data/traps';
import { TOPICS } from '@/data/topics';

const SEVERITY_CONFIG = {
  critical: { icon: '🚨', label: 'CRITICAL', bgColor: '#FEF2F2', borderColor: '#B91C1C', textColor: '#991B1B' },
  warning: { icon: '⚠️', label: 'WARNING', bgColor: '#FFFBEB', borderColor: '#D97706', textColor: '#92400E' },
  caution: { icon: '💡', label: 'CAUTION', bgColor: '#F0FDF4', borderColor: '#059669', textColor: '#065F46' },
};

const TrapCards: FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const uniqueTopics = Array.from(new Set(TRAPS.map(t => t.topicId)));
  const filteredTraps = selectedTopic === 'all'
    ? TRAPS
    : TRAPS.filter(t => t.topicId === selectedTopic);

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTopicInfo = (topicId: string) => TOPICS.find(t => t.id === topicId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">
          🃏 Trap Cards — Common Mistakes & Pitfalls
        </h2>
        <p className="font-ui text-sm text-muted-text mt-1">
          Flip each card to reveal the full explanation. These are the mistakes that cost marks.
        </p>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`
            font-ui text-sm px-3 py-1.5 rounded-lg border-2 transition-all
            ${selectedTopic === 'all'
              ? 'bg-navy text-cream border-navy'
              : 'bg-cream border-border-warm text-navy hover:border-navy'
            }
          `}
        >
          All ({TRAPS.length})
        </button>
        {uniqueTopics.map(topicId => {
          const topic = getTopicInfo(topicId);
          const count = TRAPS.filter(t => t.topicId === topicId).length;
          const isActive = selectedTopic === topicId;
          return (
            <button
              key={topicId}
              onClick={() => setSelectedTopic(topicId)}
              className={`
                font-ui text-sm px-3 py-1.5 rounded-lg border-2 transition-all
                ${isActive ? 'text-cream' : 'bg-cream border-border-warm text-navy hover:border-navy'}
              `}
              style={isActive ? { backgroundColor: topic?.color, borderColor: topic?.color } : {}}
            >
              {topic?.name || topicId} ({count})
            </button>
          );
        })}
      </div>

      {/* Severity Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5 font-ui text-xs">
            <span>{config.icon}</span>
            <span style={{ color: config.textColor }}>{config.label}</span>
          </div>
        ))}
      </div>

      {/* Trap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTraps.map((trap) => {
          const topic = getTopicInfo(trap.topicId);
          const severity = SEVERITY_CONFIG[trap.severity];
          const isFlipped = flippedCards.has(trap.id);

          return (
            <div
              key={trap.id}
              className="flip-card cursor-pointer"
              style={{ minHeight: '220px', perspective: '1000px' }}
              onClick={() => toggleFlip(trap.id)}
            >
              <div
                className="flip-card-inner relative w-full"
                style={{ minHeight: '220px', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front */}
                <div
                  className="flip-card-front absolute inset-0 rounded-lg p-5 flex flex-col"
                  style={{
                    backgroundColor: severity.bgColor,
                    borderWidth: '2px',
                    borderColor: severity.borderColor,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{severity.icon}</span>
                    <span
                      className="font-ui text-[10px] font-bold px-2 py-0.5 rounded text-cream"
                      style={{ backgroundColor: topic?.color || '#8B867D' }}
                    >
                      {topic?.shortName}
                    </span>
                    <span
                      className="font-ui text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: severity.borderColor, color: '#fff' }}
                    >
                      {severity.label}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-navy text-lg mt-2">{trap.title}</h3>
                  <p className="font-body text-sm text-navy mt-2 leading-relaxed flex-1">{trap.front}</p>
                  <div className="font-ui text-[10px] text-muted-text text-center mt-3">
                    Click to flip →
                  </div>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back absolute inset-0 rounded-lg p-5 flex flex-col"
                  style={{
                    backgroundColor: '#FCFBF8',
                    borderWidth: '2px',
                    borderColor: topic?.color || '#D1CCC1',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-ui text-[10px] font-bold px-2 py-0.5 rounded text-cream"
                      style={{ backgroundColor: topic?.color || '#8B867D' }}
                    >
                      {topic?.shortName}
                    </span>
                    <span className="font-ui text-xs font-semibold text-navy">Full Explanation</span>
                  </div>
                  <h3 className="font-heading font-bold text-navy mb-2">{trap.title}</h3>
                  <p className="font-body text-sm text-navy leading-relaxed flex-1">{trap.back}</p>
                  <div className="font-ui text-[10px] text-muted-text text-center mt-3">
                    ← Click to flip back
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrapCards;
