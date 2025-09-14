import React from 'react';

const AuthorBio: React.FC = () => {
  return (
    <div className="mt-12 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 min-w-16 flex-shrink-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">DH</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">DailyHush Editorial Team</h3>
          <p className="text-gray-700 mb-3">
            Our team of beauty experts, dermatologists, and wellness professionals test products and trends so you don't have to. 
            We're committed to evidence-based advice that actually works.
          </p>
          {/* Stats row removed per request */}
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
