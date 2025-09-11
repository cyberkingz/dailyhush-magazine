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
            <h2 className="text-xl font-semibold text-gray-900">
              Settings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your website settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site Settings */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Site Settings</h3>
                  <p className="text-sm text-gray-500">General website configuration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Site Title</span>
                  <span className="text-gray-900">DailyHush</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Domain</span>
                  <span className="text-gray-900">daily-hush.com</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Theme</span>
                  <span className="text-gray-900">Auto</span>
                </li>
              </ul>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-500">Authentication and access control</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Two-Factor Auth</span>
                  <span className="text-green-600">Enabled</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Session Timeout</span>
                  <span className="text-gray-900">24 hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Admin Email</span>
                  <span className="text-gray-900">admin@daily-hush.com</span>
                </li>
              </ul>
            </div>

            {/* Email Settings */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Configuration</h3>
                  <p className="text-sm text-gray-500">Newsletter and notifications</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Provider</span>
                  <span className="text-gray-900">Configured</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">From Address</span>
                  <span className="text-gray-900">hello@daily-hush.com</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Auto-confirm</span>
                  <span className="text-green-600">Enabled</span>
                </li>
              </ul>
            </div>

            {/* Database Settings */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Database</h3>
                  <p className="text-sm text-gray-500">Supabase configuration</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="text-green-600">Connected</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Project</span>
                  <span className="text-gray-900">DailyHush</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Region</span>
                  <span className="text-gray-900">US East 1</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Advanced Settings Coming Soon
                </h3>
                <p className="text-blue-800 text-sm mb-3">
                  We're working on advanced configuration options including:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
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

