import React from 'react';

interface CostItem {
  metric: string;
  description: string;
}

interface CostOfDelaySectionProps {
  title: string;
  intro: string;
  callout: string;
  delayTitle: string;
  delayPeriod: string;
  costs: CostItem[];
  behavioralProof?: string;
  conclusion: string;
}

export const CostOfDelaySection: React.FC<CostOfDelaySectionProps> = ({
  title,
  intro,
  callout,
  delayTitle,
  delayPeriod,
  costs,
  behavioralProof,
  conclusion,
}) => {
  return (
    <div className="p-8 md:p-10 mb-20 bg-amber-50/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_24px_rgba(245,158,11,0.1)] ring-1 ring-white/40 max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 mb-4 text-center leading-[1.2]">
        {title}
      </h2>
      <p className="text-center text-emerald-800 mb-6 leading-[1.7]">
        {intro}
      </p>
      <p className="text-center text-emerald-800/80 mb-6 leading-[1.6]">
        {callout}
      </p>
      <div className="bg-white/70 p-6 rounded-2xl border border-emerald-200/30 mb-6 max-w-md mx-auto">
        <h3 className="font-bold text-emerald-900 mb-3 text-center">
          {delayTitle} {delayPeriod}:
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800/80">
          {costs.map((cost, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-amber-600 flex-shrink-0">•</span>
              <span>
                <strong>{cost.metric}</strong> {cost.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {behavioralProof && (
        <p className="text-center text-emerald-800 mb-6 leading-[1.7] italic">
          {behavioralProof}
        </p>
      )}
      <p className="text-center text-emerald-800/80 text-sm leading-[1.6]">
        {conclusion}
      </p>
    </div>
  );
};
