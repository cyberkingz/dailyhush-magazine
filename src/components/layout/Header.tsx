import { Link, NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-2xl text-gray-900">DailyHush</Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900 transition-colors'}>Home</NavLink>
            <NavLink to="/blog" className={({isActive}) => isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900 transition-colors'}>Blog</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900 transition-colors'}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900 transition-colors'}>Contact</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/newsletter" className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition-colors">Subscribe</Link>
        </div>
      </div>
    </header>
  )
}
