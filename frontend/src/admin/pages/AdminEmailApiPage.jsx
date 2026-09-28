import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AdminCard, StatusBadge } from '../components/AdminPrimitives'
import { api } from '../../services/api'

const defaultEmailApiConfig = {
  enabled: true,
  provider: 'Resend',
  apiKey: '',
  fromEmail: '',
  fromName: 'INSEET',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPassword: '',
  resetUrl: '',
  notes: '',
}

export function AdminEmailApiPage() {
  const [settingId, setSettingId] = useState('')
  const [form, setForm] = useState(defaultEmailApiConfig)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadConfig = () => {
    setLoading(true)
    setMessage('')
    api
      .list('settings', '?search=emailPasswordResetApi&limit=10')
      .then((payload) => {
        const setting = (payload.data || []).find((item) => item.key === 'emailPasswordResetApi')
        const value = setting?.value || {}
        setSettingId(setting?._id || '')
        setForm({
          ...defaultEmailApiConfig,
          enabled: value.enabled !== false,
          provider: value.provider || defaultEmailApiConfig.provider,
          apiKey: value.apiKey || '',
          fromEmail: value.fromEmail || '',
          fromName: value.fromName || defaultEmailApiConfig.fromName,
          smtpHost: value.smtpHost || '',
          smtpPort: value.smtpPort || '587',
          smtpUser: value.smtpUser || '',
          smtpPassword: value.smtpPassword || '',
          resetUrl: value.resetUrl || '',
          notes: value.notes || '',
        })
      })
      .catch((error) => setMessage(error.message || 'Email API config could not be loaded.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const save = async () => {
    setSaving(true)
    setMessage('')

    const payload = {
      key: 'emailPasswordResetApi',
      group: 'auth',
      value: {
        enabled: Boolean(form.enabled),
        provider: form.provider.trim() || defaultEmailApiConfig.provider,
        apiKey: form.apiKey.trim(),
        fromEmail: form.fromEmail.trim(),
        fromName: form.fromName.trim() || defaultEmailApiConfig.fromName,
        smtpHost: form.smtpHost.trim(),
        smtpPort: form.smtpPort.trim() || '587',
        smtpUser: form.smtpUser.trim(),
        smtpPassword: form.smtpPassword.trim(),
        resetUrl: form.resetUrl.trim(),
        notes: form.notes.trim(),
      },
    }

    if (payload.value.enabled && !payload.value.fromEmail) {
      setSaving(false)
      setMessage('From email is required when Email API is enabled.')
      return
    }

    if (payload.value.enabled && payload.value.provider === 'Resend' && !payload.value.apiKey) {
      setSaving(false)
      setMessage('Resend API key is required for Resend provider.')
      return
    }

    if (payload.value.enabled && payload.value.provider !== 'Resend' && (!payload.value.smtpHost || !payload.value.smtpUser || !payload.value.smtpPassword)) {
      setSaving(false)
      setMessage('SMTP host, user, and password are required for SMTP/Gmail SMTP provider.')
      return
    }

    try {
      if (settingId) {
        await api.update('settings', settingId, payload)
      } else {
        const created = await api.create('settings', payload)
        setSettingId(created.data?._id || '')
      }
      setMessage('Email API settings saved successfully.')
    } catch (error) {
      setMessage(error.message || 'Email API config could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[7px] border border-blue-100 bg-white shadow-xl shadow-blue-100/50">
        <div className="grid gap-5 bg-gradient-to-br from-blue-600 via-sky-500 to-teal-400 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-50">Settings / Email API</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Password Reset Email</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-blue-50">
              Configure Resend, SMTP, or Gmail SMTP for Gmail/password reset emails.
            </p>
          </div>
          <StatusBadge status={form.enabled ? 'Active' : 'Inactive'} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <AdminCard>
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-600">Email Sender</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">Reset email configuration</h3>
            </div>
            <label className="flex items-center gap-3 rounded-[7px] bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
              <input checked={form.enabled} onChange={(event) => update('enabled', event.target.checked)} type="checkbox" />
              Enable Email Reset
            </label>
          </div>

          {loading ? (
            <div className="mt-5 h-56 animate-pulse rounded-[7px] bg-slate-100" />
          ) : (
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">Provider</span>
                <select className="input" onChange={(event) => update('provider', event.target.value)} value={form.provider}>
                  <option>Resend</option>
                  <option>SMTP</option>
                  <option>Gmail SMTP</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInput label="From Email" onChange={(value) => update('fromEmail', value)} placeholder="support@yourdomain.com" value={form.fromEmail} />
                <LabeledInput label="From Name" onChange={(value) => update('fromName', value)} placeholder="INSEET" value={form.fromName} />
                <LabeledInput className="sm:col-span-2" label="Reset URL" onChange={(value) => update('resetUrl', value)} placeholder="https://yourdomain.com/reset-password" value={form.resetUrl} />
              </div>
              {form.provider === 'Resend' ? (
                <label className="grid gap-1">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-400">Resend API Key</span>
                  <textarea className="input min-h-24" onChange={(event) => update('apiKey', event.target.value)} placeholder="re_..." value={form.apiKey} />
                </label>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledInput label="SMTP Host" onChange={(value) => update('smtpHost', value)} placeholder="smtp.gmail.com" value={form.smtpHost} />
                  <LabeledInput label="SMTP Port" onChange={(value) => update('smtpPort', value)} placeholder="587" value={form.smtpPort} />
                  <LabeledInput label="SMTP User" onChange={(value) => update('smtpUser', value)} placeholder="your@gmail.com" value={form.smtpUser} />
                  <LabeledInput label="SMTP Password / App Password" onChange={(value) => update('smtpPassword', value)} placeholder="app password" type="password" value={form.smtpPassword} />
                </div>
              )}
              <label className="grid gap-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">Internal Notes</span>
                <textarea className="input min-h-24" onChange={(event) => update('notes', event.target.value)} placeholder="Domain verification, app password notes, template notes..." value={form.notes} />
              </label>
              {message && <p className="rounded-[7px] bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p>}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button className="rounded-[7px] bg-slate-100 px-5 py-2.5 text-sm font-black text-slate-700" onClick={loadConfig} type="button">Refresh</button>
                <button className="rounded-[7px] bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-100 disabled:opacity-60" disabled={saving} onClick={save} type="button">
                  {saving ? 'Saving...' : 'Save Email API'}
                </button>
              </div>
            </div>
          )}
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard>
            <p className="text-sm font-black uppercase tracking-wide text-teal-600">Recommended</p>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <p>Resend is easiest for production password reset emails.</p>
              <p>Gmail SMTP works for testing, but use App Password, not your Gmail password.</p>
              <p>SMTP is useful if you already have Zoho, SendGrid, Mailgun, or cPanel email.</p>
            </div>
          </AdminCard>
          <AdminCard>
            <p className="text-sm font-black uppercase tracking-wide text-blue-600">Runtime Note</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              This page stores sender settings. Backend email delivery still needs the selected provider sender integration to be connected.
            </p>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}

function LabeledInput({ className = '', label, onChange, placeholder, type = 'text', value }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <label className={`grid gap-1 ${className}`}>
      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
      <div className="relative">
        <input className="input w-full pr-10" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={isPassword && showPassword ? 'text' : type} value={value} />
        {isPassword && <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
      </div>
    </label>
  )
}