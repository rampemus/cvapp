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

interface OwnProps {}
export interface StateProps { user?: UserState, cvs?: ICV[] }
export interface DispatchProps {
    updateCVs: Function,
    setPreviousCV: Function
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user,
        cvs: state.cv.cvs
    }
}

const mapDispatchToProps: DispatchProps = {
    updateCVs,
    setPreviousCV
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
                                myCVs[0] && cvService.duplicateCV(myCVs[0])
                                    .then((response) => {
                                        props.updateCVs()
                                    })
                            }}>Duplicate Default</button>
                            <button className='toolbar-button' disabled={formActive}>Set As Default CV</button>
                            <Route exact path="/mycv/:id" render={({ match }) =>  
                                <Link to={`/preview/${match.params.id}`}>
                                    <button className='toolbar-button'>Preview</button>
                                </Link>
                            }/> 
                            <Route exact path="/mycv" render={({ match }) =>
                                <button className='toolbar-button' disabled>Preview</button>
                            } /> 
                        </div>
                    </Toolbar>
                    <h1>My CV's</h1>
                    <div className='cv-selector'>
                        {myCVs.map((cv:ICV) => 
                            <div className='cv-item' key={cv.id}>
                                <Link to={`/mycv/${cv.id}`} onClick={()=>{props.setPreviousCV(cv.id)}}>
                                    <img src='emptycv.svg' width='150px' height='180px' alt='document'/>
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
                                            })
                                        }}
                                        >Delete</button>
                            </div>
                        )}
                        <img
                            src='emptycvplus.svg'
                            width='150px'
                            height='180px'
                            alt='document'
                            onClick={(event)=>{
                                event.preventDefault()
                                cvService.createEmptyCV().then(response => {
                                    props.updateCVs()
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

