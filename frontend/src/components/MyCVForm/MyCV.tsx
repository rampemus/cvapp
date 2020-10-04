import './MyCV.scss'
import Home from '../Home'
import MyCVForm from './MyCVForm'
import MyCVSelect from './MyCVSelect'
import MyCVUserSelector from './MyCVUserSelector'
import React, { useState } from 'react'
import Toolbar from '../Toolbar'
import cvService, { ICV } from '../../services/cvService'
import { AppState } from '../..'
import { Link, Route, useLocation } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { setLoading } from '../../reducers/loadingReducer'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { updateCVs, setPreviousCV } from '../../reducers/cvReducer'

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
  const myCVs = props.cvs ? props.cvs : []
  const [showDefaultUserMenu, setShowDefaultUserMenu] = useState(false)

  const renderForm = (cvs: ICV[]) =>
    <Route exact path='/mycv/:id' render={({ match }) =>
      <MyCVForm
        cv={cvs.find((cv) => cv.id === match.params.id)}
      />
    }/>

  return <div>
    <Route
      path='/mycv'
      render={({ match }) => {
        const selectedCV: ICV | null = props.cvs?.find(
          (cv: ICV) => location.pathname.endsWith(cv.id + '')
        ) ?? null

        return <div>
          <Toolbar>

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

            <button
              id='SetAsDefaultCV'
              className='toolbar-button'
              disabled={!selectedCV}
              onClick={(event) => {
                event.preventDefault()
                if (!selectedCV) return null
                props.setLoading(true)
                cvService
                  .setCVDefault(selectedCV.id, props.user)
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
              disabled={!selectedCV}
            > Show to User... </button>

            <Link
              key={'toolbarlink' + match.params.id}
              to={`/preview/${selectedCV?.id}`}
            >
              <button
                id='Preview'
                className='toolbar-button'
                disabled={!selectedCV}
              > Preview </button>
            </Link>

            <MyCVUserSelector
              showDefaultUserMenu={showDefaultUserMenu}  
              selectedCV={selectedCV}
              owner={props.user}
              setLoading={setLoading}
              showNotification={showNotification}
            />
            
          </Toolbar>
          <h1>My CV's</h1>
          <MyCVSelect
            myCVs={myCVs}
            setPreviousCV={setPreviousCV}
            setLoading={setLoading}
            user={props.user}
            updateCVs={props.updateCVs}
            showNotification={showNotification}
          />
          {renderForm(myCVs)}
        </div>}}
    />
    <Route
      exact
      path='/preview/:id'
      render={({ match }) => {
        const selectedCV: ICV | null = props.cvs?.find(
          (cv: ICV) => location.pathname.endsWith(cv.id + '')
        ) ?? null
        return <div>
          <Toolbar>
            <Link to={`/mycv/${selectedCV?.id}`}>
              <button id='ReturnToEditor' className='toolbar-button'>
                Return to editor
              </button>
            </Link>
          </Toolbar>
          <Home
            preview={selectedCV}
          />
        </div> }}
    />
  </div>
}

export default connector(MyCV)
