import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3004
const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI :
  (process.env.NODE_ENV === 'development' ? process.env.MONGODB_URI_DEVELOPMENT :
    process.env.MONGODB_URI_TEST)
const JWT_SALT = process.env.JWT_SALT
const ROOT_USERNAME = process.env.ROOT_USERNAME
const ROOT_PASSWORD = process.env.ROOT_PASSWORD
const ROOT_NAME = process.env.ROOT_NAME
const TESTUSER_USERNAME = process.env.TESTUSER1_USERNAME || 'testuser'
const TESTUSER_PASSWORD = process.env.TESTUSER1_PASSWORD || 'password'
const TESTUSER_NAME = process.env.TESTUSER1_NAME || 'username'

const PASSWORD_DIGITS = process.env.PASSWORD_DIGITS

if (!ROOT_USERNAME || !ROOT_PASSWORD || !ROOT_NAME) {
  console.log('Root user environment variables are missing')
  process.exit(1)
}

if (!PASSWORD_DIGITS) {
  console.log('Need abcdef... string for password digits')
}

export {
  MONGODB_URI,
  PORT,
  JWT_SALT,
  ROOT_USERNAME,
  ROOT_PASSWORD,
  ROOT_NAME,
  TESTUSER_USERNAME,
  TESTUSER_PASSWORD,
  TESTUSER_NAME,
  PASSWORD_DIGITS
}
