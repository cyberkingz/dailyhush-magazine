import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import type { NewsletterEdition } from '../../content/newsletters';

interface NewsletterHeaderProps {
  edition: NewsletterEdition;
}

const NewsletterHeader: React.FC<NewsletterHeaderProps> = ({ edition }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-8">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <Link 
          to="/archives" 
          className="inline-flex items-center gap-1 hover:text-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          All Editions
        </Link>
        <span>•</span>
        <span>DailyHush Newsletter</span>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{edition.displayDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>5 min read</span>
          </div>
          {/* opens removed */}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {edition.title}
        </h1>
        
        <p className="text-xl text-gray-700 mb-6">{edition.summary}</p>
        {/* share actions removed */}
      </div>

      {edition.heroImage && (
        <div className="mb-8">
          <img 
            src={edition.heroImage} 
            alt={edition.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default NewsletterHeader;
