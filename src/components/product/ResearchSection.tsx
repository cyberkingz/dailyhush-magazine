import React from 'react';

interface ResearchItem {
  title: string;
  institution: string;
  description: string;
}

interface ResearchSectionProps {
  title: string;
  subtitle: string;
  items: ResearchItem[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <div className="p-8 md:p-10 mb-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 mb-6 text-center leading-[1.2]">
        {title}
      </h2>
      <p className="text-center text-emerald-700/80 mb-10 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/30">
            <h3 className="font-bold text-emerald-900 mb-2">{item.title}</h3>
            <p className="text-sm text-emerald-700/70 mb-3">{item.institution}</p>
            <p className="text-sm text-emerald-800/80 leading-[1.6]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
