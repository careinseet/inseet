const asyncHandler = require('../middleware/asyncHandler')
const Campaign = require('../models/Campaign')
const { sendConfiguredEmail } = require('../utils/emailSender')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const transparentGif = Buffer.from('R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64')

const listCampaigns = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
  const skip = (page - 1) * limit
  const filter = {}
  if (req.query.channel) filter.channel = req.query.channel
  if (req.query.status) filter.status = req.query.status

  const [items, total] = await Promise.all([
    Campaign.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Campaign.countDocuments(filter),
  ])

  res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
})

const createCampaign = asyncHandler(async (req, res) => {
  const payload = normalizeCampaignPayload(req.body)
  if (!payload.name || !payload.message) {
    res.status(400)
    throw new Error('Campaign name and message are required.')
  }
  if (payload.channel === 'Email Marketing' && !payload.subject) {
    res.status(400)
    throw new Error('Email campaign subject is required.')
  }

  const recipients = await resolveRecipients(req.body)
  const campaign = await Campaign.create({
    ...payload,
    recipients,
    recipientCount: recipients.length,
    status: recipients.length ? 'Ready' : 'Draft',
    createdByName: req.user?.name || '',
    createdByEmail: req.user?.email || '',
  })

  res.status(201).json({ success: true, data: campaign, message: `${recipients.length} recipients loaded.` })
})

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
  if (!campaign) {
    res.status(404)
    throw new Error('Campaign not found.')
  }

  const payload = normalizeCampaignPayload(req.body)
  if (!payload.name || !payload.message) {
    res.status(400)
    throw new Error('Campaign name and message are required.')
  }
  if (payload.channel === 'Email Marketing' && !payload.subject) {
    res.status(400)
    throw new Error('Email campaign subject is required.')
  }

  Object.assign(campaign, payload)
  const recipients = await resolveRecipients(req.body)
  campaign.recipients = recipients
  refreshCampaignStats(campaign)
  campaign.status = campaign.recipientCount ? 'Ready' : 'Draft'
  await campaign.save()

  res.json({ success: true, data: campaign, message: 'Campaign updated successfully.' })
})

const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
  if (!campaign) {
    res.status(404)
    throw new Error('Campaign not found.')
  }

  await campaign.deleteOne()
  res.json({ success: true, data: { _id: req.params.id }, message: 'Campaign deleted successfully.' })
})

const sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
  if (!campaign) {
    res.status(404)
    throw new Error('Campaign not found.')
  }

  if (campaign.channel !== 'Email Marketing') {
    res.status(400)
    throw new Error('Mobile message sending needs an SMS/WhatsApp gateway connection before live delivery.')
  }

  const recipients = campaign.recipients.filter((item) => item.email && ['Pending', 'Failed', 'Follow-up Due'].includes(item.status))
  if (!recipients.length) {
    res.status(400)
    throw new Error('No pending email recipients found.')
  }

  campaign.status = 'Sending'
  await campaign.save()

  for (const recipient of recipients) {
    try {
      const html = buildCampaignHtml({ campaign, recipient, req })
      const text = `${campaign.subject}\n\n${campaign.message}${campaign.ctaUrl ? `\n\n${campaign.ctaLabel || 'Open link'}: ${campaign.ctaUrl}` : ''}`
      await sendConfiguredEmail({ html, subject: campaign.subject, text, to: recipient.email })
      recipient.status = 'Sent'
      recipient.lastSentAt = new Date()
      recipient.followUpDueAt = new Date(Date.now() + 72 * 60 * 60 * 1000)
      recipient.error = ''
    } catch (error) {
      recipient.status = 'Failed'
      recipient.error = error.message || 'Delivery failed.'
    }
  }

  refreshCampaignStats(campaign)
  campaign.status = campaign.failedCount && !campaign.sentCount ? 'Failed' : 'Sent'
  campaign.lastSentAt = new Date()
  await campaign.save()

  res.json({ success: true, data: campaign, message: `Campaign sent to ${campaign.sentCount} recipients.` })
})

const trackCampaignOpen = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId)
  const recipient = campaign?.recipients.id(req.params.recipientId)

  if (campaign && recipient) {
    recipient.openCount = Number(recipient.openCount || 0) + 1
    recipient.firstOpenedAt = recipient.firstOpenedAt || new Date()
    recipient.lastOpenedAt = new Date()
    if (!['Replied', 'Follow-up Due'].includes(recipient.status)) recipient.status = 'Opened'
    refreshCampaignStats(campaign)
    await campaign.save()
  }

  res.set('Content-Type', 'image/gif')
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.end(transparentGif)
})

const markRecipientReplied = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.campaignId)
  const recipient = campaign?.recipients.id(req.params.recipientId)
  if (!campaign || !recipient) {
    res.status(404)
    throw new Error('Campaign recipient not found.')
  }

  recipient.status = 'Replied'
  recipient.repliedAt = new Date()
  refreshCampaignStats(campaign)
  await campaign.save()
  res.json({ success: true, data: campaign })
})

const listFollowUps = asyncHandler(async (req, res) => {
  const now = new Date()
  const campaigns = await Campaign.find({
    recipients: {
      $elemMatch: {
        followUpDueAt: { $lte: now },
        status: { $in: ['Sent', 'Opened', 'Follow-up Due'] },
        repliedAt: null,
      },
    },
  }).sort('-updatedAt').limit(50)

  const data = []
  for (const campaign of campaigns) {
    let changed = false
    campaign.recipients.forEach((recipient) => {
      const isDue = recipient.followUpDueAt && recipient.followUpDueAt <= now && !recipient.repliedAt && ['Sent', 'Opened', 'Follow-up Due'].includes(recipient.status)
      if (isDue) {
        recipient.status = 'Follow-up Due'
        changed = true
        data.push({
          campaignId: campaign._id,
          recipientId: recipient._id,
          campaignName: campaign.name,
          email: recipient.email,
          phone: recipient.phone,
          name: recipient.name,
          followUpDueAt: recipient.followUpDueAt,
        })
      }
    })
    if (changed) {
      refreshCampaignStats(campaign)
      await campaign.save()
    }
  }

  res.json({ success: true, data })
})

function normalizeCampaignPayload(body = {}) {
  return {
    name: String(body.name || '').trim(),
    channel: body.channel === 'Mobile Message Marketing' ? 'Mobile Message Marketing' : 'Email Marketing',
    subject: String(body.subject || '').trim(),
    message: String(body.message || '').trim(),
    ctaLabel: String(body.ctaLabel || '').trim(),
    ctaUrl: String(body.ctaUrl || '').trim(),
    googleSheetUrl: String(body.googleSheetUrl || '').trim(),
  }
}

async function resolveRecipients(body = {}) {
  const manualRows = Array.isArray(body.recipients) ? body.recipients : []
  const sheetRows = body.googleSheetUrl ? await fetchSheetRows(body.googleSheetUrl) : []
  return normalizeRecipients([...manualRows, ...sheetRows])
}

async function fetchSheetRows(url) {
  const csvUrl = toGoogleCsvUrl(url)
  const response = await fetch(csvUrl)
  if (!response.ok) throw new Error('Google Sheet could not be loaded. Publish it as CSV or share it for access.')
  return csvToRows(await response.text())
}

function toGoogleCsvUrl(value) {
  const url = String(value || '').trim()
  const match = url.match(/\/spreadsheets\/d\/([^/]+)/)
  if (!match) return url
  const gid = new URL(url).searchParams.get('gid') || '0'
  return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`
}

function csvToRows(csv) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index]
    const next = csv[index + 1]
    if (char === '"' && quoted && next === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1
      row.push(cell)
      if (row.some((item) => String(item).trim())) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  row.push(cell)
  if (row.some((item) => String(item).trim())) rows.push(row)
  const headers = (rows.shift() || []).map((item) => normalizeKey(item))
  return rows.map((values) => Object.fromEntries(headers.map((key, index) => [key, values[index] || ''])))
}

function normalizeRecipients(rows) {
  const seen = new Set()
  return rows.map((row) => ({
    name: row.name || row.fullname || row.full_name || '',
    email: String(row.email || row.emailaddress || row.email_address || '').trim().toLowerCase(),
    phone: String(row.phone || row.mobile || row.number || '').trim(),
    sourceStatus: row.status || '',
  })).filter((row) => {
    const key = row.email || row.phone
    if (!key || seen.has(key)) return false
    if (row.email && !emailRegex.test(row.email)) return false
    seen.add(key)
    return true
  })
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function buildCampaignHtml({ campaign, recipient, req }) {
  const baseUrl = `${req.protocol}://${req.get('host')}`
  const trackingUrl = `${baseUrl}/api/campaigns/track/open/${campaign._id}/${recipient._id}.gif`
  const paragraphs = escapeHtml(campaign.message).split(/\n+/).filter(Boolean).map((line) => `<p style="margin:0 0 14px;color:#334155;font-size:15px;line-height:1.7">${line}</p>`).join('')
  const button = campaign.ctaUrl
    ? `<div style="padding-top:12px"><a href="${escapeHtml(campaign.ctaUrl)}" style="display:inline-block;border-radius:8px;background:#0f5bbb;color:#ffffff;padding:13px 20px;text-decoration:none;font-size:14px;font-weight:800">${escapeHtml(campaign.ctaLabel || 'Open link')}</a></div>`
    : ''
  const signature = `
    <div style="margin-top:42px;color:#0f172a">
      <p style="margin:0 0 28px;font-size:14px;font-weight:700">Kind Regards,</p>
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="width:96px;vertical-align:top">
            <div style="height:78px;width:78px;border-radius:50%;border:2px solid #0f5bbb;color:#0f5bbb;font-size:15px;font-weight:900;line-height:78px;text-align:center">INSEET</div>
          </td>
          <td style="vertical-align:top;padding-left:18px">
            <p style="margin:0;color:#0057b8;font-size:18px;font-weight:900">Rupesh Verma</p>
            <p style="margin:2px 0 10px;color:#0f172a;font-size:12px;font-style:italic;font-weight:700">Manager - Business Acquisition</p>
            <p style="margin:0;color:#0f172a;font-size:12px;font-weight:700">M: ********** | T: **********</p>
            <p style="margin:0;color:#0057b8;font-size:12px;font-weight:700">E: acquisition@inseet.in</p>
            <p style="margin:0;color:#0f172a;font-size:12px;font-weight:700">Mangalabag, Odisha</p>
            <p style="margin:12px 0 0;color:#0057b8;font-size:12px;font-weight:900">www.inseet.in/</p>
          </td>
        </tr>
      </table>
    </div>
  `

  return `<div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-radius:12px;background:#ffffff;border:1px solid #e2e8f0"><tr><td style="padding:28px 30px"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#0f172a">${escapeHtml(campaign.subject || campaign.name)}</h1>${recipient.name ? `<p style="margin:0 0 14px;color:#475569;font-size:15px">Hi ${escapeHtml(recipient.name)},</p>` : ''}${paragraphs}${button}${signature}</td></tr><tr><td style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:16px 30px;text-align:center"><p style="margin:0;color:#64748b;font-size:12px">Sent by INSEET Campaigns</p></td></tr></table></td></tr></table><img src="${trackingUrl}" alt="" width="1" height="1" style="display:none" /></div>`
}

function refreshCampaignStats(campaign) {
  campaign.recipientCount = campaign.recipients.length
  campaign.sentCount = campaign.recipients.filter((item) => ['Sent', 'Opened', 'Replied', 'Follow-up Due'].includes(item.status)).length
  campaign.failedCount = campaign.recipients.filter((item) => item.status === 'Failed').length
  campaign.openedCount = campaign.recipients.filter((item) => Number(item.openCount || 0) > 0).length
  campaign.repliedCount = campaign.recipients.filter((item) => item.status === 'Replied').length
  campaign.followUpDueCount = campaign.recipients.filter((item) => item.status === 'Follow-up Due').length
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

module.exports = { createCampaign, deleteCampaign, listCampaigns, listFollowUps, markRecipientReplied, sendCampaign, trackCampaignOpen, updateCampaign }
