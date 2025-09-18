import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20">
      {/* Main footer content */}
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo */}
            <div>
              <Link to="/" className="block mb-4" aria-label="DailyHush Home">
                <img src="/inline-logo.png" alt="DailyHush" className="h-8 w-auto" />
              </Link>
              <p className="text-gray-900 font-medium text-sm tracking-wide mb-3">Less noise. More you.</p>
              <p className="text-gray-600 text-sm">Your weekly dose of progress and wellness. Real insights for ambitious people who want to grow sustainably.</p>
            </div>

            {/* Company Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Red Impact LLC DBA DailyHush</p>
                <p>30 N Gould St Ste R</p>
                <p>Sheridan, Wyoming, 82801</p>
                <p>Company #: 2024-001419992</p>
              </div>
            </div>

            {/* Legal & Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal & Contact</h4>
              <nav className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
              </nav>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Phone: <a href="tel:+12013670512" className="hover:text-gray-700">+1 201-367-0512</a></p>
                <p>Email: <a href="mailto:hello@daily-hush.com" className="hover:text-gray-700">hello@daily-hush.com</a></p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Copyright bar with custom yellow */}
      <div className="py-4" style={{ backgroundColor: 'rgb(255 213 81)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-black font-medium">© {new Date().getFullYear()} Red Impact LLC DBA DailyHush. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-black font-medium">
              <Link to="/privacy" className="hover:text-gray-800 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-gray-800 transition-colors">Terms</Link>
              <a href="mailto:hello@daily-hush.com" className="hover:text-gray-800 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
