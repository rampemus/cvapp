import { Document, model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUser } from '../user'
import { ICommunication } from './communication'
import { IContact } from './contact'
import { IExperience } from './experience'
import { IInfo } from './info'
import { IProfile } from './profile'

export interface ICurriculumVitae extends Document {
    owner: IUser
    name: string,
    contact: IContact,
    profile: IProfile,
    reference: IContact[],
    experience: IExperience[],
    education: IExperience[],
    communication: ICommunication,
    skills: IInfo,
    info: IInfo,
    attachments: IInfo,
}

const cvSchema: Schema = new Schema({
    attachments: [{
        ref: 'Info',
        type: Schema.Types.ObjectId,
    }],
    communication: [{
        ref: 'Communication',
        type: Schema.Types.ObjectId,
    }],
    contact: {
        ref: 'Contact',
        required: true,
        type: Schema.Types.ObjectId,
    },
    education: [{
        ref: 'Experience',
        type: Schema.Types.ObjectId,
    }],
    experience: [{
        ref: 'Experience',
        type: Schema.Types.ObjectId,
    }],
    info: [{
        ref: 'Info',
        type: Schema.Types.ObjectId,
    }],
    name: String,
    owner: {
        ref: 'User',
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
    skills: [{
        ref: 'Info',
        type: Schema.Types.ObjectId,
    }],

})

cvSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        return returnedObject
    }
})

cvSchema.plugin(uniqueValidator)

const CurriculumVitae = model<ICurriculumVitae>('CurriculumVitae', cvSchema)

export default CurriculumVitae
