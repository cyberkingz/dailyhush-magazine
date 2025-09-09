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
              <h2 className="text-xl font-semibold text-gray-900">
                Posts Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200">
            <div className="p-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Posts Management Coming Soon
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  The posts management system will be available in the next update. 
                  For now, you can manage your leads and view analytics.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                    <Edit className="h-4 w-4" />
                    Draft Posts
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
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

