import React from 'react'
import Toolbar from './Toolbar'
import { AppState } from '..'
import { connect } from 'react-redux'
import './MyCV.css'
import cvService, { ICV, ServiceType } from '../services/cvService'
import { Link, Route, useLocation } from 'react-router-dom'
import MyCVForm from './MyCVForm'
import { UserState } from '../reducers/userReducer'
import { updateCVs } from '../reducers/cvReducer'

interface OwnProps {}
export interface StateProps { user?: UserState, cvs?: ICV[] }
export interface DispatchProps {
    updateCVs: Function,
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user,
        cvs: state.cv.cvs
    }
}

const mapDispatchToProps: DispatchProps = {
    updateCVs
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
            <Toolbar>
                <div>
                    <button className='toolbar-button' disabled={formActive}>Clear CV</button>
                    <button className='toolbar-button'>Duplicate Default</button>
                    <button className='toolbar-button' disabled={formActive}>Set As Default CV</button>
                    <button className='toolbar-button' disabled={formActive}>Preview</button>
                </div>
            </Toolbar>
            <h1>My CV's</h1>
            <div className='cv-selector'>
                {myCVs.map((cv:ICV) => 
                    <div className='cv-item' key={cv.id}>
                        <Link to={`/mycv/${cv.id}`}>
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
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCV)

