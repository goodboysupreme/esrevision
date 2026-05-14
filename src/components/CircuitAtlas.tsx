'use client';

import { FC, useState } from 'react';
import { CIRCUITS, type CircuitTopology } from '@/data/circuits';
import { TOPICS } from '@/data/topics';

const CircuitAtlas: FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const uniqueTopics = Array.from(new Set(CIRCUITS.map(c => c.topicId)));
  const filteredCircuits = selectedTopic === 'all'
    ? CIRCUITS
    : CIRCUITS.filter(c => c.topicId === selectedTopic);

  const getTopicInfo = (topicId: string) => TOPICS.find(t => t.id === topicId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">
          🔌 Circuit Atlas — Standard Topologies
        </h2>
        <p className="font-ui text-sm text-muted-text mt-1">
          Gallery of circuit configurations organized by topic. Know these by sight.
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
          All Topics
        </button>
        {uniqueTopics.map(topicId => {
          const topic = getTopicInfo(topicId);
          const isActive = selectedTopic === topicId;
          return (
            <button
              key={topicId}
              onClick={() => setSelectedTopic(topicId)}
              className={`
                font-ui text-sm px-3 py-1.5 rounded-lg border-2 transition-all
                ${isActive
                  ? 'text-cream'
                  : 'bg-cream border-border-warm text-navy hover:border-navy'
                }
              `}
              style={isActive ? { backgroundColor: topic?.color, borderColor: topic?.color } : {}}
            >
              {topic?.name || topicId}
            </button>
          );
        })}
      </div>

      {/* Circuit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCircuits.map((circuit) => {
          const topic = getTopicInfo(circuit.topicId);
          const isExpanded = expandedCard === circuit.id;

          return (
            <div
              key={circuit.id}
              className="bg-cream border-l-4 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ borderLeftColor: topic?.color || '#8B867D' }}
              onClick={() => setExpandedCard(isExpanded ? null : circuit.id)}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-ui text-[10px] font-bold px-2 py-0.5 rounded text-cream"
                    style={{ backgroundColor: topic?.color || '#8B867D' }}
                  >
                    {topic?.shortName}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-navy text-lg">{circuit.name}</h3>

                {/* Key Features */}
                <div className="mt-3 space-y-1.5">
                  <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider">
                    Key Features
                  </div>
                  {circuit.keyFeatures.slice(0, isExpanded ? undefined : 2).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-ui text-xs text-muted-text mt-0.5">•</span>
                      <span className="font-body text-xs text-navy">{f}</span>
                    </div>
                  ))}
                </div>

                {isExpanded && (
                  <>
                    {/* Identifying Clues */}
                    <div className="mt-4 space-y-1.5">
                      <div className="font-ui text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        🔍 How to Identify
                      </div>
                      {circuit.identifyingClues.map((c, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="font-ui text-xs text-amber-600 mt-0.5">→</span>
                          <span className="font-body text-xs text-navy">{c}</span>
                        </div>
                      ))}
                    </div>

                    {/* Common Questions */}
                    <div className="mt-4 space-y-1.5">
                      <div className="font-ui text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        ❓ Common Exam Questions
                      </div>
                      {circuit.commonQuestions.map((q, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="font-ui text-xs text-emerald-600 mt-0.5">Q:</span>
                          <span className="font-body text-xs text-navy">{q}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-3 font-ui text-[10px] text-muted-text text-center">
                  {isExpanded ? 'Click to collapse' : 'Click to expand'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircuitAtlas;
