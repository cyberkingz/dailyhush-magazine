import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">DailyHush</h3>
            <p className="text-gray-600 text-sm mb-4">Your daily dose of thoughtful content and insights.</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Red Impact LLC DBA DailyHush</p>
              <p>30 N Gould St Ste R</p>
              <p>Sheridan, Wyoming, 82801</p>
              <p>Company #: 2024-001419992</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Navigation</h4>
            <nav className="flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link to="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
              <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
              <Link to="/newsletter" className="hover:text-gray-900 transition-colors">Newsletter</Link>
            </nav>
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

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Red Impact LLC DBA DailyHush. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
            <a href="mailto:hello@daily-hush.com" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

