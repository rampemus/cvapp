import React from 'react'
import Toolbar from './Toolbar'
import { AppState } from '..'
import { connect } from 'react-redux'
import MyCVSelector from './MyCVSelector'

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

    return(
        <div>
            <Toolbar>
                <div>
                    <button className='toolbar-button'>Clear CV</button>
                    <button className='toolbar-button'>Duplicate Default CV</button>
                    <button className='toolbar-button'>Set As Default CV</button>
                    <button className='toolbar-button'>Preview</button>
                </div>
            </Toolbar>
            <MyCVSelector></MyCVSelector>
            <h3>Info</h3>
            <h3>Contact</h3>
            <h3>Profile</h3>
            <h3>References</h3>
            <h3>Education</h3>
            <h3>Communication</h3>
            <h3>Other Skills</h3>
            <h3>Attachments</h3>
        </div>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(MyCV)

