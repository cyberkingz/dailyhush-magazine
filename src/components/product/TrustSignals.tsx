import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TrustSignal {
  icon: LucideIcon;
  text: string;
}

interface TrustSignalsProps {
  signals: TrustSignal[];
}

export const TrustSignals: React.FC<TrustSignalsProps> = ({ signals }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {signals.map((signal, index) => {
        const Icon = signal.icon;
        return (
          <div key={index} className="flex flex-col items-center text-center gap-2 text-sm text-emerald-700/80">
            <Icon className="w-5 h-5 text-amber-600" />
            <span>{signal.text}</span>
          </div>
        );
      })}
    </div>
  );
};
