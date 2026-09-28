import { useState } from 'react'
import { Navigate, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { CookieConsent } from './components/CookieConsent'
import { AuthModal } from './components/AuthModal'
import { FAQPage } from './components/FAQSection'
import { ApplyModal, Toast } from './components/PortalUI'
import { AdminLayout } from './admin/components/AdminLayout'
import { AdminBulkHiringPage, AdminHiringPage, AdminSingleHiringPage } from './admin/pages/AdminHiringPages'
import { AdminHiringTeamPage } from './admin/pages/AdminHiringTeamPage'
import { AdminProfilePage } from './admin/pages/AdminProfilePage'
import { AdminDiscountCouponPage, AdminGoogleAuthPage, AdminManagementPage, AdminNewsletterSendPage, AdminPaymentDetailPage, AdminPricingPage, AdminSEOBrandingPage, AdminSettingsPage, AdminSupaCloudPage, RecruiterDetailPage, RecruiterDocumentDetailPage, SupportMessageDetailPage } from './admin/pages/AdminManagementPage'
import { AdminWhatsAppApiPage } from './admin/pages/AdminWhatsAppApiPage'
import { AdminEmailApiPage } from './admin/pages/AdminEmailApiPage'
import { AdminAddPluginsPage, AdminInstalledPluginsPage } from './admin/pages/AdminPluginsPage'
import { AdminRazorpayPage } from './admin/pages/AdminRazorpayPage'
import { AdminSocialMediaPage } from './admin/pages/AdminSocialMediaPage'
import { AdminRoleDashboard } from './admin/pages/AdminRoleDashboard'
import { AdminRolePermissionPage } from './admin/pages/AdminRolePermissionPage'
import { AdminCampaignsPage } from './admin/pages/AdminCampaignsPage'
import { FreelancerLayout } from './components/FreelancerLayout'
import { Layout } from './components/Layout'
import { EmployerLayout } from './employer/components/EmployerLayout'
import { EmployerLoginPage, EmployerRegisterPage } from './employer/pages/EmployerAuthPages'
import { EmployerLandingPage } from './employer/pages/EmployerLandingPage'
import { RecruiterTestimonialsPage } from './employer/pages/RecruiterTestimonialsPage'
import { RecruiterDocumentReviewPage, RecruiterDocumentsPage, RecruiterVerificationPage } from './employer/pages/RecruiterVerificationPages'
import { AuthPage } from './pages/AuthPage'
import { AuthModalPage } from './pages/AuthModalPage'
import { AboutPage } from './pages/AboutPage'
import { CandidateAppliedJobsPage, CandidateDashboard, CandidateInterviewInvitesPage, CandidateJobAlertsPage, CandidateSavedJobsPage } from './pages/CandidateDashboard'
import { CandidateProfilePage } from './pages/CandidateProfilePage'
import { CandidateReviewsPage } from './pages/CandidateReviewsPage'
import { CareerResourcesPage } from './pages/CareerResourcesPage'
import { CategoryJobsPage } from './pages/CategoryJobsPage'
import { CompaniesPage, CompanyDetailsPage } from './pages/CompaniesPage'
import { ContactPage } from './pages/ContactPage'
import { ContentPage } from './pages/ContentPage'
import { EmployerDashboard } from './pages/EmployerDashboard'
import { FreelancerPage, FreelancerRegisterPage } from './pages/FreelancerPage'
import { FreelancerProjectDetailsPage, FreelancerProjectsPage } from './pages/FreelancerProjectsPage'
import { HomePage } from './pages/HomePage'
import { IndustriesPage } from './pages/IndustriesPage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { JobsPage } from './pages/JobsPage'
import { PostJobPage } from './pages/PostJobPage'
import { PressNewsPage } from './pages/PressNewsPage'
import { RecruiterProfilePage } from './pages/RecruiterProfilePage'
import { RecruiterFindResumePage } from './pages/RecruiterFindResumePage'
import { RecruiterJobsPage } from './pages/RecruiterJobsPage'
import { RecruiterPricingPage } from './pages/RecruiterPricingPage'
import { RecruiterResourcesPage } from './pages/RecruiterResourcesPage'
import { RecruiterTalentPoolPage } from './pages/RecruiterTalentPoolPage'
import { RecruiterAnalyticsPage, RecruiterApplicationsPage, RecruiterCandidateApplicationsPage, RecruiterInterviewsPage, RecruiterTeamPage } from './pages/RecruiterWorkspacePages'
import { ProtectedRoute, RoleRedirect } from './routes/ProtectedRoute'

function App() {
  const [selectedJob, setSelectedJob] = useState(null)

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '/', element: <HomePage onApply={setSelectedJob} /> },
        { path: '/jobs', element: <JobsPage onApply={setSelectedJob} /> },
        { path: '/industries', element: <IndustriesPage /> },
        { path: '/jobs-in-:categorySlug', element: <CategoryJobsPage onApply={setSelectedJob} /> },
        { path: '/categories/:categorySlug', element: <CategoryJobsPage onApply={setSelectedJob} /> },
        { path: '/companies', element: <CompaniesPage /> },
        { path: '/company-jobs-:companySlug', element: <CompanyDetailsPage onApply={setSelectedJob} /> },
        { path: '/companies/:companySlug', element: <CompanyDetailsPage onApply={setSelectedJob} /> },
        { path: '/jobs/:jobId', element: <JobDetailsPage onApply={setSelectedJob} /> },
        { path: '/about', element: <AboutPage /> },
        { path: '/press-news', element: <PressNewsPage /> },
        { path: '/career-resources', element: <CareerResourcesPage /> },
        { path: '/:jobSlug', element: <JobDetailsPage onApply={setSelectedJob} /> },
        { path: '/auth', element: <AuthModalPage /> },
        {
          path: '/candidate-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateDashboard onApply={setSelectedJob} />
            </ProtectedRoute>
          ),
        },
        {
          path: '/candidate-profile',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/candidate-applied-jobs',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateAppliedJobsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/candidate-saved-jobs',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateSavedJobsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/candidate-interview-invites',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateInterviewInvitesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/candidate-job-alerts',
          element: (
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateJobAlertsPage />
            </ProtectedRoute>
          ),
        },
        { path: '/candidate-dashoard', element: <RoleRedirect /> },
        { path: '/employer-dashoard', element: <RoleRedirect /> },
        { path: '/post-job', element: <PostJobPage /> },
        { path: '/candidate-reviews', element: <CandidateReviewsPage /> },
        { path: '/contact', element: <ContactPage /> },
        { path: '/faqs', element: <FAQPage /> },
        { path: '/privacy', element: <ContentPage slug="privacy" /> },
        { path: '/terms', element: <ContentPage slug="terms" /> },
        { path: '/support', element: <ContentPage slug="support" /> },
        { path: '/policies/:pageSlug', element: <ContentPage /> },
      ],
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['Admin', 'staff', 'recruiter', 'users', 'hiring', 'account team', 'freelancer']}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <RoleRedirect /> },
        { path: 'profile', element: <AdminProfilePage /> },
        { path: 'users', element: <AdminManagementPage type="users" /> },
        { path: 'jobs', element: <AdminManagementPage type="jobs" /> },
        { path: 'companies', element: <AdminManagementPage type="companies" /> },
        { path: 'employers', element: <AdminManagementPage type="employers" /> },
        { path: 'recruiters/:recruiterId', element: <RecruiterDetailPage /> },
        { path: 'recruiter-documents', element: <AdminManagementPage type="recruiterDocuments" /> },
        { path: 'recruiter-documents/:documentId', element: <RecruiterDocumentDetailPage /> },
        { path: 'candidates', element: <AdminManagementPage type="candidates" /> },
        { path: 'hiring-team', element: <AdminHiringTeamPage /> },
        { path: 'applications', element: <AdminManagementPage type="applications" /> },
        { path: 'campaigns', element: <AdminCampaignsPage /> },
        { path: 'projects', element: <FreelancerProjectsPage /> },
        { path: 'crm/hiring', element: <AdminHiringPage /> },
        { path: 'crm/hiring/bulk', element: <AdminBulkHiringPage /> },
        { path: 'crm/hiring/single', element: <AdminSingleHiringPage /> },
        { path: 'resumes', element: <AdminManagementPage type="resumes" /> },
        { path: 'categories', element: <AdminManagementPage type="categories" /> },
        { path: 'locations', element: <AdminManagementPage type="locations" /> },
        { path: 'career-jobs', element: <AdminManagementPage type="careerJobs" /> },
        { path: 'press-news', element: <AdminManagementPage type="pressNews" /> },
        { path: 'testimonials', element: <AdminManagementPage type="testimonials" /> },
        { path: 'video-testimonials', element: <AdminManagementPage type="videoTestimonials" /> },
        { path: 'faqs', element: <AdminManagementPage type="faqs" /> },
        { path: 'hiring-insights', element: <AdminManagementPage type="newsletterSubscribers" /> },
        { path: 'hiring-insights/send', element: <AdminNewsletterSendPage /> },
        { path: 'support-messages', element: <AdminManagementPage type="supportMessages" /> },
        { path: 'support-messages/:messageId', element: <SupportMessageDetailPage /> },
        { path: 'policy', element: <AdminManagementPage type="contentPages" /> },
        { path: 'policy/users', element: <AdminManagementPage fixedFilters={{ frontendPlacement: 'Users Frontend' }} type="contentPages" /> },
        { path: 'policy/recruiter', element: <AdminManagementPage fixedFilters={{ frontendPlacement: 'Recruiter Frontend' }} type="contentPages" /> },
        { path: 'policy/freelancer', element: <AdminManagementPage fixedFilters={{ frontendPlacement: 'Freelancer Frontend' }} type="contentPages" /> },
        { path: 'seo-branding', element: <AdminSEOBrandingPage /> },
        { path: 'social-media', element: <AdminSocialMediaPage /> },
        { path: 'payments', element: <Navigate replace to="/admin/payments/transactions" /> },
        { path: 'payments/transactions', element: <AdminManagementPage type="payments" /> },
        { path: 'payments/transactions/:paymentId', element: <AdminPaymentDetailPage /> },
        { path: 'payments/logs', element: <AdminManagementPage type="paymentLogs" /> },
        { path: 'payments/methods', element: <AdminRazorpayPage /> },
        { path: 'discount-coupons', element: <Navigate replace to="/admin/package/discount-coupons" /> },
        { path: 'package/pricing', element: <AdminPricingPage /> },
        { path: 'package/discount-coupons', element: <AdminDiscountCouponPage /> },
        { path: 'package/google-auth', element: <Navigate replace to="/admin/settings/google-auth" /> },
        { path: 'reports', element: <AdminManagementPage type="reports" /> },
        { path: 'settings', element: <AdminSettingsPage /> },
        { path: 'settings/google-auth', element: <AdminGoogleAuthPage /> },
        { path: 'settings/whatsapp-api', element: <AdminWhatsAppApiPage /> },
        { path: 'settings/email-api', element: <AdminEmailApiPage /> },
        { path: 'settings/razorpay', element: <AdminRazorpayPage /> },
        { path: 'settings/supa-cloud', element: <AdminSupaCloudPage /> },
        { path: 'settings/role-permission', element: <AdminRolePermissionPage /> },
        { path: 'plugins/add-new', element: <AdminAddPluginsPage /> },
        { path: 'plugins/installed', element: <AdminInstalledPluginsPage /> },
      ],
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: '/recruiter/recruiter-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EmployerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EmployerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-jobs',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterJobsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-profile',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-applications',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterApplicationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-applications/candidate/:candidateEmail',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterCandidateApplicationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-pricing',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterPricingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-interviews',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterInterviewsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-analytics',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterAnalyticsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-team',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterTeamPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-talent',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterTalentPoolPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-find-resume',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterFindResumePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-resources',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterResourcesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/employers-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EmployerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/employer-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <EmployerDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminRoleDashboard role="Admin" />
            </ProtectedRoute>
          ),
        },
        {
          path: '/staff-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['staff']}>
              <AdminRoleDashboard role="staff" />
            </ProtectedRoute>
          ),
        },
        {
          path: '/recruiter-role-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['recruiter']}>
              <AdminRoleDashboard role="recruiter" />
            </ProtectedRoute>
          ),
        },
        {
          path: '/users-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['users']}>
              <AdminRoleDashboard role="users" />
            </ProtectedRoute>
          ),
        },
        {
          path: '/hiring-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['hiring']}>
              <Navigate replace to="/admin/hiring-team" />
            </ProtectedRoute>
          ),
        },
        {
          path: '/account-team-dashboard',
          element: (
            <ProtectedRoute allowedRoles={['account team']}>
              <Navigate replace to="/admin/employers" />
            </ProtectedRoute>
          ),
        },
        { path: '/admin-dashoard', element: <RoleRedirect /> },
        { path: '/employers-dashoard', element: <RoleRedirect /> },
        { path: '/recruiter-dashoard', element: <RoleRedirect /> },
        { path: '/staff-dashoard', element: <RoleRedirect /> },
        { path: '/company-dashoard', element: <RoleRedirect /> },
        { path: '/recruiter-role-dashoard', element: <RoleRedirect /> },
        { path: '/users-dashoard', element: <RoleRedirect /> },
      ],
    },
    {
      element: <FreelancerLayout />,
      children: [
        { path: '/freelancer', element: <FreelancerPage /> },
        { path: '/freelancer/projects', element: <FreelancerProjectsPage /> },
        { path: '/freelance-project-listings-:projectSlug', element: <FreelancerProjectDetailsPage /> },
        { path: '/freelancer/projects/:projectSlug', element: <FreelancerProjectDetailsPage /> },
        { path: '/freelancer-login', element: <AuthPage defaultRole="freelancer" lockRole /> },
        { path: '/freelancer-register', element: <FreelancerRegisterPage /> },
        { path: '/freelancer/privacy', element: <ContentPage placement="Freelancer Frontend" slug="freelancer-privacy" /> },
        { path: '/freelancer/terms', element: <ContentPage placement="Freelancer Frontend" slug="freelancer-terms" /> },
        { path: '/freelancer/support', element: <ContentPage placement="Freelancer Frontend" slug="freelancer-support" /> },
        { path: '/freelancer/policies/:pageSlug', element: <ContentPage placement="Freelancer Frontend" /> },
      ],
    },
    {
      element: <EmployerLayout />,
      children: [
        { path: '/recruiter', element: <EmployerLandingPage /> },
        { path: '/employers', element: <EmployerLandingPage /> },
        { path: '/recruiter-solutions', element: <EmployerLandingPage /> },
        { path: '/recruiter-testimonials', element: <RecruiterTestimonialsPage /> },
        { path: '/recruiter/privacy', element: <ContentPage placement="Recruiter Frontend" slug="recruiter-privacy" /> },
        { path: '/recruiter/terms', element: <ContentPage placement="Recruiter Frontend" slug="recruiter-terms" /> },
        { path: '/recruiter/support', element: <ContentPage placement="Recruiter Frontend" slug="recruiter-support" /> },
        { path: '/recruiter/policies/:pageSlug', element: <ContentPage placement="Recruiter Frontend" /> },
        { path: '/recruiter-login', element: <RecruiterAuthModalPage mode="recruiter-login" /> },
        { path: '/employer-login', element: <EmployerLoginPage /> },
        { path: '/recruiter-register', element: <RecruiterAuthModalPage mode="recruiter-register" /> },
        { path: '/employer-register', element: <EmployerRegisterPage /> },
        { path: '/recruiter-verification', element: <RecruiterVerificationPage /> },
        { path: '/recruiter-documents', element: <RecruiterDocumentsPage /> },
        { path: '/recruiter-document-review', element: <RecruiterDocumentReviewPage /> },
      ],
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <Toast />
      <CookieConsent />
    </>
  )
}

function RecruiterAuthModalPage({ mode }) {
  const navigate = useNavigate()

  return (
    <>
      <EmployerLandingPage />
      <AuthModal
        initialMode={mode}
        onClose={() => navigate('/recruiter')}
        open
      />
    </>
  )
}

export default App
