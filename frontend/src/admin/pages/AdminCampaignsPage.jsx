import { useEffect, useMemo, useState } from 'react'
import { AlignLeft, AtSign, Bell, Bold, FileSpreadsheet, Image, Italic, Link2, List, MailOpen, Maximize2, MessageSquareText, Minimize2, MoreVertical, Paperclip, Pencil, RefreshCw, Send, Smile, Smartphone, Trash2, Underline, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AdminCard, DataTable, EmptyAdminState, LoadingSkeleton, StatusBadge, Toolbar } from '../components/AdminPrimitives'
import { api } from '../../services/api'
import logoAsset from '../../assets/inseet-logo.png'

const defaultForm = {
  name: '',
  channel: 'Email Marketing',
  subject: '',
  message: '',
  ctaLabel: '',
  ctaUrl: '',
  googleSheetUrl: '',
  manualRecipients: '',
}

export function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const channel = searchParams.get('channel') || ''
  const currentUser = getStoredUser()

  const load = async () => {
    setLoading(true)
    try {
      const [campaignPayload, followUpPayload] = await Promise.all([
        api.campaigns(),
        api.campaignFollowUps().catch(() => ({ data: [] })),
      ])
      setCampaigns(campaignPayload.data || [])
      setFollowUps(followUpPayload.data || [])
    } catch (error) {
      setMessage(error.message || 'Campaigns could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredCampaigns = useMemo(() => {
    const term = search.trim().toLowerCase()
    return campaigns.filter((campaign) => {
      const matchesSearch = !term || [campaign.name, campaign.subject, campaign.createdByEmail].some((value) => String(value || '').toLowerCase().includes(term))
      const matchesChannel = !channel || campaign.channel === channel
      return matchesSearch && matchesChannel
    })
  }, [campaigns, channel, search])

  const stats = useMemo(() => ({
    total: campaigns.length,
    sent: campaigns.reduce((sum, item) => sum + Number(item.sentCount || 0), 0),
    opened: campaigns.reduce((sum, item) => sum + Number(item.openedCount || 0), 0),
    followUps: followUps.length,
  }), [campaigns, followUps])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const updateChannel = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('channel', value)
    else next.delete('channel')
    setSearchParams(next)
  }

  const saveCampaign = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        ...form,
        recipients: parseManualRecipients(form.manualRecipients),
      }
      const response = editingId ? await api.updateCampaign(editingId, payload) : await api.createCampaign(payload)
      setCampaigns((current) => editingId
        ? current.map((item) => (item._id === editingId ? response.data : item))
        : [response.data, ...current])
      setForm(defaultForm)
      setEditingId('')
      setMessage(response.message || (editingId ? 'Campaign updated.' : 'Campaign created.'))
    } catch (error) {
      setMessage(error.message || 'Campaign could not be created.')
    } finally {
      setSaving(false)
    }
  }

  const editCampaign = (campaign) => {
    setEditingId(campaign._id)
    setForm({
      name: campaign.name || '',
      channel: campaign.channel || 'Email Marketing',
      subject: campaign.subject || '',
      message: campaign.message || '',
      ctaLabel: campaign.ctaLabel || '',
      ctaUrl: campaign.ctaUrl || '',
      googleSheetUrl: campaign.googleSheetUrl || '',
      manualRecipients: recipientsToText(campaign.recipients || []),
    })
    setMessage('Editing campaign. Update details and save.')
  }

  const cancelEdit = () => {
    setEditingId('')
    setForm(defaultForm)
    setMessage('')
  }

  const deleteCampaign = async (campaign) => {
    const ok = window.confirm(`Delete campaign "${campaign.name || 'Untitled'}"?`)
    if (!ok) return

    setMessage('')
    try {
      await api.deleteCampaign(campaign._id)
      setCampaigns((current) => current.filter((item) => item._id !== campaign._id))
      if (editingId === campaign._id) cancelEdit()
      setMessage('Campaign deleted successfully.')
    } catch (error) {
      setMessage(error.message || 'Campaign could not be deleted.')
    }
  }

  const sendCampaign = async (campaign) => {
    if (!canSendCampaign(campaign)) {
      setMessage('Is campaign mein pending email recipients nahi hain. Google Sheet/manual recipients add karke update karo.')
      return
    }
    setSendingId(campaign._id)
    setMessage('')
    try {
      const response = await api.sendCampaign(campaign._id)
      setCampaigns((current) => current.map((item) => (item._id === campaign._id ? response.data : item)))
      setMessage(response.message || 'Campaign sent.')
      load()
    } catch (error) {
      setMessage(error.message || 'Campaign could not be sent.')
    } finally {
      setSendingId('')
    }
  }

  const markReplied = async (campaignId, recipientId) => {
    try {
      const response = await api.markCampaignRecipientReplied(campaignId, recipientId)
      setCampaigns((current) => current.map((item) => (item._id === campaignId ? response.data : item)))
      setMessage('Recipient marked as replied.')
      load()
    } catch (error) {
      setMessage(error.message || 'Reply status could not be updated.')
    }
  }

  return (
    <div>
      <Toolbar
        actionLabel="Refresh"
        onAction={load}
        onSearchChange={setSearch}
        onStatusChange={updateChannel}
        searchValue={search}
        statusOptions={['Email Marketing', 'Mobile Message Marketing']}
        statusValue={channel}
        subtitle="Create staff-owned email and mobile message campaigns from Google Sheet contacts, track opens, and monitor 72-hour follow-ups."
        title="Campaigns"
      />

      {message && <div className="mb-4 rounded-[7px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</div>}

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Metric icon={FileSpreadsheet} label="Campaigns" value={stats.total} />
        <Metric icon={Send} label="Sent" value={stats.sent} />
        <Metric icon={MailOpen} label="Opened" value={stats.opened} />
        <Metric icon={Bell} label="72h Follow-ups" value={stats.followUps} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.4fr]">
        <GmailComposer
          currentUser={currentUser}
          editing={Boolean(editingId)}
          form={form}
          onCancel={cancelEdit}
          onChange={update}
          onSubmit={saveCampaign}
          saving={saving}
        />

        <div className="grid gap-5">
          {followUps.length > 0 && (
            <AdminCard>
              <div className="mb-3 flex items-center gap-2">
                <Bell className="text-rose-600" size={19} />
                <h3 className="font-black text-slate-950">Follow-up due</h3>
              </div>
              <div className="grid gap-2">
                {followUps.slice(0, 5).map((item) => (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] bg-rose-50 px-4 py-3 text-sm" key={`${item.campaignId}-${item.recipientId}`}>
                    <span className="font-bold text-rose-900">{item.name || item.email || item.phone} needs a second touch</span>
                    <span className="font-semibold text-rose-700">{item.campaignName}</span>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {loading ? <LoadingSkeleton /> : filteredCampaigns.length ? (
            <DataTable
              columns={[
                { key: 'name', label: 'Campaign' },
                { key: 'channel', label: 'Channel', render: (row) => <span className="inline-flex items-center gap-2">{row.channel === 'Email Marketing' ? <MailOpen size={16} /> : <Smartphone size={16} />} {row.channel}</span> },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                { key: 'recipientCount', label: 'Recipients' },
                { key: 'openedCount', label: 'Opened' },
                { key: 'followUpDueCount', label: 'Follow-ups' },
              ]}
              expandedRowId={expandedId}
              rows={filteredCampaigns}
              actions={(row) => (
                <div className="flex flex-wrap gap-2">
                  <button className="grid h-9 w-9 place-items-center rounded-[7px] bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => editCampaign(row)} title="Edit campaign" type="button">
                    <Pencil size={15} />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-[7px] bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={() => deleteCampaign(row)} title="Delete campaign" type="button">
                    <Trash2 size={15} />
                  </button>
                  <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[7px] bg-blue-50 px-3 text-xs font-black text-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={sendingId === row._id || !canSendCampaign(row)} onClick={() => sendCampaign(row)} title={canSendCampaign(row) ? 'Send campaign' : 'Add pending email recipients first'} type="button">
                    {sendingId === row._id ? <RefreshCw className="animate-spin" size={15} /> : <Send size={15} />} {canSendCampaign(row) ? 'Send' : 'No recipients'}
                  </button>
                </div>
              )}
              renderExpandedRow={(row) => <RecipientList campaign={row} onMarkReplied={markReplied} />}
              onRowClick={(row) => setExpandedId((current) => (current === row._id ? '' : row._id))}
            />
          ) : <EmptyAdminState title="No campaigns found" />}
        </div>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, tone = 'blue', value }) {
  const tones = tone === 'rose' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
  return (
    <AdminCard className="flex items-center gap-3">
      <span className={`grid h-11 w-11 place-items-center rounded-[7px] ${tones}`}><Icon size={21} /></span>
      <div>
        <p className="text-2xl font-black text-slate-950">{value}</p>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      </div>
    </AdminCard>
  )
}

function GmailComposer({ currentUser, editing, form, onCancel, onChange, onSubmit, saving }) {
  const fromEmail = currentUser?.email || 'acquisition@inseet.in'
  const fromName = currentUser?.name || 'INSEET Acquisition Team'

  return (
    <AdminCard className="overflow-hidden p-0">
      <form onSubmit={onSubmit}>
        <div className="flex min-h-10 items-center justify-between bg-slate-100 px-4 text-sm font-black text-slate-950">
          <span>{editing ? 'Edit Message' : 'New Message'}</span>
          <div className="flex items-center gap-1 text-slate-500">
            <ComposerIconButton icon={Minimize2} label="Minimize" />
            <ComposerIconButton icon={Maximize2} label="Fullscreen" />
            {editing && (
              <button className="grid h-7 w-7 place-items-center rounded-[7px] hover:bg-slate-200" onClick={onCancel} title="Close edit mode" type="button">
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4">
          <div className="flex min-h-12 items-center gap-3 border-b border-slate-100">
            <span className="w-14 text-sm text-slate-500">From</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{fromName} &lt;{fromEmail}&gt;</span>
            <select className="rounded-[7px] border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 outline-none" onChange={(event) => onChange('channel', event.target.value)} value={form.channel}>
              <option>Email Marketing</option>
              <option>Mobile Message Marketing</option>
            </select>
          </div>

          <div className="flex min-h-12 items-start gap-3 border-b border-slate-100 py-2">
            <span className="w-14 pt-2 text-sm text-slate-500">To</span>
            <textarea
              className="min-h-9 flex-1 resize-y bg-transparent py-1 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => onChange('manualRecipients', event.target.value)}
              placeholder="name,email,phone per line"
              value={form.manualRecipients}
            />
            <div className="flex items-center gap-2 pt-1 text-sm font-semibold text-blue-700">
              <span>Cc</span>
              <span>Bcc</span>
            </div>
          </div>

          <div className="flex min-h-12 items-center gap-3 border-b border-slate-100">
            <input
              className="flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => onChange('googleSheetUrl', event.target.value)}
              placeholder="Google Sheet CSV/share URL"
              value={form.googleSheetUrl}
            />
            <span className="inline-flex items-center gap-1 text-xs font-black text-blue-700"><AtSign size={14} /> Campaign</span>
          </div>

          <div className="flex min-h-12 items-center gap-3 border-b border-slate-100">
            <input
              className="flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Campaign name"
              required
              value={form.name}
            />
          </div>

          <div className="flex min-h-12 items-center gap-3 border-b border-slate-100">
            <input
              className="flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              disabled={form.channel !== 'Email Marketing'}
              onChange={(event) => onChange('subject', event.target.value)}
              placeholder={form.channel === 'Email Marketing' ? 'Subject' : 'Subject disabled for mobile message'}
              required={form.channel === 'Email Marketing'}
              value={form.subject}
            />
          </div>

          <textarea
            className="min-h-48 w-full resize-y bg-transparent py-6 text-sm font-medium leading-7 text-slate-800 outline-none placeholder:text-slate-400"
            onChange={(event) => onChange('message', event.target.value)}
            placeholder="Write your message..."
            required
            value={form.message}
          />

          <div className="border-t border-slate-100 py-5">
            <p className="mb-8 text-sm font-medium text-slate-600">Kind Regards,</p>
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-blue-700 bg-white p-2">
                <img className="max-h-14 max-w-14 object-contain" src={logoAsset} alt="INSEET" />
              </div>
              <div>
                <p className="text-lg font-black text-blue-700">Rupesh Verma</p>
                <p className="text-xs font-bold italic text-slate-700">Manager - Business Acquisition</p>
                <p className="mt-2 text-xs font-bold text-slate-700">M: ********** | T: **********</p>
                <p className="text-xs font-bold text-blue-800">E: acquisition@inseet.in</p>
                <p className="text-xs font-bold text-slate-700">Mangalabag, Odisha</p>
                <p className="mt-2 text-xs font-black text-blue-700">www.inseet.in/</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 py-3">
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-slate-50 px-2 py-2 text-slate-600">
              <ComposerIconButton icon={Bold} label="Bold" />
              <ComposerIconButton icon={Italic} label="Italic" />
              <ComposerIconButton icon={Underline} label="Underline" />
              <ComposerIconButton icon={AlignLeft} label="Align" />
              <ComposerIconButton icon={List} label="List" />
              <ComposerIconButton icon={Link2} label="Link" />
              <input className="ml-2 min-w-0 flex-1 rounded-[7px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none" onChange={(event) => onChange('ctaLabel', event.target.value)} placeholder="CTA label" value={form.ctaLabel} />
              <input className="min-w-0 flex-1 rounded-[7px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none" onChange={(event) => onChange('ctaUrl', event.target.value)} placeholder="CTA URL" value={form.ctaUrl} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-100 disabled:opacity-60" disabled={saving} type="submit">
                  {saving ? <RefreshCw className="animate-spin" size={17} /> : <Send size={17} />} {editing ? 'Update' : 'Save Draft'}
                </button>
                <ComposerIconButton icon={Paperclip} label="Attach" />
                <ComposerIconButton icon={Link2} label="Insert link" />
                <ComposerIconButton icon={Smile} label="Emoji" />
                <ComposerIconButton icon={Image} label="Insert image" />
                <ComposerIconButton icon={MoreVertical} label="More" />
              </div>
              {editing && (
                <button className="grid h-10 w-10 place-items-center rounded-[7px] bg-rose-50 text-rose-700 hover:bg-rose-100" onClick={onCancel} title="Cancel edit" type="button">
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminCard>
  )
}

function ComposerIconButton({ icon: Icon, label }) {
  return (
    <button className="grid h-8 w-8 place-items-center rounded-[7px] text-slate-600 hover:bg-slate-200 hover:text-slate-950" title={label} type="button">
      <Icon size={16} />
    </button>
  )
}

function RecipientList({ campaign, onMarkReplied }) {
  return (
    <div className="grid gap-2">
      {(campaign.recipients || []).slice(0, 8).map((recipient) => (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[7px] bg-white px-4 py-3 text-sm ring-1 ring-slate-200" key={recipient._id}>
          <span className="font-bold text-slate-700">{recipient.name || recipient.email || recipient.phone}</span>
          <span className="font-semibold text-slate-500">{recipient.email || recipient.phone}</span>
          <StatusBadge status={recipient.status} />
          {recipient.status !== 'Replied' && (
            <button className="inline-flex min-h-8 items-center gap-2 rounded-[7px] bg-emerald-50 px-3 text-xs font-black text-emerald-700" onClick={() => onMarkReplied(campaign._id, recipient._id)} type="button">
              <MessageSquareText size={14} /> Replied
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function parseManualRecipients(value) {
  return String(value || '').split(/\r?\n/).map((line) => {
    const [name, email, phone] = line.split(',').map((item) => item.trim())
    return { name, email, phone }
  }).filter((row) => row.email || row.phone)
}

function recipientsToText(recipients = []) {
  return recipients.map((recipient) => [recipient.name, recipient.email, recipient.phone].filter(Boolean).join(',')).join('\n')
}

function canSendCampaign(campaign) {
  return campaign.channel === 'Email Marketing' && (campaign.recipients || []).some((recipient) => recipient.email && ['Pending', 'Failed', 'Follow-up Due'].includes(recipient.status))
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null') || {}
  } catch {
    return {}
  }
}
