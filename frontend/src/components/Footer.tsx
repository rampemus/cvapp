import React from 'react'
import './Footer.scss'
import { connect } from 'react-redux'
import { UserState } from '../reducers/userReducer'
import { AppState } from '..'

interface OwnProps { }
export interface StateProps { user?: UserState }
export interface DispatchProps { }

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

type Props = OwnProps & StateProps & DispatchProps

const Footer: React.FC<Props> = (props) => {
  const showUserInfo = props.user && props.user.name.length > 2

  if (showUserInfo && props.user) {
    return <div className='Footer'>Logged in as {props.user.name}</div>

  }
  return <div className='Footer'>You are not logged in</div>
}

export default connect(mapStateToProps, null)(Footer)
