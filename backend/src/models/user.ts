import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface IUser extends Document {
  name: string,
  passwordHash: string,
  username: string,
  id: string,
  created: Date,
  expires: Date,
}

const userSchema: Schema = new Schema({
  created: { type: Date, derault: Date.now},
  expires: Date,
  name: String,
  passwordHash: { type: String, required: true },
  username: { type: String, minlength: 3, required: true, unique: true },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.admin
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    return returnedObject
  }
})

userSchema.plugin(uniqueValidator)

const User = model<IUser>('User', userSchema)

export default User
