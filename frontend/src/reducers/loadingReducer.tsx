export const SET_LOADING = 'SET_LOADING'

export interface loadingReducerState {
  isFetching: boolean
}

interface loadingReducerAction {
  type: string,
  data: loadingReducerState
}

const initState: loadingReducerState = {
  isFetching: false
}

const loadingReducer = (state: loadingReducerState = initState, action: loadingReducerAction) => {
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
    data: {
      isFetching: loading
    }
  }
  return action
}

export default loadingReducer
