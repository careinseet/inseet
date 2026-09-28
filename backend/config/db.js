const mongoose = require('mongoose')

async function connectDB() {
  const mongoUri = buildMongoUri(process.env.MONGO_URI || process.env.MONGODB_URI)

  if (!mongoUri) {
    throw new Error('MONGO_URI (or MONGODB_URI) is required. Copy .env.example to .env and set MongoDB connection string.')
  }

  const dbName = getMongoDbName(mongoUri)
  const connection = await mongoose.connect(mongoUri, dbName ? { dbName } : {})
  console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`)
}

function buildMongoUri(mongoUri) {
  const normalizedUri = normalizeMongoUri(mongoUri)
  const username = String(process.env.MONGO_USERNAME || '').trim()
  const password = String(process.env.MONGO_PASSWORD || '').trim()

  if (!normalizedUri || !username || !password) return normalizedUri

  try {
    const parsed = new URL(normalizedUri)

    if (parsed.username || parsed.password) return normalizedUri

    parsed.username = username
    parsed.password = password
    return parsed.toString()
  } catch {
    return normalizedUri
  }
}

function normalizeMongoUri(mongoUri) {
  const value = String(mongoUri || '').trim()
  const match = value.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/i)

  if (!match) return value

  const [, protocol, rest] = match
  const slashIndex = rest.indexOf('/')
  const authority = slashIndex >= 0 ? rest.slice(0, slashIndex) : rest
  const tail = slashIndex >= 0 ? rest.slice(slashIndex) : ''
  const lastAt = authority.lastIndexOf('@')

  if (lastAt <= 0 || authority.indexOf('@') === lastAt) return value

  const credentials = authority.slice(0, lastAt).replace(/@/g, '%40')
  const host = authority.slice(lastAt + 1)
  return `${protocol}${credentials}@${host}${tail}`
}

function getMongoDbName(mongoUri) {
  if (process.env.MONGO_DB_NAME) return process.env.MONGO_DB_NAME

  try {
    const parsed = new URL(mongoUri)
    const dbName = parsed.pathname.replace(/^\/+/, '').split('/')[0]
    return dbName || 'inseetjobportal'
  } catch {
    return 'inseetjobportal'
  }
}

module.exports = connectDB
