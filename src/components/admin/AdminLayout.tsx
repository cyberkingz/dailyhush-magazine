import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { signOut } from '../../lib/services/auth';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

interface NavigationLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navigationLinks: NavigationLink[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Contact Submissions",
      href: "/admin/contact-submissions",
      icon: <MessageSquare className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Leads",
      href: "/admin/leads",
      icon: <Users className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Quiz Results",
      href: "/admin/quiz-results",
      icon: <ClipboardList className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Quiz Analytics",
      href: "/admin/quiz-analytics",
      icon: <BarChart3 className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Cartography",
      href: "/admin/cartography",
      icon: <FileText className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Posts",
      href: "/admin/posts",
      icon: <FileText className="text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="text-white h-5 w-5 flex-shrink-0" />
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
    <div className={cn(
      "flex flex-col md:flex-row bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 w-full flex-1 mx-auto overflow-hidden",
      "h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody
          className={cn(
            "justify-between gap-10",
            "bg-emerald-500/20 backdrop-blur-[48px] backdrop-saturate-[140%]",
            "border-r border-emerald-500/25"
          )}
          mobileLogo={<MobileLogo />}
        >
          {/* Desktop Content */}
          <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-y-auto md:overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {navigationLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    icon: link.icon
                  }}
                  className={cn(
                    "text-white/70 hover:text-white hover:bg-emerald-500/20 rounded-lg px-3",
                    "transition-all duration-200",
                    (location.pathname === link.href || currentPage === link.href) &&
                    "bg-gradient-to-r from-amber-500/50 to-amber-600/40 text-white font-semibold hover:from-amber-500/60 hover:to-amber-600/50 shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex md:hidden flex-col w-full gap-8">
            {/* Mobile Logo Section */}
            <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
              <Logo />
              <p className="text-xs text-white/50 pl-11">Admin Dashboard</p>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 w-full" aria-label="Mobile navigation">
              {navigationLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    icon: link.icon
                  }}
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-emerald-500/20 rounded-lg px-3 py-3",
                    "transition-all duration-200 text-base",
                    (location.pathname === link.href || currentPage === link.href) &&
                    "bg-gradient-to-r from-amber-500/50 to-amber-600/40 text-white font-semibold hover:from-amber-500/60 hover:to-amber-600/50 shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                  )}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            {/* Mobile Logout Button */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: <LogOut className="text-red-300/80 h-5 w-5 flex-shrink-0" />
                }}
                className="text-red-300/80 hover:text-white hover:bg-red-500/20 rounded-lg px-3 py-3 text-base transition-all duration-200"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setOpen(false);
                  handleLogout();
                }}
              />
            </div>
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: <LogOut className="text-red-300/80 h-5 w-5 flex-shrink-0" />
              }}
              className="text-red-300/80 hover:text-red-200 hover:bg-red-500/15 rounded-lg px-3"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleLogout();
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={cn(
          "flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6",
          "bg-emerald-500/25 backdrop-blur-[48px] backdrop-saturate-[200%]",
          "border-emerald-400/20",
          "shadow-[0_2px_8px_-2px_rgba(16,185,129,0.08)]"
        )}>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Home className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/60">Admin</span>
            <span className="text-white/40">/</span>
            <span className="text-sm text-white font-medium">{getPageTitle(currentPage)}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-2">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-sm text-white/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                {getPageDescription(currentPage)}
              </p>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Logo Components
export const Logo = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="relative">
        <img
          src="/rounded-logo.png"
          alt="DailyHush"
          className="h-9 w-9 rounded-full flex-shrink-0 ring-2 ring-emerald-500/30"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-white whitespace-pre text-base"
      >
        DailyHush
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="relative">
        <img
          src="/rounded-logo.png"
          alt="DailyHush"
          className="h-9 w-9 rounded-full flex-shrink-0 ring-2 ring-emerald-500/30"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900" />
      </div>
    </Link>
  );
};

export const MobileLogo = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="relative">
        <img
          src="/rounded-logo.png"
          alt="DailyHush"
          className="h-8 w-8 rounded-full flex-shrink-0 ring-2 ring-emerald-500/30"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-900" />
      </div>
      <span className="font-bold text-white whitespace-pre text-base">
        DailyHush
      </span>
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
    '/admin/quiz-analytics': 'Quiz Analytics',
    '/admin/cartography': 'Cartography',
    '/admin/posts': 'Posts Management',
    '/admin/settings': 'Settings',
  };

  return titles[currentPage || ''] || 'Admin Panel';
};

const getPageDescription = (currentPage?: string): string => {
  const descriptions: Record<string, string> = {
    '/admin/dashboard': 'Overview of your website performance and metrics',
    '/admin/contact-submissions': 'View and manage contact form submissions',
    '/admin/leads': 'Manage newsletter subscribers and leads',
    '/admin/quiz-results': 'View and analyze quiz submissions and overthinker types',
    '/admin/quiz-analytics': 'Track quiz performance, conversion funnel, and drop-off rates',
    '/admin/cartography': 'Market research, funnels and competitor mapping',
    '/admin/posts': 'Create and manage blog posts',
    '/admin/settings': 'Configure website settings',
  };

  return descriptions[currentPage || ''] || 'Manage your website';
};

export default AdminLayout;
