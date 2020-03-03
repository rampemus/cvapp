import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface IUser extends Document {
  name: string,
  passwordHash: string,
  username: string,
  id: string,
  created: Date,
  expires?: Date,
  owner?: IUser,
}

const userSchema: Schema = new Schema({
  created: { type: Date, required: true },
  expires: Date,
  name: String,
  owner: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  passwordHash: { type: String, required: true },
  username: { type: String, minlength: 4, required: true, unique: true },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.admin
    delete returnedObject.owner
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    return returnedObject
  }
})

userSchema.plugin(uniqueValidator)

const User = model<IUser>('User', userSchema)

export default User
