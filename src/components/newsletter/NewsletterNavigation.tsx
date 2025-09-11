import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NewsletterNavigationProps {
  onShare: () => void;
}

const NewsletterNavigation: React.FC<NewsletterNavigationProps> = ({ onShare }) => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <Link 
        to="/archives" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Browse All Editions
      </Link>
      
      <div className="flex gap-3">
        <Link 
          to="/privacy" 
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Privacy Policy
        </Link>
        
        
        <button
          onClick={onShare}
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Share with Friends
        </button>
      </div>
    </div>
  );
};

export default NewsletterNavigation;
