import bcrypt from 'bcrypt'
import User, { IUser } from '../models/user'
import { ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME } from './config'

const userExists = async ( username: string ) => {
    const users = await User.find({ username })
    if (users.length === 0) {
        return false
    }
    return true
}

const createRootUser = async () => {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(ROOT_PASSWORD, saltRounds)

    const rootUser = await new User({
        name: ROOT_NAME,
        passwordHash,
        username: ROOT_USERNAME,
    })

    const savedUser = await rootUser.save()
    console.log('Root user created')
}

export {
    createRootUser,
    userExists,
}
