import bcrypt from 'bcrypt'
import User from '../models/user'
import { PASSWORD_DIGITS, ROOT_NAME, ROOT_PASSWORD, ROOT_USERNAME, TESTUSER_NAME, TESTUSER_PASSWORD } from './config'

const colorNames = [
    'IndiaRed',
    'Salmon',
    'DarkSalmon',
    'LightSalmon',
    'Crimson',
    'Red',
    'FireBrick',
    'DarkRed',
    'Violet',
    'Coral',
    'Tomato',
    'Orange',
    'Gold',
    'Yellow',
    'LemonChiffon',
    'PapayaWhip',
    'Moccasin',
    'PeachPuff',
    'PaleGoldenrod',
    'Khaki',
    'Lavender',
    'Thistle',
    'Plum',
    'Violet',
    'Orchid',
    'Fuchsia',
    'Magenta',
    'Purple',
    'Indigo',
    'SlateBlue',
    'Green',
    'Chartreuse',
    'LawnGreen',
    'Lime',
    'SpringGreen',
    'SeaGreen',
    'ForestGreen',
    'OliveDrab',
    'Olibe',
    'DarkOliveGreen',
    'AquaMarine',
    'Cyan',
    'Teal',
    'Aqua',
    'Turquoise',
    'Marine',
    'CadetBlue',
    'PowderBlue',
    'CornflowerBlue',
    'RoyalBlue',
    'Blue',
    'Navy',
    'MidnightBlue',
    'Cornsilk',
    'BlanchedAlmond',
    'Bisque',
    'NavajoWhite',
    'Wheat',
    'BurlyWood',
    'Tan',
    'RosyBrown',
    'SandyBrown',
    'Goldenrod',
    'Chocolate',
    'SaddleBrown',
    'Sienna',
    'Brown',
    'Maroon',
    'White',
    'Snow',
    'Honeydew',
    'MintCream',
    'Azure',
    'AliceBlue',
    'GhostWhite',
    'WhiteSmoke',
    'Seashell',
    'Beige',
    'OldLace',
    'FloraWhite',
    'Linen',
    'LavenderBlush',
    'MistyRose',
    'Gainsboro',
    'Silver',
    'DarkGray',
    'Gray',
    'DimGray',
    'LightStaleGray',
    'SlateGray',
    'Black'
]

const constellationNames = [
    'Centaurus',
    'Ophiuchus',
    'UrsaMajor',
    'CanisMajor',
    'Eridanus',
    'Cygnus',
    'Indus',
    'Cetus',
    'Acuila',
    'Draco',
    'Libra',
    'Cassiopeia',
    'Ophiuchus',
    'Sagittarius',
    'Eridanus',
    'Pavo',
    'Bootes',
    'Scorpius',
    'Cetus',
    'Pisces',
    'Hydrus',
    'PiscisAustrinus',
    'Lyra',
    'Orion',
    'Tucana',
    'Lepus',
    'Hydra',
    'Gemini',
    'Pisces',
    'LeoMinor',
    'Dorado',
    'SerpensCaput',
    'Reticulum',
    'Pyxis',
    'Auriga',
    'Virgo'
]

const userExists = async ( username: string ) => {
    const users = await User.find({ username })
    if (users.length === 0) {
        return false
    }
    return true
}

const getUserByUsername = async (username: string) => {
    const user = await User.findOne({ username })
    return user
}

const getUserById = async (id: string) => {
    const user = await User.findOne({ _id: id })
    return user
}

const ownerId = async (userId: string) => {
    const user = await User.findOne({ _id: userId })
    return user.owner.id
}

const userIsRootUser = async (id: string) => {
    const user = await User.findOne({ _id: id })
    return user.username === ROOT_USERNAME
}

const createRootUser = async () => {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(ROOT_PASSWORD, saltRounds)

    const rootUser = await new User({
        created: new Date(),
        name: ROOT_NAME,
        passwordHash,
        username: ROOT_USERNAME,
    })

    return await rootUser.save()
}

const createTestUser = async () => {
    const saltRounds = 10

    let i = 1
    let username = TESTUSER_NAME
    let password = TESTUSER_PASSWORD
    let name = TESTUSER_NAME

    while ( await userExists(username) ) { // iterates unused username
        username = TESTUSER_NAME + '' + i
        password = TESTUSER_PASSWORD + '' + i
        name = TESTUSER_NAME + '' + i
        i++
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const testUser = await new User({
        created: new Date(),
        name,
        passwordHash,
        username,
    })

    return await testUser.save()
}

const randomUserName = () => {
    return '' + colorNames[Math.floor(Math.random() * colorNames.length)]
        + constellationNames[Math.floor(Math.random() * constellationNames.length)]
        + Math.floor(Math.random() * 100)
}

// https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
const randomPassword = ( length: number ) => {
    const chars = PASSWORD_DIGITS
    const passwordLength = length
    let randomString = ''
    for (let i = 0; i < passwordLength; i++) {
        const rnumber = Math.floor(Math.random() * chars.length)
        randomString += chars.substring(rnumber, rnumber + 1)
    }
    return randomString.toString()
}

const deleteAllUsers = async () => {
    await User.deleteMany({})
}

export {
    createRootUser,
    createTestUser,
    userExists,
    getUserByUsername,
    getUserById,
    userIsRootUser,
    ownerId,
    randomUserName,
    randomPassword,
    deleteAllUsers,
}
