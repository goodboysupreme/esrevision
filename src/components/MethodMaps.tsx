'use client';

import { FC, useState } from 'react';
import { METHODS, type MethodMap, type MethodStep } from '@/data/methods';
import { TOPICS } from '@/data/topics';

const MethodMaps: FC = () => {
  const [activeMethod, setActiveMethod] = useState<string>(METHODS[0].id);

  const currentMethod = METHODS.find(m => m.id === activeMethod)!;
  const topicInfo = TOPICS.find(t => t.id === currentMethod.topicId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">
          🗺️ Method Maps — Step-by-Step Procedures
        </h2>
        <p className="font-ui text-sm text-muted-text mt-1">
          Systematic algorithms for each analysis type. Follow the steps in order.
        </p>
      </div>

      {/* Method Selector */}
      <div className="flex flex-wrap gap-2">
        {METHODS.map((method) => {
          const mTopic = TOPICS.find(t => t.id === method.topicId);
          const isActive = activeMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`
                font-ui text-sm px-4 py-2 rounded-lg border-2 transition-all
                ${isActive
                  ? 'text-cream shadow-md'
                  : 'bg-cream border-border-warm text-navy hover:border-navy'
                }
              `}
              style={isActive ? { backgroundColor: mTopic?.color || '#1A2A3A', borderColor: mTopic?.color || '#1A2A3A' } : {}}
            >
              {method.title}
            </button>
          );
        })}
      </div>

      {/* Active Method Display */}
      <div className="bg-cream border-2 rounded-lg overflow-hidden" style={{ borderColor: topicInfo?.color || '#D1CCC1' }}>
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: topicInfo?.color || '#D1CCC1', backgroundColor: `${topicInfo?.color}10` }}>
          <div className="flex items-center gap-3">
            <span
              className="font-ui text-xs font-bold px-2 py-1 rounded text-cream"
              style={{ backgroundColor: topicInfo?.color || '#8B867D' }}
            >
              {topicInfo?.shortName}
            </span>
            <h3 className="font-heading text-xl font-bold text-navy">{currentMethod.title}</h3>
          </div>
          <p className="font-ui text-sm text-muted-text mt-2">{currentMethod.description}</p>
        </div>

        {/* Steps Flow */}
        <div className="p-5 space-y-0">
          {currentMethod.steps.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              index={idx}
              isLast={idx === currentMethod.steps.length - 1}
              color={topicInfo?.color || '#8B867D'}
            />
          ))}
        </div>

        {/* Tips */}
        <div className="p-5 border-t" style={{ borderColor: topicInfo?.color || '#D1CCC1' }}>
          <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-3">
            💡 Pro Tips
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentMethod.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 bg-parchment rounded-lg p-3">
                <span className="font-ui text-xs text-amber-600 mt-0.5">⚡</span>
                <span className="font-ui text-sm text-navy">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: MethodStep;
  index: number;
  isLast: boolean;
  color: string;
}

const StepCard: FC<StepCardProps> = ({ step, index, isLast, color }) => {
  return (
    <div className="flex gap-4">
      {/* Left: Step number + connector */}
      <div className="flex flex-col items-center">
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center font-ui text-sm font-bold shrink-0
            ${step.isCheck ? 'ring-2 ring-offset-1' : ''}
            ${step.isError ? 'ring-2 ring-offset-1 ring-red-400' : ''}
          `}
          style={{
            backgroundColor: step.isCheck ? '#059669' : step.isError ? '#B91C1C' : color,
            color: '#FCFBF8',
            ringColor: step.isCheck ? '#059669' : undefined,
          }}
        >
          {step.isCheck ? '✓' : step.isError ? '!' : index + 1}
        </div>
        {!isLast && (
          <div className="w-0.5 h-8 bg-border-warm" />
        )}
      </div>

      {/* Right: Step content */}
      <div className={`flex-1 pb-4 ${isLast ? '' : ''}`}>
        <div
          className={`
            bg-parchment rounded-lg p-3 border
            ${step.isCheck ? 'border-emerald-300 bg-emerald-50/50' : ''}
            ${step.isError ? 'border-red-300 bg-red-50/50' : ''}
          `}
        >
          <div className="font-ui text-sm font-semibold text-navy">{step.text}</div>
          <div className="font-body text-xs text-muted-text mt-1 leading-relaxed">{step.detail}</div>
          {step.isCheck && (
            <div className="font-ui text-[10px] font-bold text-emerald-700 mt-2 uppercase tracking-wider">
              ⚡ Verification Step — Do Not Skip!
            </div>
          )}
          {step.isError && (
            <div className="font-ui text-[10px] font-bold text-red-700 mt-2 uppercase tracking-wider">
              ⚠️ Fallback — If Verification Fails
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MethodMaps;
