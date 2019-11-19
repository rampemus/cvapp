import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3004
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SALT = process.env.JWT_SALT
const ROOT_USERNAME = process.env.ROOT_USERNAME

export { 
    MONGODB_URI,
    PORT,
    JWT_SALT,
    ROOT_USERNAME
}
