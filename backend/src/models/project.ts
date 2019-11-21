import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUser } from './user'

export interface IProject extends Document {
    description: string,
    githubUrl: string,
    name: string,
    owner: IUser,
    showcaseUrl: string,
    thumbnailUrl: string,
    id: string,
}

const projectSchema: Schema = new Schema({
    description: { type: String, minlength: 3, required: true},
    githubUrl: String,
    name: { type: String, minlength: 3, required: true, unique: true },
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

projectSchema.plugin(uniqueValidator)

const Project = model<IProject>('Project', projectSchema)

export default Project
