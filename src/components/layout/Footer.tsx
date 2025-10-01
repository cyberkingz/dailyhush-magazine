import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-0 border-t border-gray-100" role="contentinfo">
      {/* Main footer content */}
      <div className="bg-whiteborder-t border-amber-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand section - takes more space */}
            <div className="lg:col-span-5">
              <Link 
                to="/" 
                className="inline-block mb-6 hover:opacity-80 transition-opacity" 
                aria-label="DailyHush Home"
              >
                <img 
                  src="/inline-logo.png" 
                  alt="DailyHush" 
                  className="h-10 w-auto" 
                />
              </Link>
              <p className="text-gray-900 font-semibold text-lg tracking-tight mb-4">
                Less noise. More you.
              </p>
              <p className="text-gray-700 text-base leading-relaxed max-w-md">
                Your weekly dose of progress and wellness. Real insights for ambitious people who want to grow sustainably.
              </p>
              
              {/* Social proof or newsletter signup could go here */}
              <div className="mt-6 pt-6 border-t border-amber-200">
                <p className="text-sm text-gray-600 font-medium">
                  Trusted by ambitious professionals worldwide
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="font-semibold text-gray-900 text-base mb-6 tracking-tight">
                Resources
              </h3>
              <nav className="space-y-4" aria-label="Footer navigation">
                <Link
                  to="/privacy"
                  className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/legal-notices"
                  className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Legal Notices
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Contact Support
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4">
              <h3 className="font-semibold text-gray-900 text-base mb-6 tracking-tight">
                Get in Touch
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                  <a 
                    href="mailto:hello@daily-hush.com" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    hello@daily-hush.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
                  <a 
                    href="tel:+12013670512" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    +1 (201) 367-0512
                  </a>
                </div>
              </div>
              
              {/* Company details - condensed */}
              <div className="pt-6 border-t border-amber-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Red Impact LLC DBA DailyHush<br />
                  30 N Gould St Ste R, Sheridan, WY 82801
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright bar - improved contrast */}
      <div className="py-5 bg-amber-200 border-t border-amber-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-gray-800 font-medium">
              © {new Date().getFullYear()} Red Impact LLC DBA DailyHush. All rights reserved.
            </p>
            <nav className="flex gap-6 text-sm" aria-label="Footer legal links">
              <Link
                to="/privacy"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Terms
              </Link>
              <Link
                to="/legal-notices"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Legal Notices
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
