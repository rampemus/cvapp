import React from 'react'
import cvService, { ICV, ServiceType } from '../../services/cvService'
import { CVAction } from '../../reducers/cvReducer'
import { Link, useLocation } from 'react-router-dom'
import { UserState } from '../../reducers/userReducer'
import { loadingReducerAction } from '../../reducers/loadingReducer'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect, ConnectedProps } from 'react-redux'

interface OwnProps {
  myCVs: ICV[],
  setPreviousCV: (id: string) => CVAction,
  setLoading: (loading: boolean) => loadingReducerAction,
  user: UserState,
  updateCVs: (user: UserState) => Promise<void>,
}

const mapDispatchToProps = {
  showNotification
}

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const MyCVSelect: React.FC<Props> = (props) => {
  const { myCVs, setPreviousCV, setLoading, user, updateCVs } = props
  const location = useLocation()

  return <div className='cv-selector'>
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
            setPreviousCV(cv.id)
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
            setLoading(true)
            cvService
              .deleteObject(ServiceType.CV, cv.id, user)
              .then((response) => {
                updateCVs(user)
                props.showNotification(`CV ${cv.name} deleted`, Type.SUCCESS, 4)
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
        setLoading(true)
        cvService.createEmptyCV(user).then((response) => {
          updateCVs(user)
          props.showNotification('Empty CV created', Type.SUCCESS, 4)
        })
      }}
    />
  </div>
}

export default connector(MyCVSelect)
