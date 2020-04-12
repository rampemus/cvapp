import { Schema } from 'mongoose'
import Info, { IInfo } from './info'

export interface ICommunication extends IInfo {
  languages: [{
    language: string,
    level: string,
  }],
}

const Communication = Info.discriminator('Communication',
  new Schema({
    languages: [{
      language: String,
      level: String,
    }]
  }, { _id: false })
)

export default Communication
