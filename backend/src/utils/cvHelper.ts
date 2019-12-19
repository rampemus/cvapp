import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae, { ICurriculumVitae } from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User, { IUser } from '../models/user'

const connectObjectToCVField = async (cv: string, field: string, object: string) => {
    switch (field) {
        case 'projects':
            await CurriculumVitae.update({ _id: cv }, { $push: { projects: object } })
            break
        case 'reference':
            await CurriculumVitae.update({ _id: cv }, { $push: { reference: object } })
            break
        case 'experience':
            await CurriculumVitae.update({ _id: cv }, { $push: { experience: object } })
            break
        case 'education':
            await CurriculumVitae.update({ _id: cv }, { $push: { education: object } })
            break
        case 'contact':
            await CurriculumVitae.update({ _id: cv }, { contact: object })
            break
        case 'profile':
            await CurriculumVitae.update({ _id: cv }, { profile: object })
            break
        case 'communication':
            await CurriculumVitae.update({ _id: cv }, { communication: object })
            break
        case 'skills':
            await CurriculumVitae.update({ _id: cv }, { skills: object })
            break
        case 'info':
            await CurriculumVitae.update({ _id: cv }, { info: object })
            break
        case 'attachments':
            await CurriculumVitae.update({ _id: cv }, { attachments: object })
            break
    }
}

const disconnectObjectFromCVField = async (cv: string, field: string, object: string) => {
    const cvFromData: ICurriculumVitae = await CurriculumVitae.findOne({ _id: cv })
    switch (field) {
        case 'projects':
            if (cvFromData.projects) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { projects: cvFromData.projects.filter((project) => project.id !== object) }
                )
            }
            break
        case 'reference':
            if (cvFromData.reference) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { reference: cvFromData.reference.filter((ref) => ref.id !== object) }
                )
            }
            break
        case 'experience':
            if (cvFromData.experience) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { experience: cvFromData.experience.filter((exp) => exp.id !== object) }
                )
            }
            break
        case 'education':
            if (cvFromData.education) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { education: cvFromData.education.filter((exp) => exp.id !== object) }
                )
            }
            break
        case 'profile':
            if (cvFromData.profile) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { profile: undefined }
                )
            }
            break
        case 'communication':
            if (cvFromData.communication) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { communication: undefined }
                )
            }
            break
        case 'contact':
            // contact is required to be defined
            break
        case 'skills':
            if (cvFromData.skills) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { skills: undefined }
                )
            }
            break
        case 'info':
            if (cvFromData.info) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { info: undefined }
                )
            }
            break
        case 'attachments':
            if (cvFromData.contact) {
                await CurriculumVitae.update(
                    { _id: cv },
                    { contact: undefined }
                )
            }
            break
    }
}

export {
    connectObjectToCVField
}
