export const SET_LOADING = 'SET_LOADING'

export interface loadingReducerAction {
  type: string,
  data: boolean
}

export interface ILoaderState {
  isFetching: boolean
}

const initState = {
  isFetching: true
}

const loadingReducer = (state: ILoaderState = initState, action: loadingReducerAction) => {
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
