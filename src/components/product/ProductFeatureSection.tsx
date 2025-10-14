import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FeatureItem {
  text: string;
}

interface ProductFeatureSectionProps {
  title: string;
  description: string;
  subdescription?: string;
  features: FeatureItem[];
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  testimonial?: {
    text: string;
    author: string;
  };
}

export const ProductFeatureSection: React.FC<ProductFeatureSectionProps> = ({
  title,
  description,
  subdescription,
  features,
  imageUrl,
  imageAlt,
  imagePosition = 'left',
  testimonial,
}) => {
  const ImageComponent = (
    <div className={imagePosition === 'left' ? 'order-2 md:order-1' : 'order-2'}>
      <div className="aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50 shadow-[0_8px_24px_rgba(16,185,129,0.1),0_0_20px_rgba(52,211,153,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] ring-1 ring-white/40 backdrop-blur-md border-4 border-emerald-400/40 hover:border-emerald-400/60 transition-all duration-300">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  const ContentComponent = (
    <div className={imagePosition === 'left' ? 'order-1 md:order-2' : 'order-1'}>
      <h2 className="text-3xl font-display font-bold text-emerald-900 mb-4 leading-[1.2]">
        {title}
      </h2>
      <p className="text-lg text-emerald-800 mb-4 leading-[1.7]" dangerouslySetInnerHTML={{ __html: description }} />
      {subdescription && (
        <p className="text-emerald-700/80 mb-6 leading-[1.6]" dangerouslySetInnerHTML={{ __html: subdescription }} />
      )}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-3 items-start">
            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
            <span className="text-emerald-800/90" dangerouslySetInnerHTML={{ __html: feature.text }} />
          </li>
        ))}
      </ul>
      {testimonial && (
        <div className="border-l-4 border-amber-500 p-6 bg-amber-50/60 backdrop-blur-xl rounded-r-2xl shadow-[0_4px_16px_rgba(245,158,11,0.08)] ring-1 ring-white/30 mt-6">
          <p className="text-emerald-800/90 italic">
            {testimonial.text}
          </p>
          <p className="text-sm text-emerald-700/70 mt-3">{testimonial.author}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 md:p-10 mb-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40 hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)] transition-all duration-500 hover:-translate-y-1">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {ImageComponent}
        {ContentComponent}
      </div>
    </div>
  );
};
