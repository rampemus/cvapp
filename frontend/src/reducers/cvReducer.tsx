import { ICV } from "../services/cvService"

interface cvState {
    cvs: ICV[],
}

interface CVsAction {
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

const cvReducer = (state: cvState = initState, action: CVsAction) => {
    switch (action.type) {
    case 'SET_STATE': {
        return action.data
    }
    default: return state
    }
}

export const updateCVs = () => {
    const action: CVsAction = {
        type: 'UPDATE_CVS',
        data: null
    }
    return action
}

export default cvReducer