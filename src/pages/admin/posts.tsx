import React from 'react';
import { AdminLayout } from '../../components/admin';
import { AdminGuard } from '../../components/auth';
import { FileText, Plus, Edit, Eye } from 'lucide-react';

const AdminPosts: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/posts">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Posts Management
              </h2>
              <p className="text-sm text-white/70 mt-1">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <button className="bg-amber-500/20 backdrop-blur-[8px] border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:text-amber-200 px-4 py-2 rounded-[10px] flex items-center gap-2 font-medium transition-all duration-200 shadow-[0_2px_4px_rgba(245,158,11,0.1)]">
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>

          <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
            <div className="p-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Posts Management Coming Soon
                </h3>
                <p className="text-white/70 mb-6 max-w-md mx-auto">
                  The posts management system will be available in the next update.
                  For now, you can manage your leads and view analytics.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] text-white/80 rounded-[10px] hover:bg-[hsla(200,14%,78%,0.28)] hover:border-white/30 hover:text-white transition-all duration-200">
                    <Edit className="h-4 w-4" />
                    Draft Posts
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[8px] text-white/80 rounded-[10px] hover:bg-[hsla(200,14%,78%,0.28)] hover:border-white/30 hover:text-white transition-all duration-200">
                    <Eye className="h-4 w-4" />
                    Published Posts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminPosts;

