import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  CreditCard,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Megaphone,
  Cloud,
  Plug,
  PlugZap,
  Send,
  Share2,
  Search,
  ScrollText,
  Star,
  ReceiptText,
  RefreshCw,
  Route,
  Moon,
  Sun,
  Wallet,
  UserPlus,
  Shield,
  UsersRound,
  X,
} from 'lucide-react'
import { api } from '../../services/api'
import { useSiteBranding } from '../../utils/siteBranding'
import { applyThemeMode, getInitialThemeMode } from '../../utils/themeMode'

const sidebarItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, roles: ['Admin'] },
  {
    label: 'User Management',
    to: '/admin/users',
    icon: UsersRound,
    roles: ['Admin'],
    children: [
      { label: 'All Users', to: '/admin/users', icon: UsersRound },
      { label: 'User', to: '/admin/users?q=users', icon: UsersRound },
      { label: 'Admin', to: '/admin/users?q=Admin', icon: UsersRound },
      { label: 'Staff', to: '/admin/users?q=staff', icon: UsersRound },
      { label: 'Recruiter', to: '/admin/users?q=recruiter', icon: UsersRound },
      { label: 'Freelancer', to: '/admin/users?q=freelancer', icon: UsersRound },
      { label: 'Hiring', to: '/admin/users?q=hiring', icon: UserPlus },
      { label: 'Account Team', to: '/admin/users?q=account%20team', icon: Wallet },
    ],
  },
  { label: 'Jobs Management', to: '/admin/jobs', icon: BriefcaseBusiness, roles: ['Admin'] },
  {
    label: 'Projects Management',
    to: '/admin/projects',
    icon: ClipboardList,
    roles: ['Admin'],
    children: [
      { label: 'Project Directory', to: '/admin/projects', icon: BriefcaseBusiness },
      { label: 'Project Applications', to: '/admin/projects?view=applications', icon: FileCheck2 },
    ],
  },
  {
    label: 'Recruiters',
    to: '/admin/employers',
    icon: Building2,
    roles: ['Admin'],
    children: [
      { label: 'Recruiter Management', to: '/admin/employers', icon: Building2 },
      { label: 'Recruiter Documents', to: '/admin/recruiter-documents', icon: FileCheck2 },
    ],
  },
  { label: 'Candidates', to: '/admin/candidates', icon: UsersRound, roles: ['Admin'] },
  { label: 'Hiring Team', to: '/admin/hiring-team', icon: UserPlus, roles: ['Admin'] },
  { label: 'Applications', to: '/admin/applications', icon: FileCheck2, roles: ['Admin'] },
  {
    label: 'Campaigns',
    to: '/admin/campaigns',
    icon: Megaphone,
    roles: ['Admin', 'staff'],
    children: [
      { label: 'Email Marketing', to: '/admin/campaigns?channel=Email%20Marketing', icon: Mail },
      { label: 'Mobile Message Marketing', to: '/admin/campaigns?channel=Mobile%20Message%20Marketing', icon: MessageCircle },
    ],
  },
  { label: 'Industry', to: '/admin/categories', icon: Building2, roles: ['Admin'] },
  { label: 'Company', to: '/admin/companies', icon: Building2, roles: ['Admin'] },
  {
    label: 'Website Content',
    to: '/admin/testimonials',
    icon: Star,
    roles: ['Admin'],
    children: [
      { label: 'Testimonials', to: '/admin/testimonials', icon: Star },
      { label: 'Video Testimonials', to: '/admin/video-testimonials', icon: Star },
      { label: 'Press / News', to: '/admin/press-news', icon: FileText },
      { label: 'Career Job Posts', to: '/admin/career-jobs', icon: BriefcaseBusiness },
      { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Policy', to: '/admin/policy', icon: FileText },
      { label: 'User Policies', to: '/admin/policy/users', icon: FileText },
      { label: 'Recruiter Policies', to: '/admin/policy/recruiter', icon: FileText },
      { label: 'Freelancer Policies', to: '/admin/policy/freelancer', icon: FileText },
      { label: 'SEO & Branding', to: '/admin/seo-branding', icon: Globe2 },
      { label: 'Social Media', to: '/admin/social-media', icon: Share2 },
      { label: 'Hiring Insights', to: '/admin/hiring-insights', icon: Send },
      { label: 'Support Messages', to: '/admin/support-messages', icon: MessageCircle },
    ],
  },
  {
    label: 'Package',
    to: '/admin/package/pricing',
    icon: CreditCard,
    roles: ['Admin'],
    children: [
      { label: 'Pricing', to: '/admin/package/pricing', icon: CreditCard },
      { label: 'Discount Coupon', to: '/admin/package/discount-coupons', icon: CreditCard },
    ],
  },
  {
    label: 'Payments',
    to: '/admin/payments/transactions',
    icon: Wallet,
    roles: ['Admin'],
    children: [
      { label: 'Transactions', to: '/admin/payments/transactions', icon: ReceiptText },
      { label: 'Payment Logs', to: '/admin/payments/logs', icon: ScrollText },
      { label: 'Payment Methods', to: '/admin/payments/methods', icon: CreditCard },
    ],
  },
  {
    label: 'Plugins',
    to: '/admin/plugins/installed',
    icon: Plug,
    roles: ['Admin'],
    children: [
      { label: 'Add New Plugins', to: '/admin/plugins/add-new', icon: PlugZap },
      { label: 'Installed Plugins', to: '/admin/plugins/installed', icon: Plug },
    ],
  },
  {
    label: 'Settings',
    to: '/admin/settings/google-auth',
    icon: Globe2,
    roles: ['Admin'],
    children: [
      { label: 'Google Auth API', to: '/admin/settings/google-auth', icon: KeyRound },
      { label: 'WhatsApp API', to: '/admin/settings/whatsapp-api', icon: MessageCircle },
      { label: 'Email API', to: '/admin/settings/email-api', icon: Mail },
      { label: 'Supa Cloud Storage', to: '/admin/settings/supa-cloud', icon: Cloud },
      { label: 'Role & Permission', to: '/admin/settings/role-permission', icon: Shield },
    ],
  },
]

const employerSidebarItems = [
  { label: 'Recruiter Dashboard', to: '/recruiter-dashboard', icon: LayoutDashboard },
  { label: 'Post Job', to: '/post-job', icon: BriefcaseBusiness },
  { label: 'Applications', to: '/recruiter-applications', icon: ClipboardList },
  { label: 'Candidates', to: '/recruiter-talent', icon: UsersRound },
  { label: 'Messages', to: '/recruiter-resources', icon: MessageCircle },
  { label: 'Settings', to: '/recruiter-profile', icon: Globe2 },
  { label: 'Pricing', to: '/recruiter-pricing', icon: CreditCard },
]

const freelancerSidebarItems = [
  { label: 'Projects Management', to: '/admin/projects', icon: BriefcaseBusiness },
]

const liveLocationRoles = ['users', 'staff', 'recruiter', 'hiring', 'account team', 'Admin']

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [clearedNotificationIds, setClearedNotificationIds] = useState([])
  const [locationPanelVisible, setLocationPanelVisible] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  const [themeMode, setThemeMode] = useState(getInitialThemeMode)
  const branding = useSiteBranding()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = getStoredAdminUser()
  const isEmployer = user?.role === 'recruiter'
  const isHiring = user?.role === 'hiring'
  const isAccountTeam = user?.role === 'account team'
  const isFreelancer = user?.role === 'freelancer'
  const searchValue = searchParams.get('search') || ''
  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((item) => item.replace(/-/g, ' '))

  useEffect(() => {
    applyThemeMode(themeMode)
  }, [themeMode])

  useEffect(() => {
    if (isHiring && !['/admin/hiring-team', '/admin/profile'].includes(location.pathname)) {
      navigate('/admin/hiring-team', { replace: true })
    }
    if (isAccountTeam && !['/admin/jobs', '/admin/employers', '/admin/recruiter-documents', '/admin/profile'].includes(location.pathname) && !location.pathname.startsWith('/admin/recruiters/') && !location.pathname.startsWith('/admin/recruiter-documents/')) {
      navigate('/admin/employers', { replace: true })
    }
    if (isFreelancer && location.pathname !== '/admin/projects') {
      navigate('/admin/projects', { replace: true })
    }
  }, [isAccountTeam, isFreelancer, isHiring, location.pathname, navigate])

  useEffect(() => {
    if (!isEmployer || !user?.email) {
      setWallet(null)
      return
    }

    let mounted = true
    const loadWallet = () => {
      api
        .currentRecruiterPackage(user.email)
        .then((payload) => {
          if (mounted) setWallet(payload.data || null)
        })
        .catch(() => {
          if (mounted) setWallet(null)
        })
    }

    loadWallet()
    window.addEventListener('focus', loadWallet)
    window.addEventListener('recruiter-wallet-updated', loadWallet)

    return () => {
      mounted = false
      window.removeEventListener('focus', loadWallet)
      window.removeEventListener('recruiter-wallet-updated', loadWallet)
    }
  }, [isEmployer, user?.email])

  useEffect(() => {
    if (!user?.email) {
      setNotifications([])
      setClearedNotificationIds([])
      return
    }

    try {
      setClearedNotificationIds(JSON.parse(localStorage.getItem(getNotificationClearKey(user)) || '[]'))
    } catch {
      setClearedNotificationIds([])
    }

    let mounted = true
    const loadNotifications = async () => {
      setNotificationsLoading(true)
      try {
        if (isHiring || isAccountTeam || isFreelancer) {
          setNotifications([])
          return
        }

        const [dashboardPayload, walletPayload, followUpPayload] = isEmployer
          ? await Promise.all([
              api.employerDashboard(user.email),
              api.currentRecruiterPackage(user.email).catch(() => ({ data: null })),
              Promise.resolve({ data: [] }),
            ])
          : await Promise.all([
              api.adminDashboard(),
              Promise.resolve({ data: null }),
              ['Admin', 'staff'].includes(user?.role) ? api.campaignFollowUps().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
            ])
        if (!mounted) return

        const nextNotifications = isEmployer
          ? buildRecruiterNotifications({
              dashboard: dashboardPayload.data || {},
              wallet: walletPayload.data || null,
            })
          : buildAdminNotifications(dashboardPayload.data || {}, followUpPayload.data || [])
        const clearedIds = JSON.parse(localStorage.getItem(getNotificationClearKey(user)) || '[]')
        setClearedNotificationIds(clearedIds)
        setNotifications(nextNotifications.filter((item) => !clearedIds.includes(item.id)))
      } catch {
        if (mounted) setNotifications([])
      } finally {
        if (mounted) setNotificationsLoading(false)
      }
    }

    loadNotifications()
    window.addEventListener('focus', loadNotifications)
    window.addEventListener('recruiter-wallet-updated', loadNotifications)

    return () => {
      mounted = false
      window.removeEventListener('focus', loadNotifications)
      window.removeEventListener('recruiter-wallet-updated', loadNotifications)
    }
  }, [isAccountTeam, isEmployer, isFreelancer, isHiring, user?.email, user?.role])

  const clearNotifications = () => {
    const ids = notifications.map((item) => item.id)
    const nextIds = [...new Set([...clearedNotificationIds, ...ids])]
    if (user?.email) {
      localStorage.setItem(getNotificationClearKey(user), JSON.stringify(nextIds))
    }
    setClearedNotificationIds(nextIds)
    setNotifications([])
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authExpiresAt')
    navigate('/auth', { replace: true })
  }

  const updateSearch = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('search', value)
    else next.delete('search')
    setSearchParams(next)
  }

  return (
    <div className="admin-material-shell admin-light min-h-screen text-slate-900">
      <AdminSidebar branding={branding} desktopOpen={desktopSidebarOpen} isEmployer={isEmployer} mobileOpen={open} onClose={() => setOpen(false)} role={user?.role} />

      <div className={`transition-[padding] duration-200 ${desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        <header className="admin-material-topbar admin-material-lightbar sticky top-0 z-40 border-b border-slate-200 bg-white shadow-md shadow-slate-200/70">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="admin-topbar-icon grid h-11 w-11 place-items-center rounded-[7px] lg:hidden" onClick={() => setOpen((value) => !value)} type="button" aria-label="Toggle sidebar menu">
                <Menu size={20} />
              </button>
              <button className="admin-topbar-icon hidden h-11 w-11 place-items-center rounded-[7px] transition lg:grid" onClick={() => setDesktopSidebarOpen((value) => !value)} type="button" aria-label="Toggle sidebar panel">
                <Menu size={20} />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {crumbs.map((crumb, index) => (
                    <span className="capitalize" key={crumb}>{index > 0 ? `/ ${crumb}` : crumb}</span>
                  ))}
                </div>
                {(isEmployer || isFreelancer || isHiring || isAccountTeam) && (
                  <h1 className="mt-1 text-xl font-black text-slate-950">{isEmployer ? 'Recruiter Control Center' : isFreelancer ? 'Freelancer Project Center' : isHiring ? 'Hiring Team Center' : 'Account Team Center'}</h1>
                )}
              </div>
            </div>

            <div className="hidden flex-1 justify-center px-8 md:flex">
              <label className="admin-material-search flex w-full max-w-xl items-center gap-3 rounded-[7px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Search size={18} className="text-[#3367F6]" />
                <input className="w-full bg-transparent outline-none" onChange={(event) => updateSearch(event.target.value)} placeholder="Search jobs, recruiters, candidates..." value={searchValue} />
              </label>
            </div>

            <div className="flex items-center gap-2">
              {isEmployer && (
                <Link
                  className="hidden h-11 items-center gap-2 rounded-[7px] bg-[#0057B8] px-4 text-sm font-bold text-white shadow-lg shadow-[#0057B8]/20 transition hover:-translate-y-0.5 hover:bg-[#004694] sm:inline-flex"
                  to="/recruiter"
                >
                  <ExternalLink size={17} />
                  Visit Recruiter Website
                </Link>
              )}
              {isEmployer ? (
                <Link
                  className="hidden h-11 items-center gap-2 rounded-[7px] border border-[#3E9B28]/20 bg-[#3E9B28]/10 px-4 text-sm font-bold text-[#2f7d1f] transition hover:bg-[#3E9B28]/15 sm:inline-flex"
                  to="/recruiter-pricing"
                >
                  <Wallet size={17} />
                  Wallet: {wallet?.coinBalance || 0} coins
                </Link>
              ) : user?.role === 'Admin' ? (
                <>
                  <button
                    aria-label={locationPanelVisible ? 'Hide Map' : 'Show Map'}
                    className="admin-topbar-button hidden h-11 w-11 items-center justify-center rounded-[7px] border text-sm font-bold shadow-sm transition sm:inline-flex"
                    onClick={() => setLocationPanelVisible((value) => !value)}
                    title={locationPanelVisible ? 'Hide Map' : 'Show Map'}
                    type="button"
                  >
                    <MapPin size={17} />
                  </button>
                </>
              ) : null}
              <div className="relative">
                <button
                  aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="admin-topbar-icon relative grid h-11 w-11 place-items-center rounded-[7px] border"
                  onClick={() => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))}
                  title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
                  type="button"
                >
                  {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <div className="relative">
                <button
                  className="admin-topbar-icon relative grid h-11 w-11 place-items-center rounded-[7px] border"
                  onClick={() => {
                    setNotificationsOpen((value) => !value)
                    setProfileOpen(false)
                  }}
                  type="button"
                >
                  <Bell size={19} />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-[7px] bg-teal-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {notificationsOpen && <NotificationMenu isEmployer={isEmployer} loading={notificationsLoading} notifications={notifications} onClear={clearNotifications} />}
              </div>
              <div className="relative">
                <button
                  className="admin-topbar-profile flex items-center gap-3 rounded-[7px] border py-1 pl-1 pr-3"
                  onClick={() => {
                    setProfileOpen((value) => !value)
                    setNotificationsOpen(false)
                  }}
                  type="button"
                >
                  <span className="admin-material-avatar grid h-9 w-9 place-items-center rounded-[7px] text-sm font-black">{getInitials(user?.name || user?.role || 'AD')}</span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-bold text-slate-900">{user?.name || 'Admin User'}</span>
                    <span className="block text-xs text-slate-500">{user?.role || 'Admin'} - Online</span>
                  </span>
                  <ChevronDown className={`hidden text-slate-400 transition sm:block ${profileOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                {profileOpen && <ProfileMenu isEmployer={isEmployer} logout={logout} user={user} />}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-full overflow-x-hidden bg-[#EEF2F8] px-4 py-6 sm:px-6 lg:px-8">
          <LiveLocationTracker user={user} visible={locationPanelVisible} />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function buildRecruiterNotifications({ dashboard = {}, wallet = null }) {
  const metrics = dashboard.metrics || {}
  const applications = Array.isArray(dashboard.applications) ? dashboard.applications : []
  const items = []

  if (Number(metrics.activeApplications || 0) > 0) {
    items.push({
      id: 'active-applications',
      title: `${metrics.activeApplications} active applications`,
      description: 'New, reviewed, and interview-stage candidates are pending.',
      to: '/recruiter-applications?status=active',
      icon: ClipboardList,
      tone: 'blue',
      meta: 'Live pipeline',
    })
  }

  if (Number(metrics.shortlistedCandidates || 0) > 0) {
    items.push({
      id: 'shortlisted',
      title: `${metrics.shortlistedCandidates} shortlisted candidates`,
      description: 'Move shortlisted candidates to the next hiring step.',
      to: '/recruiter-applications?status=shortlisted',
      icon: UsersRound,
      tone: 'teal',
      meta: 'Candidate stage',
    })
  }

  if (Number(metrics.interviewSchedule || 0) > 0) {
    items.push({
      id: 'interviews',
      title: `${metrics.interviewSchedule} interview invites`,
      description: 'Track candidates in the interview stage.',
      to: '/recruiter-applications?status=interview',
      icon: CalendarDays,
      tone: 'violet',
      meta: 'Schedule',
    })
  }

  if (wallet) {
    const coinBalance = Number(wallet.coinBalance || 0)
    const coinPerJob = Number(wallet.packageSnapshot?.coinPerJob || 10)
    items.push({
      id: 'wallet',
      title: `${coinBalance} wallet coins available`,
      description: coinBalance < coinPerJob ? `${coinPerJob} coins are required for one job. Buy coins to continue.` : 'Your wallet is ready. You can post a job.',
      to: '/recruiter-pricing',
      icon: Wallet,
      tone: coinBalance < coinPerJob ? 'rose' : 'emerald',
      meta: wallet.packageSnapshot?.name || 'Active package',
    })
  } else {
    items.push({
      id: 'package-required',
      title: 'Package not active',
      description: 'Activate a recruiter package to post jobs and use wallet coins.',
      to: '/recruiter-pricing',
      icon: CreditCard,
      tone: 'rose',
      meta: 'Action required',
    })
  }

  applications.slice(0, 3).forEach((application) => {
    items.push({
      id: application._id || `${application.candidateEmail}-${application.jobTitle}`,
      title: `${application.candidateName || 'Candidate'} applied`,
      description: `${application.jobTitle || 'Job'} / ${application.company || 'Company'} / ${application.status || 'New'}`,
      to: application.candidateEmail ? `/recruiter-applications/candidate/${encodeURIComponent(application.candidateEmail)}` : '/recruiter-applications',
      icon: FileCheck2,
      tone: 'slate',
      meta: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Recent',
    })
  })

  return items
}

function buildAdminNotifications(dashboard = {}, campaignFollowUps = []) {
  const metrics = dashboard.metrics || {}
  const pendingReviews = Array.isArray(dashboard.pendingReviews) ? dashboard.pendingReviews : []
  const supportMessages = Array.isArray(dashboard.supportMessages) ? dashboard.supportMessages : []
  const recentJobs = Array.isArray(dashboard.recentJobs) ? dashboard.recentJobs : []
  const recentApplications = Array.isArray(dashboard.recentApplications) ? dashboard.recentApplications : []
  const items = []

  if (Number(metrics.pendingJobs || 0) > 0) {
    items.push({
      id: 'admin-pending-jobs',
      title: `${metrics.pendingJobs} jobs awaiting approval`,
      description: 'The account department needs to review pending job posts.',
      to: '/admin/jobs',
      icon: BriefcaseBusiness,
      tone: 'blue',
      meta: 'Jobs',
    })
  }

  if (Number(metrics.rejectedJobs || 0) > 0) {
    items.push({
      id: 'admin-rejected-jobs',
      title: `${metrics.rejectedJobs} rejected jobs`,
      description: 'Audit rejected job posts and remarks.',
      to: '/admin/jobs?status=Rejected',
      icon: FileCheck2,
      tone: 'rose',
      meta: 'Review',
    })
  }

  if (Number(metrics.pendingDocuments || 0) > 0) {
    items.push({
      id: 'admin-pending-documents',
      title: `${metrics.pendingDocuments} recruiter documents pending`,
      description: 'PAN, GST, offer letter, and company document verification is pending.',
      to: '/admin/recruiter-documents',
      icon: ClipboardList,
      tone: 'violet',
      meta: 'Documents',
    })
  }

  if (Number(metrics.openSupportMessages || 0) > 0) {
    items.push({
      id: 'admin-open-support',
      title: `${metrics.openSupportMessages} support messages open`,
      description: 'Candidate/recruiter support chats need response.',
      to: '/admin/support-messages',
      icon: MessageCircle,
      tone: 'teal',
      meta: 'Support',
    })
  }

  if (Number(metrics.activeSubscriptions || 0) > 0) {
    items.push({
      id: 'admin-active-packages',
      title: `${metrics.activeSubscriptions} active recruiter packages`,
      description: 'Recruiter package and wallet activity is live.',
      to: '/admin/package/pricing',
      icon: CreditCard,
      tone: 'emerald',
      meta: 'Package',
    })
  }

  if (campaignFollowUps.length > 0) {
    items.push({
      id: 'admin-campaign-follow-ups',
      title: `${campaignFollowUps.length} campaign follow-ups due`,
      description: 'No reply recorded after 72 hours. Send the next email touch.',
      to: '/admin/campaigns',
      icon: Megaphone,
      tone: 'rose',
      meta: 'Campaigns',
    })
  }

  pendingReviews.slice(0, 2).forEach((document) => {
    items.push({
      id: `admin-document-${document._id}`,
      title: `${document.recruiterName || 'Recruiter'} document review`,
      description: `${document.documentType || 'Document'} / ${document.status || 'Pending'}`,
      to: `/admin/recruiter-documents/${document._id}`,
      icon: FileCheck2,
      tone: 'slate',
      meta: 'KYC',
    })
  })

  supportMessages.slice(0, 2).forEach((message) => {
    items.push({
      id: `admin-support-${message._id}`,
      title: `${message.name || 'User'} support chat`,
      description: `${message.subject || 'Support message'} / ${message.status || 'Open'}`,
      to: `/admin/support-messages/${message._id}`,
      icon: MessageCircle,
      tone: 'rose',
      meta: 'Chat',
    })
  })

  recentJobs.slice(0, 2).forEach((job) => {
    items.push({
      id: `admin-job-${job._id}`,
      title: `${job.title || 'Job'} posted`,
      description: `${job.company || 'Company'} / ${job.location || 'Location'} / ${job.approval || job.accountDepartmentStatus || job.status || 'Pending'}`,
      to: '/admin/jobs',
      icon: BriefcaseBusiness,
      tone: 'blue',
      meta: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent',
    })
  })

  recentApplications.slice(0, 2).forEach((application) => {
    items.push({
      id: `admin-application-${application._id}`,
      title: `${application.candidateName || 'Candidate'} application`,
      description: `${application.jobTitle || 'Job'} / ${application.company || 'Company'} / ${application.status || 'New'}`,
      to: '/admin/applications',
      icon: UsersRound,
      tone: 'teal',
      meta: application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Recent',
    })
  })

  return items
}

function getNotificationClearKey(user = {}) {
  const role = user.role || 'user'
  const email = String(user.email || '').toLowerCase()
  return `${role}NotificationsCleared:${email}`
}

function getNotificationTone(tone) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  }

  return tones[tone] || tones.blue
}

function NotificationMenu({ isEmployer, loading, notifications, onClear }) {
  const items = notifications

  return (
    <div className="absolute right-0 top-14 z-50 w-[24rem] max-w-[calc(100vw-2rem)] rounded-[7px] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-100">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-black text-slate-950">Notifications</h3>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button className="rounded-[7px] bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 transition hover:bg-rose-50 hover:text-rose-700" onClick={onClear} type="button">
              Clear
            </button>
          )}
                  <span className="rounded-[7px] bg-teal-50 px-2.5 py-1 text-xs font-black text-teal-700">{isEmployer ? 'Recruiter live' : 'Admin live'}</span>
        </div>
      </div>
      {loading ? (
        <div className="rounded-[7px] bg-slate-50 p-4 text-sm font-bold text-slate-500">Loading recruiter notifications...</div>
      ) : items.length ? (
        <div className="grid max-h-[26rem] gap-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link className="group rounded-[7px] border border-slate-100 bg-white p-3 transition hover:border-blue-100 hover:bg-blue-50/50" key={item.id} to={item.to}>
                <div className="flex gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[7px] ring-1 ${getNotificationTone(item.tone)}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-black text-slate-950">{item.title}</span>
                      <span className="shrink-0 rounded-[7px] bg-slate-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-400 group-hover:bg-white">{item.meta}</span>
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">{item.description}</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[7px] bg-slate-50 p-4">
          <p className="font-black text-slate-950">All clear</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">There are no new notifications in this workspace.</p>
        </div>
      )}
    </div>
  )
}

function ProfileMenu({ isEmployer, logout, user }) {
  const profilePath = isEmployer ? '/recruiter-profile' : '/admin/profile'
  const settingsPath = isEmployer ? '/recruiter-profile' : '/admin/profile'

  return (
    <div className="absolute right-0 top-14 z-50 w-72 rounded-[7px] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-100">
      <div className="flex items-center gap-3 rounded-[7px] bg-blue-50 p-3">
        <span className="admin-profile-chip grid h-11 w-11 place-items-center rounded-[7px] text-sm font-black">{getInitials(user?.name || user?.role || 'AD')}</span>
        <div>
          <p className="font-black text-slate-950">{user?.name || 'Admin User'}</p>
          <p className="text-sm font-semibold text-blue-700">{user?.role || 'Admin'}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        <Link className="rounded-[7px] px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50" to={profilePath}>Profile</Link>
        <Link className="rounded-[7px] px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50" to={settingsPath}>Account Settings</Link>
        <button className="rounded-[7px] px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </div>
  )
}

function LiveLocationTracker({ user, visible = false }) {
  const [locationData, setLocationData] = useState(null)
  const [previousLocation, setPreviousLocation] = useState(null)
  const [message, setMessage] = useState('Fetching live location...')
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const latestLocationRef = useRef(null)

  const shouldTrack = user?.role && liveLocationRoles.includes(user.role)
  const canViewLocationPanel = ['Admin', 'Super Admin'].includes(user?.role)

  const captureLocation = () => {
    if (!shouldTrack) return

    const basePayload = {
      loginTime: new Date().toISOString(),
      deviceInfo: navigator.userAgent || '',
    }

    if (!navigator.geolocation) {
      setMessage('Location permission required')
      setPermissionDenied(true)
      api.trackUserLocation({ ...basePayload, locationStatus: 'unavailable' }).catch(() => {})
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          ...basePayload,
          locationStatus: 'allowed',
        }

        if (latestLocationRef.current) setPreviousLocation(latestLocationRef.current)
        latestLocationRef.current = nextLocation
        setLocationData(nextLocation)
        setPermissionDenied(false)
        setMessage('Live location active')
        setLastUpdated(new Date())

        try {
          await api.trackUserLocation(nextLocation)
        } catch (error) {
          setMessage(error.message || 'Live location saved locally, backend sync failed.')
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setMessage('Location permission required')
          setPermissionDenied(true)
          api.trackUserLocation({ ...basePayload, locationStatus: 'denied' }).catch(() => {})
          return
        }
        setMessage('Live location could not be fetched.')
        api.trackUserLocation({ ...basePayload, locationStatus: 'unavailable' }).catch(() => {})
      },
      {
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 12000,
      },
    )
  }

  useEffect(() => {
    if (!shouldTrack) return undefined

    captureLocation()
    const interval = window.setInterval(captureLocation, 30000)

    return () => window.clearInterval(interval)
  }, [shouldTrack, user?.email])

  if (!shouldTrack || !canViewLocationPanel || !visible) return null

  const mapUrl = locationData
    ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}&z=16&output=embed`
    : ''
  const directionsUrl = locationData
    ? previousLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${previousLocation.latitude},${previousLocation.longitude}&destination=${locationData.latitude},${locationData.longitude}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${locationData.latitude},${locationData.longitude}&travelmode=driving`
    : ''

  return (
    <section className="mb-5 overflow-hidden rounded-[7px] border border-blue-100 bg-white shadow-sm">
      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_23rem] lg:items-stretch">
        <div>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-blue-600">Google Map & Live Location Tracking</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{user?.name || user?.role} live location</h2>
              <p className={`mt-2 text-sm font-bold ${permissionDenied ? 'text-rose-600' : 'text-slate-500'}`}>{message}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-[7px] bg-teal-50 px-3 py-2 text-xs font-black text-teal-700">
                <RefreshCw size={14} /> Auto-refresh 30s
              </span>
              <span className="inline-flex items-center gap-2 rounded-[7px] bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">
                <MapPin size={14} /> {user?.role}
              </span>
            </div>
          </div>

          {locationData ? (
            <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-4">
              <div className="rounded-[7px] bg-slate-50 p-3"><span className="block text-xs uppercase text-slate-400">Latitude</span>{locationData.latitude.toFixed(6)}</div>
              <div className="rounded-[7px] bg-slate-50 p-3"><span className="block text-xs uppercase text-slate-400">Longitude</span>{locationData.longitude.toFixed(6)}</div>
              <div className="rounded-[7px] bg-slate-50 p-3"><span className="block text-xs uppercase text-slate-400">Accuracy</span>{Math.round(locationData.accuracy || 0)} m</div>
              <div className="rounded-[7px] bg-slate-50 p-3"><span className="block text-xs uppercase text-slate-400">Updated</span>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Now'}</div>
            </div>
          ) : (
            <div className="mt-4 rounded-[7px] bg-rose-50 p-4 text-sm font-black text-rose-700">
              {permissionDenied ? 'Location permission required' : 'Waiting for browser location permission...'}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-[7px] bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-blue-100" onClick={captureLocation} type="button">
              <RefreshCw size={16} /> Refresh Location
            </button>
            {directionsUrl && (
              <a className="inline-flex items-center gap-2 rounded-[7px] bg-slate-100 px-4 py-2 text-sm font-black text-slate-700" href={directionsUrl} rel="noreferrer" target="_blank">
                <Route size={16} /> Google Maps Direction Line
              </a>
            )}
          </div>
        </div>

        <div className="min-h-56 overflow-hidden rounded-[7px] border border-slate-200 bg-slate-100">
          {mapUrl ? (
            <iframe className="h-full min-h-56 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapUrl} title="Live location Google map" />
          ) : (
            <div className="grid h-full min-h-56 place-items-center p-5 text-center text-sm font-black text-slate-500">
              Location permission required
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function AdminSidebar({ branding, desktopOpen, isEmployer, mobileOpen, onClose, role }) {
  return (
    <>
      <aside className={`admin-material-sidebar fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-slate-200 bg-white transition-transform duration-200 lg:block ${desktopOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent branding={branding} isEmployer={isEmployer} role={role} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button aria-label="Close sidebar overlay" className="absolute inset-0 bg-slate-900/30" onClick={onClose} type="button" />
          <aside className="admin-material-sidebar relative h-full w-80 max-w-[86vw] border-r border-slate-200 bg-white shadow-2xl">
            <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[7px] bg-slate-100" onClick={onClose} type="button">
              <X size={18} />
            </button>
            <SidebarContent branding={branding} isEmployer={isEmployer} role={role} />
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarContent({ branding, isEmployer, role }) {
  const [openGroups, setOpenGroups] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const items = isEmployer
    ? employerSidebarItems
    : role === 'Admin'
      ? sidebarItems
      : role === 'staff'
        ? sidebarItems.filter((item) => item.to === '/admin/campaigns')
      : role === 'hiring'
        ? sidebarItems.filter((item) => item.to === '/admin/hiring-team')
        : role === 'account team'
          ? sidebarItems.filter((item) => ['/admin/jobs', '/admin/employers'].includes(item.to))
          : role === 'freelancer'
            ? freelancerSidebarItems
            : []

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authExpiresAt')
    navigate('/auth', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <Link className="flex min-w-0 items-center px-6 py-5" to={isEmployer ? '/recruiter-dashboard' : role === 'freelancer' ? '/admin/projects' : role === 'hiring' ? '/admin/hiring-team' : role === 'account team' ? '/admin/employers' : '/admin'}>
        {branding?.logoUrl ? (
          <img className="h-16 w-auto max-w-[220px] object-contain" src={branding.logoUrl} alt={isEmployer ? (branding?.recruiterName || 'INSEET Recruiter') : (branding?.adminName || 'INSEET Admin')} />
        ) : (
          <>
            <span className="grid h-12 w-12 place-items-center"><BriefcaseBusiness size={23} /></span>
            <span>
              <span className="block text-lg font-black text-slate-950">{isEmployer ? (branding?.recruiterName || 'INSEET Recruiter') : (branding?.adminName || 'INSEET Admin')}</span>
              <span className="block text-xs font-black text-slate-500">{isEmployer ? 'Hiring panel' : 'Enterprise panel'}</span>
            </span>
          </>
        )}
      </Link>
      <nav className="admin-material-nav mt-4 flex-1 space-y-1 overflow-y-auto px-4 pb-4">
        {items.length ? (
          items.map((item) => {
            const Icon = item.icon

            if (item.children?.length) {
              const currentPath = `${location.pathname}${location.search}`
              const isGroupActive = item.children.some((child) => location.pathname === child.to.split('?')[0])
              const isExpanded = openGroups[item.label] ?? isGroupActive

              return (
                <div key={item.label}>
                  <button
                    className={`admin-material-nav-item flex w-full items-center gap-3 rounded-[7px] px-4 py-3 text-sm font-black tracking-[0.01em] transition ${
                      isGroupActive ? 'admin-material-nav-active' : 'text-slate-700 hover:bg-[#E9F0FF] hover:text-[#3367F6]'
                    }`}
                    onClick={() => setOpenGroups((current) => ({ ...current, [item.label]: !isExpanded }))}
                    type="button"
                  >
                    <Icon size={19} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={`transition ${isExpanded ? 'rotate-180' : ''}`} size={16} />
                  </button>
                  {isExpanded && (
                    <div className="mt-1 grid gap-1 pl-5">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon

                        return (
                          <NavLink
                            className={({ isActive }) =>
                              `admin-material-dropdown-item flex items-center gap-3 rounded-[7px] px-4 py-2.5 text-sm font-semibold transition ${
                                isActive && currentPath === child.to ? 'bg-[#DCE8FF] text-[#3367F6]' : 'text-slate-700 hover:bg-[#F3F6FC] hover:text-[#3367F6]'
                              }`
                            }
                            key={child.label}
                            to={child.to}
                          >
                            <ChildIcon size={17} /> {child.label}
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                className={({ isActive }) =>
                  `admin-material-nav-item flex items-center gap-3 rounded-[7px] px-4 py-3 text-sm font-black tracking-[0.01em] transition ${
                isActive ? 'admin-material-nav-active' : 'text-slate-700 hover:bg-[#E9F0FF] hover:text-[#3367F6]'
                  }`
                }
                end={item.to === '/admin'}
                key={item.label}
                to={item.to}
              >
                <Icon size={19} /> {item.label}
              </NavLink>
            )
          })
        ) : (
          <div className="rounded-[7px] bg-slate-50 p-4 text-sm font-black leading-6 text-slate-500">
            {isEmployer ? 'Recruiter workspace' : `${role || 'User'} dashboard access only`}
          </div>
        )}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <button className="admin-sidebar-logout flex w-full items-center gap-3 rounded-[7px] px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50" onClick={logout} type="button">
          <LogOut size={19} /> Logout
        </button>
      </div>
    </div>
  )
}

function getStoredAdminUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null')
  } catch {
    return null
  }
}

function getInitials(value) {
  return value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
