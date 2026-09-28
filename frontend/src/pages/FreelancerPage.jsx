import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, Clock3, Eye, EyeOff, FileText, IndianRupee, Laptop, Lock, Mail, MapPin, Phone, SearchCheck, ShieldCheck, Sparkles, UserRound, UserRoundCheck, UsersRound, WalletCards, X } from 'lucide-react'
import { Button } from '../components/Button'
import { Section } from '../components/Section'
import { getDashboardPath, storeAuthSession } from '../routes/authRouting'
import { api } from '../services/api'
import freelancerHomeHeroImage from '../assets/freelancer-home-hero.png'
import freelancerProjectsHeroImage from '../assets/freelancer-projects-photo.png'

const heroSlides = [
  {
    badge: 'Verified freelance network',
    heading: 'Find Freelance Projects That Match Your Skills',
    subtitle: 'Create your freelancer profile, explore verified projects, submit proposals, and grow your independent career with INSEET.',
    primary: 'Explore Projects',
    primaryTo: '/freelancer/projects',
    secondary: 'Create Freelancer Profile',
    secondaryTo: '/freelancer-register',
    proof: ['Verified Projects', 'Flexible Work', 'Secure Client Connect', 'Pan India Opportunities'],
    visualTitle: 'Proposal-ready profile',
    cardTitle: 'React Website Revamp',
    cardMeta: 'Remote / 4 weeks / Fixed budget',
    details: [
      [Clock3, 'Fast project review'],
      [IndianRupee, 'Milestone payouts'],
      [ShieldCheck, 'Verified client connect'],
    ],
    tags: ['React', 'Tailwind', 'API', 'Remote'],
  },
  {
    badge: 'Trusted client access',
    heading: 'Work With Trusted Clients Across India',
    subtitle: 'Discover remote, hybrid, and contract-based freelance opportunities from companies looking for skilled professionals.',
    primary: 'Browse Freelance Jobs',
    primaryTo: '/freelancer/projects',
    secondary: 'View Categories',
    secondaryTo: '/freelancer/projects',
    proof: ['Remote Projects', 'Hybrid Contracts', 'Verified Clients', 'Skill-based Matching'],
    visualTitle: 'Client shortlist board',
    cardTitle: 'UI/UX Product Designer',
    cardMeta: 'Hybrid / Weekly review / Contract',
    details: [
      [Laptop, 'Flexible work mode'],
      [Clock3, 'Weekly client review'],
      [ShieldCheck, 'Verified Company Profile'],
    ],
    tags: ['Figma', 'Mobile App', 'Dashboard', 'Contract'],
  },
  {
    badge: 'Freelance career growth',
    heading: 'Build Your Freelance Career Faster',
    subtitle: 'Showcase your skills, manage proposals, track project status, and get discovered by businesses hiring freelancers.',
    primary: 'Get Started',
    primaryTo: '/freelancer-register',
    secondary: 'Login',
    secondaryTo: '/freelancer-login',
    proof: ['Portfolio Visibility', 'Proposal Tracking', 'Project Status', 'Business Discovery'],
    visualTitle: 'Career growth tracker',
    cardTitle: 'Full Stack Developer',
    cardMeta: 'Remote / MERN / Deployment',
    details: [
      [MapPin, 'Remote / Hybrid Projects'],
      [UserRoundCheck, 'Direct business discovery'],
      [WalletCards, 'Secure Project Workflow'],
    ],
    tags: ['MERN', 'Node.js', 'MongoDB', 'Deployment'],
  },
]

const freelancerSteps = [
  {
    icon: UserRoundCheck,
    title: 'Create your profile',
    text: 'Add skills, experience, portfolio links, preferred work mode, and expected project rate.',
  },
  {
    icon: SearchCheck,
    title: 'Find project work',
    text: 'Browse freelance, remote, contract, and part-time opportunities from verified companies.',
  },
  {
    icon: FileText,
    title: 'Apply with confidence',
    text: 'Share a clear proposal and track responses through your candidate workspace.',
  },
  {
    icon: WalletCards,
    title: 'Work & get paid',
    text: 'Collaborate, deliver quality work, and manage secure project payments.',
  },
]

const freelancerBenefits = [
  ['Verified freelance roles', 'Projects and contract openings from active recruiters.'],
  ['Flexible work filters', 'Remote, hybrid, part-time, short-term, and recurring work options.'],
  ['Profile-led matching', 'Skills, experience, salary, and location help companies discover you.'],
  ['Application tracking', 'Keep applied projects, saved jobs, and interview updates in one place.'],
]

export function FreelancerPage() {
  return (
    <>
      <FreelancerHeroSlider />

      <Section className="relative overflow-hidden bg-[#F7FBFF] !py-10 sm:!py-20" eyebrow="How it works" title="Start freelancing through INSEET" subtitle="A simple and transparent process to help you find the right projects and grow your freelance career.">
        <div className="pointer-events-none absolute left-6 top-10 hidden grid-cols-4 gap-3 opacity-50 lg:grid">
          {Array.from({ length: 24 }).map((_, index) => <span className="h-1.5 w-1.5 rounded-full bg-blue-300" key={index} />)}
        </div>
        <div className="pointer-events-none absolute -right-16 top-0 hidden h-44 w-44 rounded-full border-[34px] border-blue-100/70 lg:block" />
        <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {freelancerSteps.map((step, index) => {
            const Icon = step.icon
            const tones = [
              {
                badge: 'bg-[#0057B8]',
                ring: 'border-blue-300 bg-blue-50',
                icon: 'text-[#0057B8]',
                line: 'bg-[#0057B8]',
              },
              {
                badge: 'bg-[#21a943]',
                ring: 'border-green-300 bg-green-50',
                icon: 'text-[#21a943]',
                line: 'bg-[#21a943]',
              },
              {
                badge: 'bg-[#ff8a00]',
                ring: 'border-orange-300 bg-orange-50',
                icon: 'text-[#ff8a00]',
                line: 'bg-[#ff8a00]',
              },
              {
                badge: 'bg-[#6d37dc]',
                ring: 'border-violet-300 bg-violet-50',
                icon: 'text-[#6d37dc]',
                line: 'bg-[#6d37dc]',
              },
            ]
            const tone = tones[index]
            return (
              <article className="relative rounded-[7px] border border-slate-200 bg-white px-5 pb-6 pt-9 text-center shadow-xl shadow-blue-100/50 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100" key={step.title}>
                {index < freelancerSteps.length - 1 && (
                  <div className="absolute left-[calc(100%_-_12px)] top-28 z-10 hidden w-10 items-center xl:flex">
                    <span className="h-px flex-1 border-t border-dashed border-slate-300" />
                    <span className={`grid h-7 w-7 place-items-center rounded-full ${tone.badge} text-white`}>
                      <ArrowRight size={15} />
                    </span>
                  </div>
                )}
                <span className={`absolute left-1/2 top-0 grid h-10 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${tone.badge} text-sm font-black text-white shadow-lg`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={`mx-auto grid h-36 w-36 place-items-center rounded-full border ${tone.ring}`}>
                  <span className="grid h-24 w-24 place-items-center rounded-full bg-white/65">
                    <Icon className={tone.icon} size={46} strokeWidth={1.9} />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-black capitalize text-slate-950">{step.title}</h3>
                <span className={`mx-auto mt-3 block h-0.5 w-12 rounded-full ${tone.line}`} />
                <p className="mx-auto mt-5 min-h-20 max-w-[220px] text-sm font-semibold leading-6 text-slate-500">{step.text}</p>
                <div className="mt-6 flex items-center justify-center gap-3 opacity-50">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section className="relative overflow-hidden bg-[#F7FBFF] !py-10 sm:!py-20" eyebrow="Benefits" title="Why Freelancers Choose INSEET" subtitle="Discover verified projects, connect with trusted clients, manage proposals, and grow your freelance career from one powerful platform.">
        <div className="pointer-events-none absolute -left-20 top-0 hidden h-44 w-44 rounded-full bg-blue-100/70 lg:block" />
        <div className="pointer-events-none absolute right-10 top-16 hidden text-blue-500 lg:block">
          <ArrowRight size={44} className="-rotate-45" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [UsersRound, '10,000+', 'Active Freelancers', 'bg-blue-50 text-[#0057B8]'],
            [BriefcaseBusiness, '2,500+', 'Live Projects', 'bg-green-50 text-[#21a943]'],
            [Building2, '500+', 'Hiring Companies', 'bg-orange-50 text-[#ff8a00]'],
            [ShieldCheck, '95%', 'Success Rate', 'bg-violet-50 text-[#6d37dc]'],
          ].map(([Icon, value, label, tone]) => (
            <div className="flex items-center gap-5 rounded-[7px] border border-slate-200 bg-white p-5 shadow-xl shadow-blue-100/50" key={label}>
              <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-full ${tone}`}>
                <Icon size={34} />
              </span>
              <div>
                <p className={`text-4xl font-black ${String(tone).split(' ').at(-1)}`}>{value}</p>
                <p className="mt-1 text-sm font-black text-slate-950">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative min-h-[380px] overflow-hidden rounded-[7px]">
            <img
              alt="Freelancer managing proposals"
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={freelancerProjectsHeroImage}
              style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
              }}
            />
            <div className="absolute left-4 top-20 rounded-[7px] bg-white/95 p-3 shadow-xl shadow-blue-100">
              <p className="text-xs font-black text-slate-950">New Project</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">Notification</p>
            </div>
            <div className="absolute right-5 top-48 rounded-[7px] bg-white/95 p-3 shadow-xl shadow-blue-100">
              <p className="text-xs font-black text-slate-950">Proposal</p>
              <p className="mt-1 text-[11px] font-semibold text-emerald-600">Accepted</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              [UserRoundCheck, 'Profile & Portfolio', 'Create a professional profile, showcase your skills, experience and past work.', 'text-[#0057B8] bg-blue-50'],
              [SearchCheck, 'Smart Project Matching', 'Get projects matched to your skills and preferences from verified companies.', 'text-[#21a943] bg-green-50'],
              [ArrowRight, 'Proposal Management', 'Send proposals, track responses and communicate with clients in one place.', 'text-[#ff8a00] bg-orange-50'],
              [Lock, 'Secure Payments', 'Work confidently with verified clients and get paid through secure transactions.', 'text-[#6d37dc] bg-violet-50'],
            ].map(([Icon, title, text, tone]) => (
              <article className="rounded-[7px] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/50 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100" key={title}>
                <div className="flex gap-5">
                  <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-[18px] ${tone}`}>
                    <Icon size={36} strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{text}</p>
                    <span className={`mt-5 block h-0.5 w-12 rounded-full ${title.includes('Matching') ? 'bg-[#21a943]' : title.includes('Proposal') ? 'bg-[#ff8a00]' : title.includes('Payments') ? 'bg-[#6d37dc]' : 'bg-[#0057B8]'}`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-9 flex max-w-5xl flex-col gap-4 rounded-full border border-slate-200 bg-white p-4 shadow-xl shadow-blue-100/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#0057B8]">
              <Sparkles size={22} />
            </span>
            <p className="text-sm font-semibold text-slate-600 sm:text-base">Join thousands of freelancers already building their career with INSEET.</p>
          </div>
          <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[7px] bg-[#0057B8] px-8 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-[#004694]" to="/freelancer-register">
            Join Now <ArrowRight size={18} />
          </Link>
        </div>
      </Section>
    </>
  )
}

export function FreelancerRegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#eef8ff]">
      <FreelancerRegisterModal onClose={() => navigate('/freelancer')} />
    </div>
  )
}

function FreelancerHeroSlider() {
  const [active, setActive] = useState(0)
  const [registerOpen, setRegisterOpen] = useState(false)
  const slide = heroSlides[active]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  const previousSlide = () => setActive((active + heroSlides.length - 1) % heroSlides.length)
  const nextSlide = () => setActive((active + 1) % heroSlides.length)

  return (
    <>
    <section className="relative isolate overflow-hidden bg-[#eef8ff]">
      <div className="relative mx-auto grid max-w-[1536px] gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid overflow-hidden bg-[linear-gradient(120deg,#eef8ff_0%,#ffffff_50%,#fff4e6_100%)] md:min-h-[430px] md:grid-cols-[0.46fr_0.54fr] lg:min-h-[460px]">
          <div className="relative z-10 flex flex-col justify-center px-4 py-6 sm:px-8 lg:px-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff8a00]">{slide.badge}</p>
            <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight text-[#0057b8] sm:text-5xl lg:mt-4 lg:text-[46px]">
              {active === 0 ? 'Start Freelancing From Home' : slide.heading}
            </h1>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7 lg:mt-4">
              {active === 0 ? 'Work with trusted projects, earn online, and grow your skills with INSEET.' : slide.subtitle}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-[7px] bg-[#ff8a00] px-6 text-sm font-black text-white transition hover:bg-[#e87500]"
                onClick={() => setRegisterOpen(true)}
                type="button"
              >
                Register New
              </button>
              {slide.primaryTo !== '/freelancer-register' && (
                <Link className="inline-flex min-h-10 items-center justify-center rounded-[7px] border border-[#ff8a00] bg-[white] px-5 text-sm font-black text-black transition hover:bg-[#fff4e6]" to={slide.primaryTo}>
                  {slide.primary}
                </Link>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-7">
              <button className="grid h-8 w-8 place-items-center rounded-full border border-[#ff8a00] bg-[white] text-[#ff8a00]" onClick={previousSlide} type="button" aria-label="Previous freelancer slide">
                <ArrowLeft size={15} />
              </button>
              <div className="flex items-center gap-2">
                {heroSlides.map((item, index) => (
                  <button
                    aria-label={`Show ${item.badge}`}
                    className={`h-2 rounded-full transition-all ${active === index ? 'w-8 bg-[#ff8a00]' : 'w-2 bg-[#ffd7ad] hover:bg-[#ffbf80]'}`}
                    key={item.badge}
                    onClick={() => setActive(index)}
                    type="button"
                  />
                ))}
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-full border border-[#ff8a00] bg-[white] text-[#ff8a00]" onClick={nextSlide} type="button" aria-label="Next freelancer slide">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="relative min-h-[230px] overflow-hidden bg-[#fff4e6] sm:min-h-[300px] md:min-h-full">
            <img
              alt="Start freelancing from home"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[76%_50%] sm:scale-[1.16] sm:object-[80%_50%]"
              src={freelancerHomeHeroImage}
            />
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/85 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fff4e6] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#eef8ff]/80 to-transparent md:hidden" />
          </div>
        </div>

        <div className="relative hidden min-h-[380px] place-items-center bg-[#f6fbff] px-5 py-8 sm:min-h-[460px] lg:grid lg:px-6">
          <div className="w-full max-w-[340px] rounded-[7px] bg-white shadow-lg shadow-slate-400/25">
            <div className="grid grid-cols-2 border-b border-slate-200 text-center text-sm">
              <Link className="border-b-4 border-[#ff8a00] py-4 font-semibold text-[#0057b8]" to="/freelancer-login">Login/Sign up</Link>
              <button className="border-l border-slate-200 py-4 font-semibold text-slate-950" onClick={() => setRegisterOpen(true)} type="button">Register</button>
            </div>
            <div className="px-9 pb-5 pt-4">
              <label className="grid gap-1 text-xs font-medium text-slate-950">
                Username
                <input className="h-10 rounded-[7px] border border-slate-300 px-3 text-sm font-semibold outline-none focus:border-[#ff8a00]" placeholder="Enter Username" />
              </label>
              <label className="mt-3 grid gap-1 text-xs font-medium text-slate-950">
                Password
                <span className="relative">
                  <input className="h-10 w-full rounded-[7px] border border-slate-300 px-3 pr-10 text-sm font-semibold outline-none focus:border-[#ff8a00]" placeholder="Enter your password" type="password" />
                  <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </span>
              </label>
              <Link className="mt-3 block text-right text-sm font-semibold text-[#0057b8]" to="/freelancer-login">Forgot Password?</Link>
              <Link className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-[7px] bg-[#ff8a00] text-sm font-black text-white transition hover:bg-[#e87500]" to="/freelancer-login">
                Login
              </Link>
              <div className="mt-4 border-t border-slate-200 pt-5 text-center text-sm text-slate-950">
                New User? <button className="font-black text-[#0057b8]" onClick={() => setRegisterOpen(true)} type="button">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {registerOpen && <FreelancerRegisterModal onClose={() => setRegisterOpen(false)} />}
    </>
  )
}

function FreelancerRegisterModal({ onClose }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', meta: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = await api.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'freelancer',
      })
      storeAuthSession(payload)
      onClose()
      navigate(getDashboardPath(payload.data.role))
    } catch (error) {
      setMessage(error.message || 'Freelancer registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/60 px-4 py-5 backdrop-blur-sm">
      <div className="relative w-full max-w-[760px] overflow-hidden rounded-[8px] bg-white shadow-2xl shadow-slate-950/30">
        <button
          aria-label="Close freelancer register"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow ring-1 ring-slate-200 transition hover:text-[#ff8a00]"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
        <div className="grid lg:grid-cols-[0.78fr_1fr]">
          <div className="hidden bg-gradient-to-br from-[#0057b8] via-[#0d72c8] to-[#ff8a00] p-6 text-white lg:block">
            <div className="grid h-11 w-11 place-items-center rounded-[7px] bg-white/15">
              <BriefcaseBusiness size={22} />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/80">Freelancer Access</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Create your freelancer account.</h2>
            <div className="mt-6 grid gap-2 text-sm font-semibold">
              {['Verified projects', 'Proposal tracking', 'Client discovery'].map((item) => (
                <p className="rounded-[7px] bg-white/15 px-3 py-2.5 ring-1 ring-white/15" key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-6">
            <div className="pr-12">
              <h2 className="text-xl font-black text-slate-950">Register</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Freelancer access portal.</p>
            </div>

            <form className="mt-5 grid gap-3" onSubmit={submit}>
              <FreelancerModalField icon={UserRound} label="Full Name" onChange={(event) => update('name', event.target.value)} placeholder="Your full name" required value={form.name} />
              <FreelancerModalField icon={Phone} label="Phone" onChange={(event) => update('phone', event.target.value)} placeholder="Phone number" value={form.phone} />
              <FreelancerModalField icon={UserRoundCheck} label="Primary Skill" onChange={(event) => update('meta', event.target.value)} placeholder="React developer, designer, writer" value={form.meta} />
              <FreelancerModalField icon={Mail} label="Email" onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" required type="email" value={form.email} />
              <FreelancerModalField icon={Lock} label="Password" onChange={(event) => update('password', event.target.value)} placeholder="Password" required type="password" value={form.password} />
              {message && <p className="rounded-[7px] bg-orange-50 p-3 text-sm font-bold text-[#bd5f00]">{message}</p>}
              <button className="inline-flex min-h-10 items-center justify-center rounded-[7px] bg-[#ff8a00] px-5 py-2 text-sm font-black text-white shadow-lg shadow-[#ff8a00]/20 transition hover:-translate-y-0.5 hover:bg-[#e87500] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} type="submit">
                {loading ? 'Please wait...' : 'Create Freelancer Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function FreelancerModalField({ icon: Icon, label, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <label>
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <div className="mt-1.5 flex items-center gap-3 rounded-[7px] border border-slate-200 px-3 py-2.5 focus-within:border-[#ff8a00] focus-within:ring-4 focus-within:ring-orange-100">
        <Icon className="text-[#0057b8]" size={17} />
        <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" {...props} type={isPassword && showPassword ? 'text' : type} />
        {isPassword && <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-slate-400 transition hover:text-[#ff8a00]" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
      </div>
    </label>
  )
}