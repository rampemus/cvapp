export const SET_LOADING = 'SET_LOADING'

interface loadingReducerAction {
  type: string,
  data: boolean
}

const initState: boolean = false

const loadingReducer = (state: boolean = initState, action: loadingReducerAction) => {
  switch (action.type) {
  case SET_LOADING: {
    return { isFetching: action.data }
  }
  default: return state
  }
}

export const setLoading = (loading: boolean) => {
  const action:loadingReducerAction = {
    type: SET_LOADING,
    data: loading
  }
  return action
}

export default loadingReducer
