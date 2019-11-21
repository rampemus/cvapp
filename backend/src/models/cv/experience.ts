import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUser } from '../user'

export interface IExperience extends Document {
    description: string,
    name: string,
    owner: IUser,
    timeFrame: {
        startDate: Date,
        endDate: Date,
    },
    id: string,
}

const experienceSchema: Schema = new Schema({
    description: { type: String, minlength: 3, required: true },
    name: { type: String, minlength: 3, required: true, unique: true },
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

experienceSchema.plugin(uniqueValidator)

const Experience = model<IExperience>('Project', experienceSchema)

export default Experience
