const express = require('express')
const { authorize, protect } = require('../middleware/authMiddleware')
const {
  createCampaign,
  deleteCampaign,
  listCampaigns,
  listFollowUps,
  markRecipientReplied,
  sendCampaign,
  trackCampaignOpen,
  updateCampaign,
} = require('../controllers/campaignController')

const router = express.Router()
const campaignRoles = ['Admin', 'staff']

router.get('/track/open/:campaignId/:recipientId.gif', trackCampaignOpen)
router.use(protect, authorize(...campaignRoles))
router.route('/').get(listCampaigns).post(createCampaign)
router.get('/follow-ups', listFollowUps)
router.route('/:id').put(updateCampaign).delete(deleteCampaign)
router.post('/:id/send', sendCampaign)
router.post('/:campaignId/recipients/:recipientId/replied', markRecipientReplied)

module.exports = router
