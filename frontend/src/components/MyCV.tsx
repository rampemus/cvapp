import React from 'react'
import Toolbar from './Toolbar'
import { AppState } from '..'
import { connect } from 'react-redux'
import './MyCV.css'
import cvService, { ICV, ServiceType } from '../services/cvService'
import { Link, Route, useLocation } from 'react-router-dom'
import MyCVForm from './MyCVForm'
import { UserState } from '../reducers/userReducer'
import { updateCVs, setPreviousCV } from '../reducers/cvReducer'
import Home from './Home'
import { showNotification, Type } from '../reducers/notificationReducer'

interface OwnProps {}
export interface StateProps { user: UserState, cvs?: ICV[] }
export interface DispatchProps {
    updateCVs: (user: UserState) => void,
    setPreviousCV: (id: string) => void,
    showNotification: (message: string, type: Type, lifeTime?: number) => void
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user,
        cvs: state.cv.cvs
    }
}

const mapDispatchToProps: DispatchProps = {
    updateCVs,
    setPreviousCV,
    showNotification
}

type Props = OwnProps & StateProps & DispatchProps

const MyCV: React.FC<Props> = (props) => {

    const location = useLocation()
    const formActive = location.pathname.includes('/mycv/') ? false : true
    const myCVs = props.cvs ? props.cvs : []

    const renderForm = (cvs: ICV[]) => {
        return (
            <Route exact path="/mycv/:id" render={({ match }) => 
                <MyCVForm cv={cvs.find(cv => { return cv.id === match.params.id })}/>
            }/>
        )
    }

    return(
        <div>
            <Route exact path="/preview/:id" render={({ match }) => 
            <div>
                <Toolbar>
                    <div>
                        <Link to={`/mycv/${match.params.id}`}>
                            <button className='toolbar-button'>
                                Return to editor
                            </button>
                        </Link>
                    </div>
                </Toolbar>
                <Home preview={props.cvs?.find(cv => cv.id + '' === match.params.id)}/>
            </div>
            }/>
            <Route path="/mycv" render={({ match }) =>
                <div>
                    <Toolbar>
                        <div>
                            <button className='toolbar-button' disabled={formActive}>Clear CV</button>
                            <button className='toolbar-button' onClick={(event) => {
                                event.preventDefault()
                                myCVs[0] && cvService.duplicateCV(myCVs[0], props.user, props.showNotification)
                                    .then((response) => {
                                        props.updateCVs(props.user)
                                        props.showNotification('Default CV duplicated', Type.SUCCESS, 6)
                                    })
                                    .catch((error) => {
                                        if (error.response.data.error) {
                                            props.showNotification(error.response.data.error, Type.ERROR, 12)
                                        } 
                                    })
                            }}>Duplicate Default</button>
                            <Route exact path="/mycv/:id" render={({ match }) =>
                                [
                                    <button key={'toolbarbutton' + match.params.id} className='toolbar-button' disabled={formActive} onClick={(event) => {
                                        event.preventDefault()
                                        cvService.setCVDefault(match.params.id, props.user)
                                            .then(() => {
                                                props.updateCVs(props.user)
                                                props.showNotification('Default CV updated', Type.SUCCESS, 4)
                                            })
                                            .catch((error) => {
                                                if (error.response.data.error) {
                                                    props.showNotification(error.response.data.error, Type.ERROR, 12)
                                                }
                                            })
                                    }}>Set As Default CV</button>,
                                    <Link key={'toolbarlink' + match.params.id} to={`/preview/${match.params.id}`}>
                                        <button className='toolbar-button'>Preview</button>
                                    </Link>
                                ]
                            }/> 
                            <Route exact path="/mycv" render={({ match }) => [
                                <button key='toolbar-button-1' className='toolbar-button' disabled> Set As Default CV</button>,
                                <button key='toolbar-button-2' className='toolbar-button' disabled>Preview</button>
                            ]} /> 
                        </div>
                    </Toolbar>
                    <h1>My CV's</h1>
                    <div className='cv-selector'>
                        {myCVs && myCVs.length > 0 && myCVs.map((cv:ICV, index:number) => {
                            const locationid = location.pathname.substr(location.pathname.length - cv.id.length)
                            const selected = locationid === cv.id
                            return <div 
                                className='cv-item' 
                                key={cv.id}
                                style={{
                                    transition: 'margin-top 0.2s ease, margin-bottom 0.2s ease',
                                    marginTop: selected ? '10px' : '2px',
                                    marginBottom: selected ? '2px' : '10px'
                                }}
                            >
                                <Link to={`/mycv/${cv.id}`} onClick={()=>{props.setPreviousCV(cv.id)}}>
                                    <img src='emptycv.svg' width='150px' height='180px' alt='document'/>
                                    {index === 0 && <div className='default-label'>default</div>}
                                    <div style={{zIndex: 1}}>
                                        {cv.name}
                                        {Object.entries(cv).map(([key, value]) => value ? <p key={key}>{key + ': ' + value}</p> : '')}
                                    </div>
                                </Link> 
                                <button
                                    onClick={(event) => {
                                        event.preventDefault()
                                        cvService.deleteObject(ServiceType.CV, cv.id, props.user)
                                            .then((response) => {
                                                console.log(response)
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
                            src='emptycvplus.svg'
                            width='150px'
                            height='180px'
                            alt='document'
                            onClick={(event)=>{
                                event.preventDefault()
                                cvService.createEmptyCV(props.user).then(response => {
                                    props.updateCVs(props.user)
                                    props.showNotification('Empty CV created', Type.SUCCESS, 4)
                                })
                            }}
                            /> 
                    </div>
                    {renderForm(myCVs)}
                </div>
            }/>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCV)

