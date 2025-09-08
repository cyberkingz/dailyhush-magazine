import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">DailyHush</h3>
            <p className="text-gray-600 text-sm max-w-xs">Your daily dose of thoughtful content and insights.</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-gray-600">
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link to="/newsletter" className="hover:text-gray-900 transition-colors">Newsletter</Link>
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center md:text-left">© {new Date().getFullYear()} DailyHush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

