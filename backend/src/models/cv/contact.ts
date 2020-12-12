import { Document, model, Schema } from 'mongoose'
import { IUser } from '../user'

export interface IContact extends Document {
  owner: IUser,
  address: string,
  company: string,
  email: string,
  firstname: string,
  lastname: string,
  linkedin: string,
  phone: string,
  phoneAvailable: string,
  pictureUrl: string,
  id: string
}

const contactSchema: Schema = new Schema({
  address: String,
  company: String,
  email: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  linkedin: String,
  owner: {
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId,
  },
  phone: String,
  phoneAvailable: String,
  pictureUrl: String,
})

contactSchema.set('toJSON', {
  transform: (document: any, returnedObject: IContact) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

const Contact = model<IContact>('Contact', contactSchema)

export default Contact
