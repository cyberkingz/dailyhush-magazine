import React from 'react';
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
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { signOut } from '../../lib/services/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from '../ui/sidebar';

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
  const location = useLocation();
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950">
        <Sidebar
          collapsible="icon"
          className={cn(
            "bg-emerald-500/20 backdrop-blur-[48px] backdrop-saturate-[140%]",
            "border-r border-emerald-500/25"
          )}
        >
          <SidebarHeader className="border-b border-emerald-500/20 pb-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-2"
              aria-label="DailyHush Admin"
            >
              <img src="/rounded-logo.png" alt="DailyHush" className="h-8 w-8 rounded-full flex-shrink-0" />
              <span className="text-white font-semibold text-lg group-data-[collapsible=icon]:hidden">
                DailyHush
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === link.href || currentPage === link.href}
                        tooltip={link.label}
                        className={cn(
                          "text-white/80 hover:text-white hover:bg-emerald-500/20",
                          (location.pathname === link.href || currentPage === link.href) &&
                          "bg-amber-500/40 text-white font-medium hover:bg-amber-500/50"
                        )}
                      >
                        <Link to={link.href} className="flex items-center gap-2">
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-emerald-500/20 pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-300/80 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {/* Page Header */}
          <header className="bg-emerald-500/25 backdrop-blur-[48px] backdrop-saturate-[200%] border-b border-emerald-400/20 px-6 py-4 sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              {getPageTitle(currentPage)}
            </h1>
            <p className="text-sm text-white/70 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              {getPageDescription(currentPage)}
            </p>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
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
