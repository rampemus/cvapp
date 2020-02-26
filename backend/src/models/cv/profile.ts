import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUser } from '../user'

export interface IProfile extends Document {
    name: string,
    id: string,
    content: string[],
    owner: IUser,
}

const profileSchema: Schema = new Schema({
    content: [String],
    name: { type: String, minlength: 3, required: true },
    owner: {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
    },
})

profileSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

profileSchema.plugin(uniqueValidator)

const Profile = model<IProfile>('Profile', profileSchema)

export default Profile
