import React from 'react';

interface SocialProofStat {
  value: string;
  label: string;
}

interface SocialProofBarProps {
  stats: SocialProofStat[];
}

export const SocialProofBar: React.FC<SocialProofBarProps> = ({ stats }) => {
  return (
    <div className="py-4 md:py-6 mb-12 bg-amber-50/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_24px_rgba(245,158,11,0.1)] ring-1 ring-white/40 max-w-2xl mx-auto">
      <div className="flex flex-row items-center gap-3 md:gap-8 justify-center px-3">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="w-px h-8 md:h-9 bg-emerald-300/30"></div>
            )}
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700 leading-none">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs text-emerald-700/70 mt-1">
                {stat.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
