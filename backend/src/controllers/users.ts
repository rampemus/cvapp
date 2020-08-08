import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import CurriculumVitae from '../models/cv/cv'
import User from '../models/user'
import { ROOT_USERNAME } from '../utils/config'
import { IRequestWithIdentity } from '../utils/middleware'
import {
  getUserByUsername,
  ownerId,
  randomPassword,
  randomUserName,
  userIsRootUser
} from '../utils/userHelper'
import { NewUserRequestSchema, objectId, UserChangesSchema, validationErrorSend } from '../utils/validators'

const usersRouter = Router()

usersRouter.get('/', async (request: IRequestWithIdentity, response: Response) => {
  if (request.userGroup === 'admin') {
    return response.json(await User.find({}))
  }
  const username: string = request.username
  const user = await getUserByUsername(username)
  const users = await User.find({
    $or: [
      { owner: user._id },
      { _id: user._id },
      { username: ROOT_USERNAME }
    ]
  })
  response.json(users)
})

usersRouter.post('/owner', async (request: IRequestWithIdentity, response: Response) => {
  const id: string = request.body.id
  validationErrorSend(response, objectId.validate(id))

  const user = await User.findOne({ _id: id })
  if (!user) {
    return response.status(404).send({ error: 'User not found' }).end()
  }

  if (user.username === ROOT_USERNAME) {
    return response.status(200).json(user).end()
  }
  const owner = await User.findOne({ _id: user.owner + '' })

  return response.status(200).json(owner).end()
})

interface INewUserBody {
  name: string,
  username: string,
  password: string,
  expires: Date | null
}

usersRouter.post('/', async (request: IRequestWithIdentity, response: Response) => {

  const makeRandomUser = !request.body.name && !request.body.username && !request.body.password

  const body: INewUserBody = makeRandomUser ? {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // valid for a month
    name: 'noname',
    password: randomPassword(10),
    username: randomUserName(),
  } : request.body

  const validationResult = NewUserRequestSchema.validate(body)
  if (!validationErrorSend(response, validationResult)) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const owner = await User.findOne({ _id: request.userid })

    if (!owner) {
      response.status(404).json({ error: 'Invalid token' }).end()
    }

    let expires = null // prevent created user to live longer than it's owner
    if (owner.expires && body.expires) {
      expires = (owner.expires > body.expires) ? body.expires : owner.expires
    } else {
      expires = owner.expires ? owner.expires : body.expires
    }

    const user = new User({
      created: new Date(),
      expires,
      name: body.name,
      owner,
      passwordHash,
      username: body.username,
    })

    const savedUser = await user.save()
      .catch((error) => {
        const errorResponse = error.message
        return response.status(400).json({
          error: errorResponse
        }).end()
      })

    if (savedUser) {
      await CurriculumVitae.updateOne({ default: owner._id }, { $push: { default: savedUser } })

      return response.status(201).json(makeRandomUser ? {
        created: user.created,
        name: user.name,
        password: body.password,
        username: user.username,
      } : savedUser).end()
    }
  }
})

export interface IUserChanges {
  id: string,
  changes: {
    name?: string,
    username?: string,
    password?: string,
    newPassword?: string,
    expires?: Date | null,
    passwordHash?: string
  }
}

usersRouter.put('/', async (request: IRequestWithIdentity, response: Response) => {
  const validationResult = UserChangesSchema.validate(request.body)
  if (!validationErrorSend(response, validationResult)) {

    const id = request.body.id

    const saltRounds = 10
    const body: IUserChanges['changes'] = {
      ...request.body.changes,
      passwordHash: request.body.changes.newPassword
        ? await bcrypt.hash(request.body.changes.newPassword + '', saltRounds)
        : undefined
    }

    const user = await User.findOne({ _id: id }).populate('owner')

    if (!(
      request.userGroup === 'admin'
      || id === user._id + ''
      || request.username === user.owner.username
    )) {
      return response.status(401).send({
        error: 'Admin authorization needed'
      }).end()
    }

    if (body.expires !== undefined && request.userGroup !== 'admin') {
      return response.status(401).send({
        error: 'Admin authorization needed for changing expire date'
      }).end()
    }

    const passwordCorrect = !body.newPassword ? true : user // password needed only for newPassword
      ? await bcrypt.compare(body.password + '', user.passwordHash)
      : await bcrypt.hash(body.password + '', 10)

    if (user && !passwordCorrect) {
      return response.status(401).send({
        error: 'Invalid old password',
      }).end()
    }

    if (!body.passwordHash) { delete body.passwordHash }
    delete body.newPassword
    delete body.password

    const updatedUser = await User.findOneAndUpdate({ _id: user._id + '' }, body)
      .catch((error) => {
        return response.status(400).send({ error: error.message }).end()
      })

    return response.status(200).json(updatedUser)
  }
})

usersRouter.delete('/:id', async (request: IRequestWithIdentity, response: Response) => {

  validationErrorSend(response, objectId.validate(request.params.id))

  const userHasPermission = request.userGroup === 'admin'   // allowed to admin
    || request.userid === request.params.id         // allowed to delete themselves
    || await ownerId(request.params.id) === request.userid  // allowed to delete children
  if (!userHasPermission) {
    return response.status(401).json({ error: 'Authorization error: Admin permissions needed' }).end()
  }

  if (await userIsRootUser(request.params.id)) { // Impossible to remove root_user
    return response.status(400).json({ error: 'Root user cannot be deleted' }).end()
  }

  try {

    if (!await User.exists({ _id: request.params.id })) {
      response.status(404).json({ error: 'User does not exist' }).end()
    }

    // TODO: find user references and delete them
    await CurriculumVitae.updateMany({ default: request.params.id }, { $pull: { default: request.params.id } })

    await User.deleteOne({ _id: request.params.id })

    return response.status(204).end()
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

export default usersRouter
