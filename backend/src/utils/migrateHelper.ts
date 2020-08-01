import Experience from '../models/cv/experience'
import Project from '../models/cv/project'

// TODO: make these work with multiple instances in collections
export const migrateExperienceDescriptionsToContent = async () => {
  const experiences: any = await Experience.find({ description: { $exists: true } })
  for (const experience of experiences) {
    const modifiedExperience = {
      ...experience._doc,
      content: [experience.description],
      description: undefined,
      owner: experience.owner,
    }
    await Experience.update({ _id: modifiedExperience._id }, modifiedExperience)
  }
}

export const migrateProjectDescriptionsToContent = async () => {
  const projects: any = await Project.find({ description: { $exists: true } })
  for (const project of projects) {
    const modifiedProject = {
      ...project._doc,
      content: [project.description],
      description: undefined,
      owner: project.owner,
    }
    await Project.update({ _id: modifiedProject._id }, modifiedProject)
  }
}
