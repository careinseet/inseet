import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AdminCard, StatusBadge } from '../components/AdminPrimitives'
import { api } from '../../services/api'

const paymentMethods = {
  razorpay: {
    key: 'razorpayPaymentGateway',
    title: 'Razorpay',
    badge: 'Live Checkout',
    description: 'UPI, QR, cards, net banking, and wallet payments for Indian recruiters.',
    defaults: {
      enabled: true,
      keyId: '',
      keySecret: '',
      companyName: 'INSEET',
      themeColor: '#2563eb',
      notes: '',
    },
    fields: [
      ['keyId', 'Razorpay Key ID', 'rzp_test_...'],
      ['keySecret', 'Razorpay Key Secret', 'Key secret', 'password'],
      ['companyName', 'Checkout Company Name', 'INSEET'],
      ['themeColor', 'Checkout Theme Color', '#2563eb'],
    ],
  },
  paypal: {
    key: 'paypalPaymentGateway',
    title: 'PayPal',
    badge: 'Payment Option',
    description: 'Store PayPal client credentials for international card and PayPal wallet payments.',
    defaults: {
      enabled: false,
      mode: 'Sandbox',
      clientId: '',
      clientSecret: '',
      merchantEmail: '',
      currency: 'USD',
      notes: '',
    },
    fields: [
      ['mode', 'Mode', 'Sandbox or Live'],
      ['clientId', 'PayPal Client ID', 'Client ID'],
      ['clientSecret', 'PayPal Client Secret', 'Client secret', 'password'],
      ['merchantEmail', 'Merchant Email', 'payments@example.com'],
      ['currency', 'Currency', 'USD'],
    ],
  },
  stripe: {
    key: 'stripePaymentGateway',
    title: 'Stripe',
    badge: 'Payment Option',
    description: 'Store Stripe keys for card, UPI, wallet, and global payment method support.',
    defaults: {
      enabled: false,
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      currency: 'INR',
      notes: '',
    },
    fields: [
      ['publishableKey', 'Stripe Publishable Key', 'pk_test_...'],
      ['secretKey', 'Stripe Secret Key', 'sk_test_...', 'password'],
      ['webhookSecret', 'Stripe Webhook Secret', 'whsec_...', 'password'],
      ['currency', 'Currency', 'INR'],
    ],
  },
}

const methodOrder = ['razorpay', 'paypal', 'stripe']

export function AdminRazorpayPage() {
  const [activeMethod, setActiveMethod] = useState('razorpay')
  const [settingIds, setSettingIds] = useState({})
  const [forms, setForms] = useState(() => buildDefaultForms())
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const activeConfig = paymentMethods[activeMethod]
  const activeForm = forms[activeMethod]

  const loadConfig = () => {
    setLoading(true)
    setMessage('')
    api
      .list('settings', '?search=PaymentGateway&limit=50')
      .then((payload) => {
        const settings = payload.data || []
        const nextIds = {}
        const nextForms = buildDefaultForms()

        methodOrder.forEach((method) => {
          const config = paymentMethods[method]
          const setting = settings.find((item) => item.key === config.key)
          const value = setting?.value || {}
          nextIds[method] = setting?._id || ''
          nextForms[method] = {
            ...config.defaults,
            ...value,
            enabled: value.enabled ?? config.defaults.enabled,
          }
        })

        setSettingIds(nextIds)
        setForms(nextForms)
      })
      .catch((error) => setMessage(error.message || 'Payment methods could not be loaded.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const update = (key, value) => {
    setForms((current) => ({
      ...current,
      [activeMethod]: {
        ...current[activeMethod],
        [key]: value,
      },
    }))
  }

  const save = async () => {
    setSaving(true)
    setMessage('')

    const payload = {
      key: activeConfig.key,
      group: 'payments',
      value: sanitizeMethodValue(activeMethod, activeForm),
    }

    const validationMessage = validateMethod(activeMethod, payload.value)
    if (validationMessage) {
      setSaving(false)
      setMessage(validationMessage)
      return
    }

    try {
      if (settingIds[activeMethod]) {
        await api.update('settings', settingIds[activeMethod], payload)
      } else {
        const created = await api.create('settings', payload)
        setSettingIds((current) => ({ ...current, [activeMethod]: created.data?._id || '' }))
      }
      setMessage(`${activeConfig.title} payment method saved successfully.`)
    } catch (error) {
      setMessage(error.message || `${activeConfig.title} payment method could not be saved.`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[7px] border border-blue-100 bg-white shadow-xl shadow-blue-100/50">
        <div className="grid gap-5 bg-gradient-to-br from-blue-600 via-sky-500 to-teal-400 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-50">Payments / Methods</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Payment Methods</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-blue-50">
              Manage Razorpay, PayPal, and Stripe payment options for recruiter package and wallet payments.
            </p>
          </div>
          <StatusBadge status={activeForm.enabled ? 'Active' : 'Inactive'} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {methodOrder.map((method) => {
          const config = paymentMethods[method]
          const form = forms[method]
          const isActive = activeMethod === method

          return (
            <button
              className={`rounded-[7px] border p-5 text-left shadow-sm transition ${isActive ? 'border-blue-300 bg-blue-700 text-white shadow-xl shadow-blue-100' : 'border-slate-200 bg-white text-slate-950 hover:border-blue-200'}`}
              key={method}
              onClick={() => setActiveMethod(method)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-950'}`}>{config.title}</p>
                  <p className={`mt-2 text-sm font-semibold leading-6 ${isActive ? 'text-blue-50' : 'text-slate-500'}`}>{config.description}</p>
                </div>
                <StatusBadge status={form.enabled ? 'Active' : 'Inactive'} />
              </div>
              <span className={`mt-4 inline-flex rounded-[7px] px-3 py-2 text-xs font-black ${isActive ? 'bg-white text-blue-700' : 'bg-blue-50 text-blue-700'}`}>{config.badge}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
        <AdminCard>
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-600">{activeConfig.title} Keys</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">Checkout configuration</h3>
            </div>
            <label className="flex items-center gap-3 rounded-[7px] bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
              <input checked={activeForm.enabled} onChange={(event) => update('enabled', event.target.checked)} type="checkbox" />
              Enable {activeConfig.title}
            </label>
          </div>

          {loading ? (
            <div className="mt-5 h-56 animate-pulse rounded-[7px] bg-slate-100" />
          ) : (
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {activeConfig.fields.map(([key, label, placeholder, type]) => (
                  <LabeledInput key={key} label={label} onChange={(value) => update(key, value)} placeholder={placeholder} type={type} value={activeForm[key] || ''} />
                ))}
              </div>
              <label className="grid gap-1">
                <span className="text-xs font-black uppercase tracking-wide text-slate-400">Internal Notes</span>
                <textarea className="input min-h-24" onChange={(event) => update('notes', event.target.value)} placeholder="Webhook, live mode, settlement notes..." value={activeForm.notes || ''} />
              </label>
              {message && <p className="rounded-[7px] bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p>}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button className="rounded-[7px] bg-slate-100 px-5 py-2.5 text-sm font-black text-slate-700" onClick={loadConfig} type="button">Refresh</button>
                <button className="rounded-[7px] bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-100 disabled:opacity-60" disabled={saving} onClick={save} type="button">
                  {saving ? 'Saving...' : `Save ${activeConfig.title}`}
                </button>
              </div>
            </div>
          )}
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard>
            <p className="text-sm font-black uppercase tracking-wide text-teal-600">Available Methods</p>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <p>Razorpay is connected to the current recruiter checkout flow.</p>
              <p>PayPal and Stripe are available as payment method settings and can be wired into checkout next.</p>
              <p>All saved methods are stored in admin settings under the payments group.</p>
            </div>
          </AdminCard>
          <AdminCard>
            <p className="text-sm font-black uppercase tracking-wide text-blue-600">Runtime Note</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Razorpay can also use backend .env fallback keys. PayPal and Stripe keys are saved from this page.
            </p>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}

function buildDefaultForms() {
  return methodOrder.reduce((forms, method) => {
    forms[method] = { ...paymentMethods[method].defaults }
    return forms
  }, {})
}

function sanitizeMethodValue(method, form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : Boolean(value),
    ]),
  )
}

function validateMethod(method, value) {
  if (!value.enabled) return ''

  if (method === 'razorpay' && (!value.keyId || !value.keySecret)) return 'Razorpay Key ID and Key Secret are required when enabled.'
  if (method === 'paypal' && (!value.clientId || !value.clientSecret)) return 'PayPal Client ID and Client Secret are required when enabled.'
  if (method === 'stripe' && (!value.publishableKey || !value.secretKey)) return 'Stripe Publishable Key and Secret Key are required when enabled.'

  return ''
}

function LabeledInput({ label, onChange, placeholder, type = 'text', value }) {
  const [showSecret, setShowSecret] = useState(false)
  const isSecret = type === 'password'

  return (
    <label className="grid gap-1">
      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</span>
      <div className="relative">
        <input className="input w-full pr-10" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={isSecret && showSecret ? 'text' : type} value={value} />
        {isSecret && <button aria-label={showSecret ? 'Hide secret' : 'Show secret'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600" onClick={() => setShowSecret((current) => !current)} type="button">{showSecret ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
      </div>
    </label>
  )
}