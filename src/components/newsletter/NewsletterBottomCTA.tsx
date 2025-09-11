import React from 'react';
import { Mail } from 'lucide-react';
import { NewsletterCTA } from '@/components/NewsletterCTA';

const NewsletterBottomCTA: React.FC = () => {
  return (
    <div className="mt-12">
      <NewsletterCTA centered />
      <p className="text-sm text-gray-600 mt-4 text-center flex items-center justify-center gap-2">
        <Mail className="w-4 h-4" />
        <span>Delivered every Monday • Unsubscribe anytime • No spam, ever</span>
      </p>
    </div>
  );
};

export default NewsletterBottomCTA;
