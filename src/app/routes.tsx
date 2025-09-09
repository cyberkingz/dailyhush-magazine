import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { BrandLoader } from '@/components/ui/BrandLoader'

const Home = lazy(() => import('@/pages/index'))
const BlogList = lazy(() => import('@/pages/blog/index'))
const BlogDetail = lazy(() => import('@/pages/blog/[slug]'))
const CategoryList = lazy(() => import('@/pages/categories/[slug]'))
const About = lazy(() => import('@/pages/about'))
const Contact = lazy(() => import('@/pages/contact'))
const Newsletter = lazy(() => import('@/pages/newsletter'))
const Privacy = lazy(() => import('@/pages/privacy'))
const Terms = lazy(() => import('@/pages/terms'))

// Admin
const AdminLogin = lazy(() => import('@/pages/admin/login'))
const AdminDashboard = lazy(() => import('@/pages/admin/dashboard'))
const AdminPosts = lazy(() => import('@/pages/admin/posts'))
const AdminLeads = lazy(() => import('@/pages/admin/leads'))
const AdminPostNew = lazy(() => import('@/pages/admin/posts-new'))
const AdminPostEdit = lazy(() => import('@/pages/admin/posts-[id]'))
const AdminCategories = lazy(() => import('@/pages/admin/categories'))
const AdminAuthors = lazy(() => import('@/pages/admin/authors'))
const AdminSettings = lazy(() => import('@/pages/admin/settings'))
const AdminCartography = lazy(() => import('@/pages/admin/cartography'))

export function AppRoutes() {
  return (
    <Suspense fallback={<BrandLoader /> }>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/blog" element={<Layout><BlogList /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
        <Route path="/categories/:slug" element={<Layout><CategoryList /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/newsletter" element={<Layout><Newsletter /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/admin/posts-new" element={<AdminPostNew />} />
        <Route path="/admin/posts-:id" element={<AdminPostEdit />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/authors" element={<AdminAuthors />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/cartography" element={<AdminCartography />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
