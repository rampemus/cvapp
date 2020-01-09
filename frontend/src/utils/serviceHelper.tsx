const getConfigHeader = () => {
    const user = window.localStorage.getItem('loggedUser')
    const userToken = user ? JSON.parse(user).token : ''
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + userToken
        }
    }
    return config
}

export { getConfigHeader }