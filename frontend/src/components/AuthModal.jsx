import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Building2, Eye, EyeOff, Lock, Mail, Phone, UserRound, X } from 'lucide-react'
import { getDashboardPath, getRecruiterVerificationPath, getRecruiterVerificationStatus, normalizeRole, storeAuthSession } from '../routes/authRouting'
import { api } from '../services/api'

const candidateInitial = {
  name: '',
  phone: '',
  email: '',
  password: '',
}

const recruiterInitial = {
  companyName: '',
  businessEmail: '',
  phone: '',
  industry: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
}

export function AuthModal({ initialMode = 'login', onClose, onSuccess, open }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState(initialMode)
  const [candidateForm, setCandidateForm] = useState(candidateInitial)
  const [recruiterForm, setRecruiterForm] = useState(recruiterInitial)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const isRecruiter = mode.startsWith('recruiter')
  const isRegister = mode.endsWith('register')

  useEffect(() => {
    if (!open) return
    setMode(initialMode)
    setMessage('')
  }, [initialMode, open])

  if (!open) return null

  const updateCandidate = (key, value) => setCandidateForm((current) => ({ ...current, [key]: value }))
  const updateRecruiter = (key, value) => {
    const nextValue = key === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
    setRecruiterForm((current) => ({ ...current, [key]: nextValue }))
  }

  const finishAuth = (payload, fallbackPath) => {
    storeAuthSession(payload)
    onSuccess?.()
    onClose?.()
    navigate(fallbackPath || getDashboardPath(payload.data.role))
  }

  const submitCandidate = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = isRegister
        ? await api.register({ ...candidateForm, role: 'Candidate' })
        : await api.login({ email: candidateForm.email, password: candidateForm.password })
      finishAuth(payload)
    } catch (error) {
      setMessage(error.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitRecruiter = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isRegister) {
        if (!recruiterForm.termsAccepted) throw new Error('Please accept recruiter terms and hiring policies.')
        if (recruiterForm.password !== recruiterForm.confirmPassword) throw new Error('Password and confirm password do not match.')

        const payload = await api.register({
          name: recruiterForm.companyName,
          email: recruiterForm.businessEmail,
          phone: recruiterForm.phone,
          password: recruiterForm.password,
          role: 'recruiter',
        })

        await api.employerRegister({
          companyName: recruiterForm.companyName,
          businessEmail: recruiterForm.businessEmail,
          phone: recruiterForm.phone,
          industry: recruiterForm.industry,
        })

        finishAuth(payload, '/recruiter-documents')
        return
      }

      const payload = await api.employerLogin({ email: recruiterForm.businessEmail, password: recruiterForm.password })
      if (normalizeRole(payload.data.role) !== 'recruiter') {
        throw new Error('Only recruiter accounts can login from this option.')
      }
      storeAuthSession(payload, { role: 'recruiter' })
      const status = getRecruiterVerificationStatus()
      onSuccess?.()
      onClose?.()
      navigate(status === 'approved' ? getDashboardPath(payload.data.role) : getRecruiterVerificationPath(status))
    } catch (error) {
      setMessage(error.message || 'Recruiter authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
  }

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/55 px-4 py-5 backdrop-blur-sm">
      <div className="relative w-full max-w-[920px] overflow-hidden rounded-[8px] bg-white shadow-2xl shadow-slate-950/30">
        <button
          aria-label="Close auth modal"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-[#ff8a00]"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-gradient-to-br from-[#0057B8] via-[#0d72c8] to-[#ff8a00] p-8 text-white lg:block">
            <div className="grid h-13 w-13 place-items-center rounded-[7px] bg-white/15">
              {isRecruiter ? <Building2 size={26} /> : <BriefcaseBusiness size={26} />}
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-white/80">
              {isRecruiter ? 'Recruiter Workspace' : 'Candidate Access'}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight">
              {isRecruiter ? 'Hire and manage talent faster.' : 'Find verified jobs faster.'}
            </h2>
            <div className="mt-8 grid gap-3 text-sm font-semibold">
              {[
                isRecruiter ? 'Post jobs and review applications' : 'Apply to verified openings',
                isRecruiter ? 'Track recruiter verification' : 'Track applications and saved jobs',
                isRecruiter ? 'Manage company hiring dashboard' : 'Build your candidate profile',
              ].map((item) => (
                <p className="rounded-[7px] bg-white/15 px-4 py-3 ring-1 ring-white/15" key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
            <div className="pr-12">
              <h2 className="text-2xl font-black text-slate-950">
                {isRecruiter ? (isRegister ? 'Recruiter Register' : 'Recruiter Login') : isRegister ? 'Register' : 'Login'}
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {isRecruiter ? 'Access recruiter hiring tools.' : 'Access your INSEET account.'}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-[7px] bg-slate-100 p-1 text-sm font-black">
              <button
                className={!isRegister ? activeTabClass : idleTabClass}
                onClick={() => switchMode(isRecruiter ? 'recruiter-login' : 'login')}
                type="button"
              >
                Login
              </button>
              <button
                className={isRegister ? activeTabClass : idleTabClass}
                onClick={() => switchMode(isRecruiter ? 'recruiter-register' : 'register')}
                type="button"
              >
                Register
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
              <span>{isRegister ? 'Already have an account?' : 'New here?'}</span>
              <button
                className="font-black text-[#0057B8] underline-offset-4 hover:text-[#ff8a00] hover:underline"
                onClick={() => switchMode(isRecruiter ? (isRegister ? 'recruiter-login' : 'recruiter-register') : (isRegister ? 'login' : 'register'))}
                type="button"
              >
                {isRegister ? 'Login' : 'Register'}
              </button>
            </div>

            {isRecruiter ? (
              <form className="mt-5 grid gap-4" onSubmit={submitRecruiter}>
                {isRegister && (
                  <>
                    <ModalField icon={Building2} label="Company Name" onChange={(e) => updateRecruiter('companyName', e.target.value)} placeholder="Company name" required value={recruiterForm.companyName} />
                    <ModalField icon={Phone} label="Phone Number" onChange={(e) => updateRecruiter('phone', e.target.value)} placeholder="10 digit mobile number" required value={recruiterForm.phone} />
                    <ModalField icon={BriefcaseBusiness} label="Industry" onChange={(e) => updateRecruiter('industry', e.target.value)} placeholder="IT, HR, Recruitment..." value={recruiterForm.industry} />
                  </>
                )}
                <ModalField icon={Mail} label="Business Email" onChange={(e) => updateRecruiter('businessEmail', e.target.value)} placeholder="hr@company.com" required type="email" value={recruiterForm.businessEmail} />
                <ModalField icon={Lock} label="Password" onChange={(e) => updateRecruiter('password', e.target.value)} placeholder="Password" required type="password" value={recruiterForm.password} />
                {isRegister && (
                  <>
                    <ModalField icon={Lock} label="Confirm Password" onChange={(e) => updateRecruiter('confirmPassword', e.target.value)} placeholder="Confirm password" required type="password" value={recruiterForm.confirmPassword} />
                    <label className="flex items-start gap-3 rounded-[7px] bg-orange-50 p-3 text-sm font-semibold text-slate-600">
                      <input checked={recruiterForm.termsAccepted} className="mt-1" onChange={(e) => updateRecruiter('termsAccepted', e.target.checked)} type="checkbox" />
                      I agree to recruiter terms and hiring policies.
                    </label>
                  </>
                )}
                {message && <p className="rounded-[7px] bg-orange-50 p-3 text-sm font-bold text-[#bd5f00]">{message}</p>}
                <button className={submitClass} disabled={loading} type="submit">
                  {loading ? 'Please wait...' : isRegister ? 'Register Recruiter' : 'Recruiter Login'}
                </button>
              </form>
            ) : (
              <form className="mt-5 grid gap-4" onSubmit={submitCandidate}>
                {isRegister && (
                  <>
                    <ModalField icon={UserRound} label="Full Name" onChange={(e) => updateCandidate('name', e.target.value)} placeholder="Your full name" required value={candidateForm.name} />
                    <ModalField icon={Phone} label="Phone Number" onChange={(e) => updateCandidate('phone', e.target.value)} placeholder="Phone number" value={candidateForm.phone} />
                  </>
                )}
                <ModalField icon={Mail} label="Email" onChange={(e) => updateCandidate('email', e.target.value)} placeholder="you@example.com" required type="email" value={candidateForm.email} />
                <ModalField icon={Lock} label="Password" onChange={(e) => updateCandidate('password', e.target.value)} placeholder="Password" required type="password" value={candidateForm.password} />
                {message && <p className="rounded-[7px] bg-orange-50 p-3 text-sm font-bold text-[#bd5f00]">{message}</p>}
                <button className={submitClass} disabled={loading} type="submit">
                  {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const activeTabClass = 'rounded-[6px] bg-white px-3 py-2 text-[#ff8a00] shadow-sm'
const idleTabClass = 'rounded-[6px] px-3 py-2 text-slate-500 transition hover:text-slate-900'
const submitClass = 'inline-flex min-h-11 items-center justify-center rounded-[7px] bg-[#ff8a00] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#ff8a00]/20 transition hover:-translate-y-0.5 hover:bg-[#e87500] disabled:cursor-not-allowed disabled:opacity-60'

function ModalField({ icon: Icon, label, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <label>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-[7px] border border-slate-200 px-4 py-3 focus-within:border-[#ff8a00] focus-within:ring-4 focus-within:ring-orange-100">
        <Icon className="text-[#ff8a00]" size={18} />
        <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" {...props} type={isPassword && showPassword ? 'text' : type} />
        {isPassword && <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-slate-400 transition hover:text-[#ff8a00]" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
      </div>
    </label>
  )
}