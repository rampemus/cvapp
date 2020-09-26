import './index.scss'
import * as serviceWorker from './serviceWorker'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import cvReducer from './reducers/cvReducer'
import loadingReducer from './reducers/loadingReducer'
import notificationReducer from './reducers/notificationReducer'
import thunk from 'redux-thunk'
import userReducer from './reducers/userReducer'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from 'redux'

export const rootReducer = combineReducers({
  notification: notificationReducer,
  user: userReducer,
  cv: cvReducer,
  loader: loadingReducer
})

export type AppState = ReturnType<typeof rootReducer>

const store = process.env.NODE_ENV === 'production'
  ? createStore(rootReducer, applyMiddleware(thunk))
  : createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

declare var window: any
window.appStatus = false
window.appStore = store
const updateStatus = () => {
  window.appStatus = true
}

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App updateStatus={updateStatus} />
    </Provider>,
    document.getElementById('root')
  )
}

renderApp()
store.subscribe(renderApp)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
