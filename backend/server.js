require('dotenv').config()

const deadLocalProxyPattern = /^https?:\/\/127\.0\.0\.1:9\/?$/i
const proxyEnvKeys = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']

proxyEnvKeys.forEach((key) => {
  if (deadLocalProxyPattern.test(process.env[key] || '')) {
    delete process.env[key]
  }
})

const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const apiRoutes = require('./routes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const { mongoSanitize, requireJwtSecret } = require('./middleware/securityMiddleware')

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://www.inseet.in',
  'https://inseet.in',
].filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (process.env.NODE_ENV !== 'production' && /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/i.test(origin)) return true
  return false
}

requireJwtSecret()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }),
)
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`))
      }
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
}))
app.use(mongoSanitize)
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT || 500),
    skip: (req) => req.path.startsWith('/api/pricing-packages'),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
)

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'INSEET API is running',
    health: '/api/health',
  })
})
app.use('/api', apiRoutes)
app.use(notFound)
app.use(errorHandler)

async function startServer() {
  await connectDB()
  app.listen(port, () => console.log(`API running on port ${port}`))
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}

module.exports = app
