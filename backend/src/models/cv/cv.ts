import { Document, model, Schema } from 'mongoose'
import { IUser } from '../user'
import { ICommunication } from './communication'
import { IContact } from './contact'
import { IExperience } from './experience'
import { IInfo } from './info'
import { IProfile } from './profile'
import { IProject } from './project'

export interface ICurriculumVitae extends Document {
  id: string,
  owner: IUser,
  default?: IUser[],
  name: string,
  linkedin: string,
  github: string,
  techlist: string,
  contact: IContact,
  profile: IProfile,
  projects: IProject[],
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
  default: [{
    ref: 'User',
    type: Schema.Types.ObjectId,
  }],
  education: [{
    ref: 'Experience',
    type: Schema.Types.ObjectId,
  }],
  experience: [{
    ref: 'Experience',
    type: Schema.Types.ObjectId,
  }],
  github: String,
  info: [{
    ref: 'Info',
    type: Schema.Types.ObjectId,
  }],
  linkedin: String,
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
  projects: [{
    ref: 'Project',
    type: Schema.Types.ObjectId
  }],
  reference: [{
    ref: 'Contact',
    type: Schema.Types.ObjectId,
  }],
  skills: [{
    ref: 'Info',
    type: Schema.Types.ObjectId,
  }],
  techlist: String,
})

cvSchema.set('toJSON', {
  transform: (document: any, returnedObject: ICurriculumVitae) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.default
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

const CurriculumVitae = model<any>('CurriculumVitae', cvSchema)

export default CurriculumVitae
