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
export interface StateProps { user?: UserState, cvs?: ICV[] }
export interface DispatchProps {
    updateCVs: Function,
    setPreviousCV: Function,
    showNotification: Function
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

    console.log(myCVs)

    const renderForm = (cvs: ICV[]) => {
        return (
            <Route exact path="/mycv/:id" render={({ match }) => 
                <MyCVForm cv={cvs.find(cv => { return cv.id === match.params.id })}/>
            }/>
        )
    }

    console.log(props.cvs)

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
                                myCVs[0] && cvService.duplicateCV(myCVs[0], props.showNotification)
                                    .then((response) => {
                                        props.updateCVs()
                                        props.showNotification('Default CV duplicated', Type.SUCCESS, 6)
                                    })
                            }}>Duplicate Default</button>
                            <Route exact path="/mycv/:id" render={({ match }) =>
                                [
                                    <button className='toolbar-button' disabled={formActive} onClick={(event) => {
                                        event.preventDefault()
                                        cvService.setCVDefault(match.params.id)
                                            .then(() => {
                                                props.updateCVs()
                                                props.showNotification('Default CV updated', Type.SUCCESS, 4)
                                            })
                                            .catch((error) => {
                                                if (error.response.data.error) {
                                                    props.showNotification(error.response.data.error, Type.ERROR, 12)
                                                }
                                            })
                                    }}>Set As Default CV</button>,
                                    <Link to={`/preview/${match.params.id}`}>
                                        <button className='toolbar-button'>Preview</button>
                                    </Link>
                                ]
                            }/> 
                            <Route exact path="/mycv" render={({ match }) => [
                                <button className='toolbar-button' disabled> Set As Default CV</button>,
                                <button className='toolbar-button' disabled>Preview</button>
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
                                        cvService.deleteObject(ServiceType.CV, cv.id)
                                            .then((response) => {
                                                props.updateCVs()
                                                props.showNotification('CV ' + cv.name + ' deleted', Type.SUCCESS, 4)
                                            })
                                        }}
                                        >Delete</button>
                            </div>
                        })}
                        <img
                            src='emptycvplus.svg'
                            width='150px'
                            height='180px'
                            alt='document'
                            onClick={(event)=>{
                                event.preventDefault()
                                cvService.createEmptyCV().then(response => {
                                    props.updateCVs()
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

