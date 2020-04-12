interface loadingReducerState {
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
  case 'SET_LOADING': {
    return { isFetching: action.data }
  }
  default: return state
  }
}

export const setLoading = (loading: loadingReducerState) => {
  const action:loadingReducerAction = {
    type: 'SET_LOADING',
    data: loading
  }
  return action
}

export default loadingReducer
