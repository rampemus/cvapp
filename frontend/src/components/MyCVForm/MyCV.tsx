import React, { useState, useEffect } from 'react'
import Toolbar from '../Toolbar'
import { AppState } from '../..'
import { connect, ConnectedProps } from 'react-redux'
import './MyCV.scss'
import cvService, { ICV, ServiceType } from '../../services/cvService'
import { Link, Route, useLocation } from 'react-router-dom'
import MyCVForm from './MyCVForm'
import { updateCVs, setPreviousCV } from '../../reducers/cvReducer'
import Home from '../Home'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { setLoading } from '../../reducers/loadingReducer'
import usersService, { usersError, IUser } from '../../services/usersService'

interface OwnProps { }

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user,
    cvs: state.cv.cvs,
  }
}

const mapDispatchToProps = {
  updateCVs,
  setPreviousCV,
  showNotification,
  setLoading,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const MyCV: React.FC<Props> = (props) => {
  const location = useLocation()
  const formActive = location.pathname.includes('/mycv/') ? false : true
  const myCVs = props.cvs ? props.cvs : []
  const [showDefaultUserMenu, setShowDefaultUserMenu] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [defaults, setDefaults] = useState<String[]>(['rampemus'])

  useEffect(() => {
    updateUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUsers = () => {
    usersService.getAll(props.user).then(response => {
      setUsers(response)
      props.setLoading(false)
    }).catch((error: usersError) => {
      props.showNotification(
        'Request for retrieving users was denied. '
        + error.response.data.error,
        Type.ERROR, 4)
    })
  }

  const renderForm = (cvs: ICV[]) =>
    <Route exact path='/mycv/:id' render={({ match }) => <MyCVForm
      cv={cvs.find((cv) => cv.id === match.params.id)}
    />
    } />

  return <div>
    <Route
      exact
      path='/preview/:id'
      render={({ match }) =>
        <div>
          <Toolbar>
            <div>
              <Link to={`/mycv/${match.params.id}`}>
                <button id='ReturnToEditor' className='toolbar-button'>
                  Return to editor
                </button>
              </Link>
            </div>
          </Toolbar>
          <Home
            preview={props.cvs?.find((cv: ICV) => cv.id + '' === match.params.id)}
          />
        </div>}
    />
    <Route
      path='/mycv'
      render={({ match }) =>
        <div>
          <Toolbar>
            <div>
              <button
                id='DuplicateDefault'
                className='toolbar-button'
                onClick={(event) => {
                  event.preventDefault()
                  props.setLoading(true)
                  myCVs[0] &&
                    cvService
                      .duplicateCV(myCVs[0], props.user, props.showNotification)
                      .then((response) => {
                        props.updateCVs(props.user)
                        props.showNotification('Default CV duplicated', Type.SUCCESS, 6)
                      })
                      .catch((error) => {
                        if (error.response.data.error) {
                          props.showNotification(error.response.data.error, Type.ERROR, 12)
                        }
                      })
                }}
              > Duplicate Default </button>
              <Route
                exact
                path='/mycv/:id'
                render={({ match }) => {
                  const selectedCV: ICV | null = props.cvs?.find((cv: ICV) => cv.id + '' === match.params.id) ?? null
                  return <>
                    <button
                      id='SetAsDefaultCV'
                      className='toolbar-button'
                      disabled={formActive}
                      onClick={(event) => {
                        event.preventDefault()
                        props.setLoading(true)
                        cvService
                          .setCVDefault(match.params.id, props.user)
                          .then(() => {
                            props.updateCVs(props.user)
                            props.showNotification('Default CV updated', Type.SUCCESS, 4)
                          })
                          .catch((error) => {
                            if (error.response.data.error) {
                              props.showNotification(error.response.data.error, Type.ERROR, 12)
                            }
                          })
                      }}
                    > Set As Default </button>
                    <button
                      id='ShowToUserMenu'
                      className='toolbar-button'
                      onClick={(event) => {
                        event.preventDefault()
                        setShowDefaultUserMenu(!showDefaultUserMenu)
                      }}
                    > Show to User... </button>
                    <Link
                      key={'toolbarlink' + match.params.id}
                      to={`/preview/${match.params.id}`}
                    >
                      <button id='Preview' className='toolbar-button'> Preview </button>
                    </Link>
                    <div
                      className='userSelectionContainer'
                      style={{
                        display: showDefaultUserMenu ? 'block' : 'none',
                      }}
                    >
                      Users that have {selectedCV?.name} as default
                      {users.map((user, index) => <p
                        key={`user${index}`}
                        style={{
                          marginTop: '-8px',
                          borderRadius: '10px',
                          margin: '10px',
                          cursor: 'pointer',
                          textAlign: defaults.includes(user.username) ? 'right' : 'left',
                          backgroundColor: defaults.includes(user.username) ? 'rgba(177, 255, 161, 0.637)' : 'rgba(255, 161, 161, 0.5)',
                        }}
                        onClick={() => {
                          if (defaults.includes(user.username)) {
                            setDefaults(defaults.filter(username => username !== user.username))
                          } else {
                            setDefaults([...defaults, user.username])
                          }
                        }}
                      >
                      <button 
                        className='toolbar-button'
                        style={{
                          transform: 'scale(1.1)',
                          padding: '5px'
                        }}
                      >{user.username}</button>
                      </p>)}

                    </div>
                  </>
                }}
              />
              <Route exact path='/mycv' render={({ match }) => (
                <>
                  <button key='toolbar-button-1' className='toolbar-button' disabled >
                    {' '}
                    Set As Default
                  </button>
                  <button className='toolbar-button' disabled> Show to User... </button>
                  <button
                    key='toolbar-button-2'
                    className='toolbar-button'
                    disabled
                  > Preview </button>
                </>
              )} />
            </div>
          </Toolbar>
          <h1>My CV's</h1>
          <div className='cv-selector'>
            {myCVs && myCVs.length > 0 && myCVs.map((cv: ICV, index: number) => {
              const locationid = location.pathname.substr(
                location.pathname.length - cv.id.length
              )
              const selected = locationid === cv.id
              return <div
                className='cv-item'
                key={cv.id}
                style={{
                  transition:
                    'margin-top 0.2s ease, margin-bottom 0.2s ease',
                  marginTop: selected ? '10px' : '2px',
                  marginBottom: selected ? '2px' : '10px',
                }}
              >
                <Link
                  id={'Select' + cv.id}
                  className='cv-selector-item'
                  to={`/mycv/${cv.id}`}
                  onClick={() => {
                    props.setPreviousCV(cv.id)
                  }}
                >
                  <img src='emptycv.svg' width='150px' height='180px' alt='document' />
                  {index === 0 && (
                    <div className='default-label'>default</div>
                  )}
                  <div style={{ zIndex: 1 }}>
                    {cv.name}
                    {Object.entries(cv).map(([key, value]) =>
                      value ? <p key={key}>{key + ': ' + value}</p> : ''
                    )}
                  </div>
                </Link>
                <button
                  id={'Delete' + cv.id}
                  onClick={(event) => {
                    event.preventDefault()
                    props.setLoading(true)
                    cvService
                      .deleteObject(ServiceType.CV, cv.id, props.user)
                      .then((response) => {
                        props.updateCVs(props.user)
                        props.showNotification('CV ' + cv.name + ' deleted', Type.SUCCESS, 4)
                      })
                  }}
                >
                  <img className='icon' src='delete.svg' width='17px' height='15px' alt='delete' />
                </button>
              </div>

            })}
            <img
              id='CreateEmptyCV'
              src='emptycvplus.svg'
              width='150px'
              height='180px'
              alt='document'
              onClick={(event) => {
                event.preventDefault()
                props.setLoading(true)
                cvService.createEmptyCV(props.user).then((response) => {
                  props.updateCVs(props.user)
                  props.showNotification('Empty CV created', Type.SUCCESS, 4)
                })
              }}
            />
          </div>
          {renderForm(myCVs)}
        </div>}
    />
  </div>
}

export default connector(MyCV)
