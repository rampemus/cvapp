import cvService, { ICV, IExperience, IContact, IProject, IProfile, ICommunication, IInfo } from "../services/cvService"

interface cvState {
  cvs: ICV[],
}

export interface CVAction {
  type: string,
  data: any
}

const initState: cvState = {
  cvs: [
    {
      attachments: {
        content: [
          'Certificate of studies',
          'certificate of driving',
          'Certificate of trucks'
        ],
        name: 'Certificates and that short of things',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        },
        id: '5e1db55948aa55f4cb54fe4c'
      },
      communication: {
        content: [
          'I speak as Im spoken of that I spoke what I speak'
        ],
        languages: [
          {
            'language': 'English',
            'level': 'Fluent'
          },
          {
            'language': 'Spook',
            'level': 'Spok'
          }
        ],
        name: 'Bilanguagelist',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        },
        id: '5e1db55948aa55f4cb54fe47'
        },
      education: [
        {
          timeFrame: {
            endDate: new Date('2020-01-14T12:34:33.498Z'),
            startDate: new Date('2020-01-14T12:34:33.498Z')
          },
          description: 'Many studies done',
          name: 'The basic degree',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: 'Pasi Toivanen',
            username: 'rampemus',
            id: '5e1c6e42d9e1887cc7c4c968'
          },
          id: '5e1db55948aa55f4cb54fe46'
        }
      ],
      experience: [{
        timeFrame: {
          endDate: new Date('2020-01-14T12:34:33.498Z'),
          startDate: new Date('2020-01-14T12:34:33.498Z')
        },
        description: 'Many job done',
        name: 'The average job',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        },
        id: '5e1db55948aa55f4cb54fe45'
      }],
      info: {
        content: [
          'Can drive a car, a boat, a truck and a plane',
          'All that with just a one hand!'
        ],
        name: 'Driving info',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        }, 
        id: '5e1db55948aa55f4cb54fe4b'
      },
      projects: [
        {
          description: 'Project that will be soon finished',
          githubUrl: 'https://github.com/rampemus/cvapp',
          name: 'CV project',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: 'Pasi Toivanen',
            username: 'rampemus',
            id: '5e1c6e42d9e1887cc7c4c968'
          }, 
          showcaseUrl: 'http://localhost:3000/',
          thumbnailUrl: 'logo.svg',
          id: '5e1db55948aa55f4cb54fe4d'
        }
      ],
      reference: [],
      skills: {
          content: [
            'A lot of social superskills'
          ],
          name: 'Social skills',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: 'Pasi Toivanen',
            username: 'rampemus',
            id: '5e1c6e42d9e1887cc7c4c968'
          }, 
          id: '5e1db55948aa55f4cb54fe4a'
      },
      contact: {
        address: 'Testaavankatu 23, 80200 Joensuu',
        email: 'testaava.testi@testaus.net',
        firstname: 'Teppo',
        lastname: 'Testaavainen',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        },
        phone: '0452478903',
        phoneAvailable: 'always',
        company: 'Good company',
        pictureUrl: 'Nice pictures',
        id: '5e1db55948aa55f4cb54fe42'
      },
      github: 'https://github.com/rampemus',
      name: 'Init cv straight from the reducer',
      owner: { 
        created: new Date('2020-01-13T13:18:58.111Z'),
        name: 'Pasi Toivanen',
        username: 'rampemus',
        id: '5e1c6e42d9e1887cc7c4c968'
      },
      profile: {
        content: [
          'Many feelings of feeling the feels of feeling may lead to feel a alot.',
          'Note that there is feelings that are felt many times of feelings that the feelings create'
        ],
        name: 'Feelgoodjob profile',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: 'Pasi Toivanen',
          username: 'rampemus',
          id: '5e1c6e42d9e1887cc7c4c968'
        }, 
        id: '5e1db55948aa55f4cb54fe44'
      },
      techlist: 'Java, Python, CSS, C#, Angular',
      id: '5e1db55948aa55f4cb54fe4e'
    }
  ]
}



const cvReducer = (state: cvState = initState, action: CVAction) => {
  switch (action.type) {
    case 'UPDATE_CVS': {
      return action.data
    }
    case 'ADD_EMPTY_OBJECT': {
      const cv = state.cvs.find((cv:ICV) => cv.id === action.data.id )
      if (!cv) return state

      switch(action.data.field) {
        case 'experience':
          return { cvs: state.cvs.map((cvObject: ICV) => {
            const emptyExperience: IExperience = {
              description: '',
              name: '',
              owner: cv.owner,
              timeFrame: {
                startDate: new Date(),
                endDate: new Date(),
              },
              id: 'temp' + Math.floor((Math.random() * 100000) + 1),
            }
            if ( cvObject.id === cv.id ) {
              return { ...cv, experience: cv.experience ? cv.experience.concat(emptyExperience) : new Array(emptyExperience) }
            } else {
              return cvObject
            }
          }) }
        case 'education':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyExperience: IExperience = {
                  description: '',
                  name: '',
                  owner: cv.owner,
                  timeFrame: {
                    startDate: new Date(),
                    endDate: new Date(),
                  },
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, education: cv.education ? cv.education.concat(emptyExperience) : new Array(emptyExperience) }
              } else {
                return cvObject
              }
            })
          }
        case 'reference':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyContact: IContact = {
                  owner: cv.owner,
                  address: '',
                  company: '',
                  email: '',
                  firstname: '',
                  lastname: '',
                  phone: '',
                  phoneAvailable: '',
                  pictureUrl: '',
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, reference: cv.reference ? cv.reference.concat(emptyContact) : new Array(emptyContact) }
              } else {
                return cvObject
              }
            })
          }
        case 'projects':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyProject: IProject = {
                  description: '',
                  githubUrl: '',
                  name: '',
                  owner: cv.owner,
                  showcaseUrl: '',
                  thumbnailUrl: '',
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, projects: cv.projects ? cv.projects.concat(emptyProject) : new Array(emptyProject) }
              } else {
                return cvObject
              }
            })
          }
        case 'profile':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyProfile: IProfile = {
                  name: '',
                  content: [''],
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, profile: emptyProfile }
              } else {
                return cvObject
              }
            })
          }
        case 'contact':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyContact: IContact = {
                  owner: cv.owner,
                  address: '',
                  company: '',
                  email: '',
                  firstname: '',
                  lastname: '',
                  phone: '',
                  phoneAvailable: '',
                  pictureUrl: '',
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, contact: emptyContact }
              } else {
                return cvObject
              }
            })
          }
        case 'communication':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyCommunication: ICommunication = {
                  owner: cv.owner,
                  name: '',
                  content: [''],
                  languages: new Array(),
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, communication: emptyCommunication }
              } else {
                return cvObject
              }
            })
          }
        case 'skills':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyInfo: IInfo = {
                  owner: cv.owner,
                  name: '',
                  content: [''],
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, skills: emptyInfo }
              } else {
                return cvObject
              }
            })
          }
        case 'info':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyInfo: IInfo = {
                  owner: cv.owner,
                  name: '',
                  content: [''],
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, info: emptyInfo }
              } else {
                return cvObject
              }
            })
          }
        case 'attachments':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyInfo: IInfo = {
                  owner: cv.owner,
                  name: '',
                  content: [''],
                  id: 'temp' + Math.floor((Math.random() * 100000) + 1),
                }
                return { ...cv, attachments: emptyInfo }
              } else {
                return cvObject
              }
            })
          }
        default:
          return state
      }
    }
    case 'REMOVE_TEMP_OBJECT': {
      const cv = state.cvs.find((cv: ICV) => cv.id === action.data.id)
      if (!cv) return state

      switch (action.data.field) {
        case 'experience':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, experience: cv.experience ? cv.experience.filter((experience: IExperience) => experience.id !== action.data.objectId) : new Array() }
              } else {
                return cvObject
              }
            })
          }
        case 'education':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, education: cv.education ? cv.education.filter((education: IExperience) => education.id !== action.data.objectId) : new Array() }
              } else {
                return cvObject
              }
            })
          }
        case 'reference':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, reference: cv.reference ? cv.reference.filter((reference: IContact) => reference.id !== action.data.objectId) : new Array() }
              } else {
                return cvObject
              }
            })
          }
        case 'projects':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, projects: cv.projects ? cv.projects.filter((project: IProject) => project.id !== action.data.objectId) : new Array() }
              } else {
                return cvObject
              }
            })
          }
        case 'profile':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, profile: undefined }
              } else {
                return cvObject
              }
            })
          }
        case 'contact':
          return state // cannot delete contact field
        case 'communication':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, communication: undefined }
              } else {
                return cvObject
              }
            })
          }
        case 'skills':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, skills: undefined }
              } else {
                return cvObject
              }
            })
          }
        case 'info':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, info: undefined }
              } else {
                return cvObject
              }
            })
          }
        case 'attachments':
          return {
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, attachments: undefined }
              } else {
                return cvObject
              }
            })
          }
        default:
          return state
      }
    }
    // case 'UPDATE_CV': {
    //   const id = action.data.id
    //   const changes = action.data.changes
    //   const newState = { cvs: state.cvs.map( (cv: ICV) => {
    //     if (cv.id === id) {
    //       return { ...cv, ...changes }
    //     } else {
    //       return cv
    //     }
    //   }) }
    // }
    default: return state
  }
}

export const updateCVs = () => {
  return async (dispatch:any) => {
    const action: CVAction = {
      type: 'UPDATE_CVS',
      data: { cvs: await cvService.getAllCV() }
    }
    dispatch(action)
  }
}

export const addEmptyCVObject = (id:string, field:string) => {
  const action: CVAction = {
    type: 'ADD_EMPTY_OBJECT',
    data: { id, field }
  }
  return action
}

export const removeTempCVObject = (id:string, field:string, objectId: string) => {
  const action: CVAction = {
    type: 'REMOVE_TEMP_OBJECT',
    data: {id, field, objectId}
  }
  return action
}

// export const modifyCV = (id:string, changes:any) => {
//   const action: CVAction = {
//     type: 'UPDATE_CV',
//     data: { id, changes }
//   }
//   return action
// }

export default cvReducer