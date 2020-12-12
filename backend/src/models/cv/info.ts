import { Document, model, Schema } from 'mongoose'
import { IUser } from '../user'

// TODO: find out if discriminatorKey 'kind' is needed
const options = { discriminatorKey: 'kind' }

export interface IInfo extends Document {
  name: string,
  id: string,
  content: string[],
  owner: IUser,
}

const infoSchema: Schema = new Schema({
  content: [String],
  name: { type: String, minlength: 3, required: true },
  owner: {
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId,
  },
}, options)

infoSchema.set('toJSON', {
  transform: (document: any, returnedObject: IInfo) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

const Info = model<IInfo>('Info', infoSchema)

export default Info
