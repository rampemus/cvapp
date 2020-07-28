import mongodb from 'mongodb'
import Experience, { IExperience } from '../models/cv/experience'
import Project, { IProject } from '../models/cv/project'
import { MONGODB_URI, ROOT_USERNAME } from './config'

export const migrateExperienceDescriptionsToContent = async () => {
  const experience: any = await Experience.findOne({ description: { $exists: true } })
  const modifiedExperience = {
    ...experience._doc,
    content: [experience.description],
    description: undefined,
    owner: experience.owner,
  }
  await Experience.update({ _id: modifiedExperience._id }, modifiedExperience)
}

export const migrateProjectDescriptionsToContent = async () => {
  const project: any = await Project.findOne({ description: { $exists: true } })
  const modifiedProject = {
    ...project._doc,
    content: [project.description],
    description: undefined,
    owner: project.owner,
  }
  await Project.update({ _id: modifiedProject._id }, modifiedProject)
}
