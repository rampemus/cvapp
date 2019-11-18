import { Router } from 'express'
import User from '../models/user'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

export default usersRouter
