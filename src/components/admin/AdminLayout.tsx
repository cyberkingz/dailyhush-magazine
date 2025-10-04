import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { signOut } from '../../lib/services/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

interface NavigationLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const [open, setOpen] = useState(false);

  const navigationLinks: NavigationLink[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      label: "Contact Submissions",
      href: "/admin/contact-submissions",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      label: "Leads",
      href: "/admin/leads",
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Quiz Results",
      href: "/admin/quiz-results",
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      label: "Cartography",
      href: "/admin/cartography",
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: "Posts",
      href: "/admin/posts",
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
            {navigationLinks.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={cn(
                  "hover:bg-yellow-50 rounded-lg px-3 py-2 transition-colors",
                  currentPage === link.href && "bg-yellow-100 text-yellow-800"
                )}
              />
            ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 hover:bg-red-50 rounded-lg px-2 py-2 transition-colors text-red-600 w-full text-left min-w-0"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <LogOut className="h-5 w-5" />
              </div>
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getPageDescription(currentPage)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Logo Components
const Logo = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      aria-label="DailyHush Admin"
    >
      <img src="/inline-logo.png" alt="DailyHush" className="h-6 w-auto flex-shrink-0" />
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex items-center text-sm text-black py-1 relative z-20"
      aria-label="DailyHush Admin"
    >
      <img src="/rounded-logo.png" alt="DailyHush" className="h-8 w-8 rounded-full flex-shrink-0" />
    </Link>
  );
};

// Helper functions
const getPageTitle = (currentPage?: string): string => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/contact-submissions': 'Contact Submissions',
    '/admin/leads': 'Leads Management',
    '/admin/quiz-results': 'Quiz Results',
    '/admin/cartography': 'Cartography',
    '/admin/posts': 'Posts Management',
    '/admin/settings': 'Settings',
    // Future: '/admin/analytics': 'Analytics',
    // Future: '/admin/newsletter': 'Newsletter',
  };

  return titles[currentPage || ''] || 'Admin Panel';
};

const getPageDescription = (currentPage?: string): string => {
  const descriptions: Record<string, string> = {
    '/admin/dashboard': 'Overview of your website performance and metrics',
    '/admin/contact-submissions': 'View and manage contact form submissions',
    '/admin/leads': 'Manage newsletter subscribers and leads',
    '/admin/quiz-results': 'View and analyze quiz submissions and overthinker types',
    '/admin/cartography': 'Market research, funnels and competitor mapping',
    '/admin/posts': 'Create and manage blog posts',
    '/admin/settings': 'Configure website settings',
    // Future: '/admin/analytics': 'View detailed analytics and reports',
    // Future: '/admin/newsletter': 'Manage newsletter campaigns',
  };

  return descriptions[currentPage || ''] || 'Manage your website';
};

export default AdminLayout;
