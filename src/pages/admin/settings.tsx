import React from 'react';
import { AdminLayout } from '../../components/admin';
import { AdminGuard } from '../../components/auth';
import { Settings, Globe, Shield, Mail, Database } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/settings">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Settings
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Configure your website settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Settings */}
            <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[8px] rounded-[10px] flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Site Settings</h3>
                  <p className="text-sm text-white/70">General website configuration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-white/60">Site Title</span>
                  <span className="text-white">DailyHush</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Domain</span>
                  <span className="text-white">daily-hush.com</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Theme</span>
                  <span className="text-white">Auto</span>
                </li>
              </ul>
            </div>

            {/* Security Settings */}
            <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 backdrop-blur-[8px] rounded-[10px] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Security</h3>
                  <p className="text-sm text-white/70">Authentication and access control</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-white/60">Two-Factor Auth</span>
                  <span className="text-emerald-400">Enabled</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Session Timeout</span>
                  <span className="text-white">24 hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Admin Email</span>
                  <span className="text-white">admin@daily-hush.com</span>
                </li>
              </ul>
            </div>

            {/* Email Settings */}
            <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-[8px] rounded-[10px] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Configuration</h3>
                  <p className="text-sm text-white/70">Newsletter and notifications</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-white/60">Provider</span>
                  <span className="text-white">Configured</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">From Address</span>
                  <span className="text-white">hello@daily-hush.com</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Auto-confirm</span>
                  <span className="text-emerald-400">Enabled</span>
                </li>
              </ul>
            </div>

            {/* Database Settings */}
            <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-[8px] rounded-[10px] flex items-center justify-center">
                  <Database className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Database</h3>
                  <p className="text-sm text-white/70">Supabase configuration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-white/60">Status</span>
                  <span className="text-emerald-400">Connected</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Project</span>
                  <span className="text-white">DailyHush</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Region</span>
                  <span className="text-white">US East 1</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-amber-500/10 backdrop-blur-[16px] backdrop-saturate-[140%] border border-amber-500/20 rounded-[12px] shadow-[0_4px_8px_rgba(245,158,11,0.1)] p-6">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-300 mb-2">
                  Advanced Settings Coming Soon
                </h3>
                <p className="text-amber-200/80 text-sm mb-3">
                  We're working on advanced configuration options including:
                </p>
                <ul className="text-amber-200/70 text-sm space-y-1">
                  <li>• SEO configuration and meta tags</li>
                  <li>• Custom domain setup</li>
                  <li>• Analytics integration</li>
                  <li>• Email template customization</li>
                  <li>• User role management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminSettings;

