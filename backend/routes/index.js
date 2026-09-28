const express = require('express')
const controllers = require('../controllers/resourceControllers')
const authRoutes = require('./authRoutes')
const crudRoutes = require('./crudRoutes')
const campaignRoutes = require('./campaignRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const gstRoutes = require('./gstRoutes')
const { listContentPages } = require('../controllers/contentPageController')
const { getRecruiterPage } = require('../controllers/recruiterPageController')
const { getCompanyProfiles } = require('../controllers/companyProfileController')
const { listFaqs } = require('../controllers/faqController')
const { getJobListings } = require('../controllers/jobListingController')
const { getPortalSummary } = require('../controllers/portalSummaryController')
const { listNewsletterSubscribers } = require('../controllers/newsletterSubscriberController')
const { listNewsletterUpdates, sendNewsletterUpdate } = require('../controllers/newsletterUpdateController')
const recruiterPackageRoutes = require('./recruiterPackageRoutes')
const recruiterJobRoutes = require('./recruiterJobRoutes')
const resumeUploadRoutes = require('./resumeUploadRoutes')
const settingsRoutes = require('./settingsRoutes')
const testimonialRoutes = require('./testimonialRoutes')
const videoTestimonialRoutes = require('./videoTestimonialRoutes')
const userRoutes = require('./userRoutes')
const userLocationRoutes = require('./userLocationRoutes')
const { authorize, protect } = require('../middleware/authMiddleware')

const router = express.Router()
const accountRoles = ['Admin', 'staff', 'hiring', 'account team', 'recruiter', 'users', 'freelancer']

router.get('/health', (req, res) => res.json({ success: true, message: 'INSEET API is running' }))
router.use('/auth', authRoutes)
router.use('/campaigns', campaignRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/gst', gstRoutes)
router.get('/recruiter-page', getRecruiterPage)
router.get('/company-profiles', getCompanyProfiles)
router.get('/job-listings', getJobListings)
router.get('/portal-summary', getPortalSummary)
router.use('/users', userRoutes)
router.use('/user-locations', userLocationRoutes)
router.use('/jobs', crudRoutes.protected(controllers.jobs, { publicRead: true }))
router.use('/companies', crudRoutes.protected(controllers.companies, { publicRead: true }))
router.get('/content-pages', listContentPages)
router.get('/contentpages', listContentPages)
router.use('/content-pages', crudRoutes.protected(controllers.contentPages, { publicRead: true }))
router.use('/contentpages', crudRoutes.protected(controllers.contentPages, { publicRead: true }))
router.use('/employers', crudRoutes.protected(controllers.employers, {
  publicCreate: true,
  readRoles: ['Admin', 'staff', 'account team', 'recruiter'],
  updateRoles: ['Admin', 'staff', 'account team', 'recruiter'],
}))
router.get('/faqs', listFaqs)
router.use('/faqs', crudRoutes.protected(controllers.faqs, { publicRead: true }))
router.use('/freelancer-profiles', crudRoutes.protected(controllers.freelancerProfiles, { publicRead: true }))
router.use('/career-jobs', crudRoutes.protected(controllers.careerJobs, { publicRead: true }))
router.use('/candidates', crudRoutes.protected(controllers.candidates, { readRoles: ['Admin', 'hiring', 'recruiter'] }))
router.use('/applications', crudRoutes.protected(controllers.applications, {
  createRoles: accountRoles,
  readRoles: accountRoles,
  updateRoles: ['Admin', 'staff', 'hiring', 'account team', 'recruiter'],
}))
router.use('/categories', crudRoutes.protected(controllers.categories, { publicRead: true }))
router.use('/locations', crudRoutes.protected(controllers.locations, { publicRead: true }))
router.get('/newslettersubscribers', protect, authorize('Admin', 'staff', 'hiring', 'account team'), listNewsletterSubscribers)
router.get('/newsletter-subscribers', protect, authorize('Admin', 'staff', 'hiring', 'account team'), listNewsletterSubscribers)
router.use('/newsletter-subscribers', crudRoutes.protected(controllers.newsletterSubscribers, { publicCreate: true }))
router.use('/newslettersubscribers', crudRoutes.protected(controllers.newsletterSubscribers, { publicCreate: true }))
router.get('/newsletter-updates', protect, authorize('Admin', 'staff', 'hiring', 'account team'), listNewsletterUpdates)
router.post('/newsletter-updates/send', protect, authorize('Admin', 'staff', 'hiring', 'account team'), sendNewsletterUpdate)
router.use('/payments', crudRoutes.protected(controllers.payments))
router.use('/pricing-packages', crudRoutes.protected(controllers.pricingPackages, { publicRead: true }))
router.use('/press-news', crudRoutes.protected(controllers.pressNews, { publicRead: true }))
router.use('/recruiter-package-subscriptions', recruiterPackageRoutes)
router.use('/recruiter-job-posts', recruiterJobRoutes)
router.use('/recruiter-documents', crudRoutes.protected(controllers.recruiterDocuments, {
  publicCreate: true,
  readRoles: ['Admin', 'account team', 'recruiter'],
  updateRoles: ['Admin', 'account team'],
}))
router.use('/resume-uploads', resumeUploadRoutes)
router.use('/resumes', crudRoutes.protected(controllers.resumes, { readRoles: ['Admin', 'hiring', 'recruiter'] }))
router.use('/settings', settingsRoutes)
router.use('/support-messages', crudRoutes.protected(controllers.supportMessages, {
  publicCreate: true,
  readRoles: accountRoles,
  updateRoles: accountRoles,
}))
router.use('/testimonials', testimonialRoutes)
router.use('/video-testimonials', videoTestimonialRoutes)

module.exports = router
