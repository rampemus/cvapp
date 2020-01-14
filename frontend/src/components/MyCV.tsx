import React, { useEffect, useState } from 'react'
import Toolbar from './Toolbar'
import { AppState } from '..'
import { connect } from 'react-redux'
import './MyCV.css'
import cvService, { ICV } from '../services/cvService'
import { Link, Route, useLocation } from 'react-router-dom'
import MyCVForm from './MyCVForm'

interface OwnProps {}
export interface StateProps {}
export interface DispatchProps {}

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps: DispatchProps = { }

type Props = OwnProps & StateProps & DispatchProps

const MyCV: React.FC = (props) => {

    const [myCVs, setMyCVs] = useState<ICV[]>([])
    const location = useLocation()
    const formActive = location.pathname.includes('/mycv/') ? false : true

    useEffect(() => {
        updateCVs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateCVs = () => {
        cvService.getAllCV().then(response => {
            setMyCVs(response)
        })
    }

    const renderForm = (CVs: ICV[]) => {
        if ( CVs ) {
            return (
                <Route exact path="/mycv/:id" render={({ match }) => 
                    <MyCVForm cv={myCVs.find(cv => { return cv.id === match.params.id })}/>
                }/>
            )
        }
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
            {myCVs.map( cv => {
                return(
                    <Link to={`/mycv/${cv.id}`} key={cv.id}>{cv.name}</Link> 
                )
            })}
            <button>add new cv</button>
            {renderForm(myCVs)}
        </div>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(MyCV)

