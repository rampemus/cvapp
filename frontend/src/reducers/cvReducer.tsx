import cvService, { ICV, IExperience, IContact, IProject, IProfile, ICommunication, IInfo } from "../services/cvService"
import { UserState } from "./userReducer"

interface cvState {
  cvs: ICV[],
  lastOpened: string
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
          '...',
          '...',
          '...'
        ],
        name: '...',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: '...',
          username: '...',
          id: '...'
        },
        id: '...'
      },
      communication: {
        content: [
          '...'
        ],
        languages: [
          {
            'language': '...',
            'level': '...'
          },
          {
            'language': '...',
            'level': '...'
          }
        ],
        name: '...',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: '...',
          username: '...',
          id: '...'
        },
        id: '...'
        },
      education: [
        {
          timeFrame: {
            endDate: new Date('2020-01-14T12:34:33.498Z'),
            startDate: new Date('2020-01-14T12:34:33.498Z')
          },
          description: '...',
          name: '...',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: '...',
            username: '...',
            id: '...'
          },
          id: '...'
        }
      ],
      experience: [{
        timeFrame: {
          endDate: new Date('2020-01-14T12:34:33.498Z'),
          startDate: new Date('2020-01-14T12:34:33.498Z')
        },
        description: '...',
        name: '...',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: '...',
          username: '...',
          id: '...'
        },
        id: '...'
      }],
      info: {
        content: [
          '...',
          '...'
        ],
        name: '...',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: '...',
          username: '...',
          id: '...'
        }, 
        id: '...'
      },
      projects: [
        {
          description: '...',
          githubUrl: '',
          name: '...',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: '...',
            username: '...',
            id: '...'
          }, 
          showcaseUrl: '...',
          thumbnailUrl: '',
          id: '...'
        }
      ],
      reference: [],
      skills: {
          content: [
            '...'
          ],
          name: '...',
          owner: {
            created: new Date('2020-01-13T13:18:58.111Z'),
            name: '...',
            username: '...',
            id: '...'
          }, 
        id: '...'
      },
      contact: {
        address: '...',
        email: '...',
        firstname: '...',
        lastname: '...',
        owner: {
          created: new Date('2020-01-13T13:18:58.111Z'),
          name: '...',
          username: '...',
          id: '...'
        },
        phone: '...',
        phoneAvailable: '...',
        company: '...',
        pictureUrl: '',
        id: '...'
      },
      github: '',
      name: '...',
      owner: { 
        created: new Date('2020-01-13T13:18:58.111Z'),
        name: '...',
        username: '...',
        id: '...'
      },
      profile: {
        content: [
          '...',
          '...'
        ],
        name: '...',
        owner: {
          created: new Date('...'),
          name: '...',
          username: '...',
          id: '...'
        }, 
        id: '...'
      },
      techlist: '...',
      id: '...'
    }
  ],
  lastOpened: ''
}

// TODO: save last visited cv and open it automaticly for the CV selector

const cvReducer = (state: cvState = initState, action: CVAction) => {
  switch (action.type) {
    case 'UPDATE_CVS': {
      return { cvs:action.data.cvs, lastOpened: action.data.cvs.length > 1 ? action.data.cvs.includes((cv:ICV) => cv.id === state.lastOpened) ? state.lastOpened : '' : ''}
    }
    case 'SET_PREVIOUS_CV': {
      return { cvs: state.cvs, lastOpened: action.data.id }
    }
    case 'ADD_EMPTY_OBJECT': {
      const cv = state.cvs.find((cv:ICV) => cv.id === action.data.id )
      if (!cv) return state

      switch(action.data.field) {
        case 'experience':
          return { lastOpened: state.lastOpened, cvs: state.cvs.map((cvObject: ICV) => {
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                const emptyCommunication: ICommunication = {
                  owner: cv.owner,
                  name: '',
                  content: [''],
                  languages: [],
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, experience: cv.experience ? cv.experience.filter((experience: IExperience) => experience.id !== action.data.objectId) : [] }
              } else {
                return cvObject
              }
            })
          }
        case 'education':
          return {
            lastOpened: state.lastOpened, 
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, education: cv.education ? cv.education.filter((education: IExperience) => education.id !== action.data.objectId) : [] }
              } else {
                return cvObject
              }
            })
          }
        case 'reference':
          return {
            lastOpened: state.lastOpened, 
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, reference: cv.reference ? cv.reference.filter((reference: IContact) => reference.id !== action.data.objectId) : [] }
              } else {
                return cvObject
              }
            })
          }
        case 'projects':
          return {
            lastOpened: state.lastOpened, 
            cvs: state.cvs.map((cvObject: ICV) => {
              if (cvObject.id === cv.id) {
                return { ...cv, projects: cv.projects ? cv.projects.filter((project: IProject) => project.id !== action.data.objectId) : [] }
              } else {
                return cvObject
              }
            })
          }
        case 'profile':
          return {
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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
            lastOpened: state.lastOpened, 
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

export const updateCVs = (user: UserState) => {
  return async (dispatch:any) => {
    const action: CVAction = {
      type: 'UPDATE_CVS',
      data: { cvs: await cvService.getAllCV(user) }
    }
    dispatch(action)
  }
}

export const clearCVS = () => {
  const action: CVAction = {
    type: 'UPDATE_CVS',
    data: { cvs: initState }
  }
  console.log('clearCVS happening')
  return action
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

export const setPreviousCV = (id:string) => {
  const action: CVAction = {
    type: 'SET_PREVIOUS_CV',
    data: {id}
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