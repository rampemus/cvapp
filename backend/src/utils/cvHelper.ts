import Communication from '../models/cv/communication'
import Contact from '../models/cv/contact'
import CurriculumVitae from '../models/cv/cv'
import Experience from '../models/cv/experience'
import Info from '../models/cv/info'
import Profile from '../models/cv/profile'
import Project from '../models/cv/project'
import User from '../models/user'
import { ROOT_USERNAME } from './config'
import { createRootUser, getUserByUsername, userExists } from './userHelper'

const connectObjectToCVField = async (cv: string, field: string, object: string) => {
    switch (field) {
        case 'projects':
            await CurriculumVitae.updateOne({ _id: cv }, { $push: { projects: object } })
            break
        case 'reference':
            await CurriculumVitae.updateOne({ _id: cv }, { $push: { reference: object } })
            break
        case 'experience':
            await CurriculumVitae.updateOne({ _id: cv }, { $push: { experience: object } })
            break
        case 'education':
            await CurriculumVitae.updateOne({ _id: cv }, { $push: { education: object } })
            break
        case 'contact':
            await CurriculumVitae.updateOne({ _id: cv }, { contact: object })
            break
        case 'profile':
            await CurriculumVitae.updateOne({ _id: cv }, { profile: object })
            break
        case 'communication':
            await CurriculumVitae.updateOne({ _id: cv }, { communication: object })
            break
        case 'skills':
            await CurriculumVitae.updateOne({ _id: cv }, { skills: object })
            break
        case 'info':
            await CurriculumVitae.updateOne({ _id: cv }, { info: object })
            break
        case 'attachments':
            await CurriculumVitae.updateOne({ _id: cv }, { attachments: object })
            break
    }
}

const disconnectObjectFromCVField = async (cv: string, field: string, object: string) => {
    const cvFromData: any = await CurriculumVitae.findOne({ _id: cv })
    switch (field) {
        case 'projects':
            if (cvFromData.projects) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { projects: cvFromData.projects.filter((project: any) => project._id + '' !== object) }
                )
            }
            break
        case 'reference':
            if (cvFromData.reference) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { reference: cvFromData.reference.filter((ref: any) => ref._id + '' !== object) }
                )
            }
            break
        case 'experience':
            if (cvFromData.experience) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { experience: cvFromData.experience.filter((exp: any) => exp._id + '' !== object) }
                )
            }
            break
        case 'education':
            if (cvFromData.education) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { education: cvFromData.education.filter((exp: any) => exp._id + '' !== object) }
                )
            }
            break
        case 'profile':
            if (cvFromData.profile) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { profile: undefined }
                )
            }
            break
        case 'communication':
            if (cvFromData.communication && cvFromData.communication[0]._id + '' === object) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { communication: undefined }
                )
            }
            break
        case 'contact':
            // contact is required to be defined
            break
        case 'skills':
            if (cvFromData.skills && cvFromData.skills[0]._id + '' === object ) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { skills: undefined }
                )
            }
            break
        case 'info':
            if (cvFromData.info && cvFromData.info[0]._id + '' === object ) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { info: undefined }
                )
            }
            break
        case 'attachments':
            if (cvFromData.attachments && cvFromData.attachments[0]._id + '' === object ) {
                await CurriculumVitae.updateMany(
                    { _id: cv },
                    { attachments: undefined }
                )
            }
            break
    }
}

const generateTestCV = async (username: string) => {
    const owner = await User.findOne({ username })

    const contact = new Contact({
        address: 'Testaavankatu 23, 80200 Jopensuu',
        company: 'Great company',
        email: 'testaava.testi@testaus.net',
        firstname: 'Teppo',
        lastname: 'Testaavainen',
        linkedin: 'https://www.linkedin.com/in/test',
        owner,
        phone: '0452478903',
        phoneAvailable: 'always',
    })
    const savedContact = await contact.save()

    const reference = new Contact({
        address: 'Tuikitavallinen 1, 00100 Helsinki',
        company: 'Important company',
        email: 'testattu.tasti@test.com',
        firstname: 'Petri',
        lastname: 'Pomo',
        owner,
        phone: '050974417869',
        phoneAvailable: 'During holidays 1pm-4pm',
    })
    const savedReference = await reference.save()

    const profile = new Profile({
        content: ['Many feelings of feeling the feels of feeling may lead to feel a alot.', 'Note that there is feelings that are felt many times of feelings that the feelings create'],
        name: 'Feelgoodjob profile',
        owner
    })
    const savedProfile = await profile.save()

    const experience = new Experience({
        description: 'Many job done',
        name: 'The average job',
        owner,
        timeFrame: {
            endDate: new Date(),
            startDate: new Date(),
        },
    })
    const savedExperience = await experience.save()

    const education = new Experience({
        description: 'Many studies done',
        name: 'The basic degree',
        owner,
        timeFrame: {
            endDate: new Date(),
            startDate: new Date(),
        }
    })
    const savedEducation = await education.save()

    const communication = new Communication({
        content: ['I speak as Im spoken of that I spoke what I speak'],
        languages: [
            {
                language: 'English',
                level: 'Fluent',
            },
            {
                language: 'Spook',
                level: 'Spok',
            }
        ],
        name: 'Bilanguagelist',
        owner,
    })
    const savedCommunication = await communication.save()

    const skills = new Info({
        content: ['A lot of social superskills'],
        name: 'Social skills',
        owner,
    })
    const savedSkills = await skills.save()

    const info = new Info({
        content: ['Can drive a car, a boat, a truck and a plane', 'All that with just a one hand!'],
        name: 'Driving info',
        owner
    })
    const savedInfo = await info.save()

    const attachments = new Info({
        content: ['Certificate of studies', 'certificate of driving', 'Certificate of trucks'],
        name: 'Certificates and that short of things',
        owner
    })
    const savedAttachments = await attachments.save()

    const project = new Project({
        description: 'Project that will be soon finished',
        githubUrl: 'https://github.com/rampemus/cvapp',
        name: 'CV project',
        owner,
        showcaseUrl: 'http://localhost:3000/',
        thumbnailUrl: 'logo.svg',
    })
    const savedProject = await project.save()

    const cv = new CurriculumVitae({
        attachments: savedAttachments,
        communication: savedCommunication,
        contact: savedContact,
        education: [savedEducation],
        experience: [savedExperience],
        github: 'https://github.com/rampemus',
        info: savedInfo,
        name: 'Testing cv',
        owner,
        profile: savedProfile,
        projects: [savedProject],
        reference: [savedReference],
        skills: savedSkills,
        techlist: 'Java, Python, CSS, C#, Angular',
    })
    const savedCV = await cv.save()

    return savedCV
}

const userIsCVOwner = async ( username: string ) => {
    const user = await getUserByUsername(username)
    const cvs = await CurriculumVitae.find({ owner: user._id + '' }).populate('owner')
    return cvs.length > 0
}

const initializeRootUserAndCV = async () => {
    if (!await userExists(ROOT_USERNAME)) {
        await createRootUser()
    }
    if (!await userIsCVOwner(ROOT_USERNAME)) {
        await generateTestCV(ROOT_USERNAME)
    }
}

const deleteAllCVs = async () => {
    await CurriculumVitae.deleteMany({})
}

const deleteAllCVObjects = async () => {
    await Communication.deleteMany({})
    await Contact.deleteMany({})
    await Experience.deleteMany({})
    await Info.deleteMany({})
    await Profile.deleteMany({})
    await Project.deleteMany({})
    await CurriculumVitae.deleteMany({})
}

export {
    connectObjectToCVField,
    disconnectObjectFromCVField,
    generateTestCV,
    userIsCVOwner,
    deleteAllCVs,
    deleteAllCVObjects,
    initializeRootUserAndCV
}
