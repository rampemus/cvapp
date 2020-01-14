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

const getUserByUsername = async (username: string) => {
    const user = await User.findOne({ username })
    return user
}

const getUserById = async (id: string) => {
    const user = await User.findOne({ _id: id })
    return user
}

const ownerId = async (userId: string) => {
    const user = await User.findOne({ _id: userId })
    return user.owner.id
}

const userIsRootUser = async (id: string) => {
    const user = await User.findOne({ _id: id })
    return user.username === ROOT_USERNAME
}

const createRootUser = async () => {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(ROOT_PASSWORD, saltRounds)

    const rootUser = await new User({
        created: new Date(),
        name: ROOT_NAME,
        passwordHash,
        username: ROOT_USERNAME,
    })

    const savedUser = await rootUser.save()
}

export {
    createRootUser,
    userExists,
    getUserByUsername,
    getUserById,
    userIsRootUser,
    ownerId
}
