import React from 'react'
import './Footer.scss'
import { connect, ConnectedProps } from 'react-redux'
import { AppState } from '..'

interface OwnProps { }

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const Footer: React.FC<Props> = (props) => {
  const showUserInfo = props.user && props.user.name.length > 2

  if (showUserInfo && props.user) {
    return <div className='Footer'>Logged in as {props.user.name}</div>

  }
  return <div className='Footer'>You are not logged in</div>
}

export default connector(Footer)
