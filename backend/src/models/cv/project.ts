import { Document, model, Schema } from 'mongoose'
import { IUser } from '../user'

export interface IProject extends Document {
  content: string[],
  githubUrl: string,
  name: string,
  owner: IUser,
  showcaseUrl: string,
  thumbnailUrl: string,
  id: string,
}

const projectSchema: Schema = new Schema({
  content: [String],
  githubUrl: String,
  name: { type: String, minlength: 3, required: true },
  owner: {
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId,
  },
  showcaseUrl: String,
  thumbnailUrl: String,
})

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

const Project = model<IProject>('Project', projectSchema)

export default Project
