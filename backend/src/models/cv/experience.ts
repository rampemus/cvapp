import { Document, model, Schema } from 'mongoose'
import { IUser } from '../user'

export interface IExperience extends Document {
  content: string[],
  name: string,
  owner: IUser,
  timeFrame: {
    startDate: Date,
    endDate: Date,
  },
  id: string,
}

const experienceSchema: Schema = new Schema({
  content: [String],
  name: { type: String, minlength: 3, required: true },
  owner: {
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId,
  },
  timeFrame: {
    endDate: Date,
    startDate: Date,
  },
})

experienceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

const Experience = model<IExperience>('Experience', experienceSchema)

export default Experience
