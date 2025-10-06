import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  MessageSquare,
  ClipboardList,
  BarChart3
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
      label: "Quiz Analytics",
      href: "/admin/quiz-analytics",
      icon: <BarChart3 className="h-5 w-5" />
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
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className={cn(
          "justify-between gap-10",
          // Muted emerald liquid glass sidebar
          "bg-emerald-500/35 backdrop-blur-[48px] backdrop-saturate-[140%]",
          "border-r border-emerald-500/25",
          "shadow-[0_16px_32px_-8px_rgba(16,185,129,0.15),0_24px_48px_-12px_rgba(16,185,129,0.20),0_1px_0_0_rgba(255,255,255,0.12)_inset]",
          "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}>
          <div className="flex flex-col flex-1 overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-1">
            {navigationLinks.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className={cn(
                  // Refined liquid glass navigation items
                  "rounded-[12px] px-3 py-2",
                  "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "text-white/80",
                  // Hover - delicate gray liquid rise
                  "hover:bg-[hsla(200,14%,78%,0.18)]",
                  "hover:shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_3px_-1px_rgba(31,45,61,0.06),0_0.5px_0_0_rgba(255,255,255,0.15)_inset]",
                  "hover:text-white",
                  "hover:-translate-y-[0.5px]",
                  // Active - amber accent ONLY for active state
                  currentPage === link.href && "bg-amber-500/50 backdrop-blur-[16px] backdrop-saturate-[140%] text-white font-medium shadow-[0_2px_4px_-2px_rgba(31,45,61,0.06),0_4px_8px_-2px_rgba(31,45,61,0.08),0_2px_8px_rgba(245,158,11,0.12),0_0.5px_0_0_rgba(255,255,255,0.15)_inset] border border-amber-500/15"
                )}
              />
            ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 rounded-[12px] px-3 py-2 w-full text-left min-w-0",
                "text-red-300/80",
                "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                // Red tinted liquid glass on hover
                "hover:bg-red-500/10",
                "hover:text-red-300",
                "hover:shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_3px_-1px_rgba(31,45,61,0.06)]",
                "hover:-translate-y-[0.5px]"
              )}
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
        {/* Header - Ultra-refined liquid glass topbar */}
        <header className={cn(
          // Lighter emerald topbar - creates hierarchy through opacity
          "bg-emerald-500/25 backdrop-blur-[48px] backdrop-saturate-[200%]",
          "border-b border-emerald-400/20",
          "shadow-[0_8px_16px_-4px_rgba(16,185,129,0.12),0_16px_32px_-8px_rgba(16,185,129,0.18),0_1px_0_0_rgba(255,255,255,0.12)_inset]",
          "px-6 py-4 flex-shrink-0",
          "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-sm text-white/70 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                {getPageDescription(currentPage)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={cn(
                "text-sm font-medium text-white/80",
                "bg-[hsla(200,16%,85%,0.14)] backdrop-blur-[16px] backdrop-saturate-[180%]",
                "px-3 py-1.5 rounded-[10px]",
                "border border-[hsla(200,18%,85%,0.14)]",
                "shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
                "transition-all duration-[250ms]"
              )}>
                <span className="text-white/60">Last login:</span>{" "}
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content - Dark emerald for glass contrast */}
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
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
      aria-label="DailyHush Admin"
    >
      <img src="/inline-logo.png" alt="DailyHush" className="h-6 w-auto flex-shrink-0 invert" />
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="/admin/dashboard"
      className="font-normal flex items-center text-sm text-white py-1 relative z-20"
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
