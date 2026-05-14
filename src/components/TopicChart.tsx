'use client';

import { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TOPIC_MARKS_BY_YEAR, EXAM_YEARS, type ExamYear } from '@/data/topics';

interface TopicChartProps {
  showExcluded?: boolean;
  height?: number;
}

const YEAR_COLORS: Record<ExamYear, string> = {
  'Dec 2023': '#8B4513',
  'May 2024': '#2563eb',
  'Dec 2024': '#059669',
  'May 2025': '#d97706',
  'Dec 2025': '#be185d',
};

const EXCLUDED_TOPICS = ['Transf/Mag', 'Machines'];

const TOPIC_LABELS: Record<string, string> = {
  'BJT': 'BJT',
  'Diodes': 'Diodes',
  'AC/3-Phase': 'AC/3Φ',
  'DC/Theorems': 'DC/Thev',
  'MOSFET/FET': 'MOSFET',
  'Op-Amps': 'Op-Amp',
  'Filters/Res': 'Filters',
  'Transients': 'Transients',
  'Transf/Mag': 'Transf/Mag ⚠️',
  'Machines': 'Machines ⚠️',
  'Semiconductors': 'Semi',
};

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (active && payload && payload.length) {
    const isExcluded = EXCLUDED_TOPICS.includes(label || '');
    return (
      <div className="bg-cream border border-border-warm rounded-lg p-3 shadow-lg font-ui text-sm">
        <p className="font-bold text-navy mb-1">
          {TOPIC_LABELS[label || ''] || label}
          {isExcluded && <span className="ml-2 text-xs text-red-600 font-semibold">EXCLUDED</span>}
        </p>
        {payload.map((entry, idx) => (
          <p key={idx} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-text">{entry.name}:</span>
            <span className="font-semibold text-navy">{entry.value} marks</span>
          </p>
        ))}
        <p className="border-t border-border-warm mt-1 pt-1 font-bold text-navy">
          Total: {payload.reduce((s, e) => s + e.value, 0)} marks
        </p>
      </div>
    );
  }
  return null;
}

const TopicChart: FC<TopicChartProps> = ({ showExcluded = true, height = 420 }) => {
  const topics = Object.keys(TOPIC_MARKS_BY_YEAR);
  const filteredTopics = showExcluded ? topics : topics.filter(t => !EXCLUDED_TOPICS.includes(t));

  const data = filteredTopics.map((topic) => {
    const entry: Record<string, string | number> = { topic };
    EXAM_YEARS.forEach((year) => {
      entry[year] = TOPIC_MARKS_BY_YEAR[topic][year];
    });
    const total = EXAM_YEARS.reduce((sum, yr) => sum + TOPIC_MARKS_BY_YEAR[topic][yr], 0);
    entry['total'] = total;
    return entry;
  });

  // Sort by total marks descending
  data.sort((a, b) => (b['total'] as number) - (a['total'] as number));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
          barCategoryGap="20%"
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#D1CCC1" opacity={0.5} />
          <XAxis
            dataKey="topic"
            tickFormatter={(value: string) => TOPIC_LABELS[value] || value}
            tick={{ fontSize: 11, fontFamily: 'var(--font-ui)', fill: '#8B867D' }}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'var(--font-ui)', fill: '#8B867D' }}
            label={{
              value: 'Marks',
              angle: -90,
              position: 'insideLeft',
              style: { fontFamily: 'var(--font-ui)', fill: '#8B867D', fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: 'var(--font-ui)', fontSize: 12 }}
            iconType="square"
            iconSize={12}
          />
          {EXAM_YEARS.map((year) => (
            <Bar
              key={year}
              dataKey={year}
              name={year}
              fill={YEAR_COLORS[year]}
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
            >
              {data.map((entry, index) => {
                const isExcluded = EXCLUDED_TOPICS.includes(entry.topic as string);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isExcluded ? '#D1CCC1' : YEAR_COLORS[year]}
                    opacity={isExcluded ? 0.5 : 1}
                  />
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      {showExcluded && (
        <div className="flex items-center justify-center gap-2 mt-2 font-ui text-xs text-muted-text">
          <span className="inline-block w-4 h-3 bg-[#D1CCC1] rounded-sm opacity-50" />
          <span>⚠️ Excluded topics shown in grey (Transformers/Magnetic & Machines NOT in upcoming exam)</span>
        </div>
      )}
    </div>
  );
};

export default TopicChart;
