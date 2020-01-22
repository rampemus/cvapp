import React from 'react'
import Toolbar from './Toolbar'
import { AppState } from '..'
import { connect } from 'react-redux'
import './MyCV.css'
import { ICV } from '../services/cvService'
import { Link, Route, useLocation } from 'react-router-dom'
import MyCVForm from './MyCVForm'
import { UserState } from '../reducers/userReducer'

interface OwnProps {}
export interface StateProps { user?: UserState, cvs?: ICV[] }
export interface DispatchProps {}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user,
        cvs: state.cv.cvs
    }
}

// const mapDispatchToProps: DispatchProps = {}

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
                    <button className='toolbar-button'>Duplicate Default CV</button>
                    <button className='toolbar-button' disabled={formActive}>Set As Default CV</button>
                    <button className='toolbar-button' disabled={formActive}>Preview</button>
                </div>
            </Toolbar>
            <p>CV selector here</p>
            {myCVs.map((cv:ICV) => {
                return(
                    <Link to={`/mycv/${cv.id}`} key={cv.id}>{cv.name}</Link> 
                )
            })}
            <button>add new cv</button>
            {renderForm(myCVs)}
        </div>
    )
}

export default connect(mapStateToProps,null)(MyCV)

