import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IContact } from './contact'
import { IProfile } from './profile'
import { IUser } from './user'

export interface ICurriculumVitae extends Document {
    owner: IUser
    name: string,
    contact: IContact,
    profile: IProfile,
    reference: IContact[],
    experience: string[],
    education: string[],
    communication: string,
    skills: string,
    info: string,
    attachments: string[],
}

const cvSchema: Schema = new Schema({
    owner: {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
    },
    name: String,
    contact: {
        ref: 'Contact',
        required: true,
        type: Schema.Types.ObjectId,
    },
    profile: {
        ref: 'Profile',
        type: Schema.Types.ObjectId,
    },
    reference: [{
        ref: 'Contact',
        type: Schema.Types.ObjectId,
    }],
    experience: [String],
    education: [String],
    communication: String,
    skills: String,
    info: String,
    attachments: [String],

})

cvSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.admin
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        return returnedObject
    }
})

cvSchema.plugin(uniqueValidator)

const CurriculumVitae = model<ICurriculumVitae>('CurriculumVitae', cvSchema)

export default CurriculumVitae
