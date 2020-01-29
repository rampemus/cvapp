import React from 'react'
import './Preview.css'
import { connect } from 'react-redux'
import { AppState } from '..'
import { ICV } from '../services/cvService'


interface OwnProps { }
export interface StateProps {
    cv?: ICV
}
export interface DispatchProps { }

const mapStateToProps = (state: AppState, props: OwnProps) => {
    return {
        cv: state.cv.cvs[0]
    }
}

// const mapDispatchToProps: DispatchProps = { functionName }

type Props = OwnProps & StateProps & DispatchProps

const Home: React.FC<Props> = (props) => {
    console.log('Home props.cv', props.cv)
    if (!props.cv) {
        return <div>No default cv</div>
    } 
    const contact = props.cv.contact

    return(
        <div className='cv-container'>
            <div className='cv-container-item contact-container'>
                <div>
                    <p>{contact.firstname} {contact.lastname}</p>
                    <p>{contact.address}</p>
                    <p>Phone num. {contact.phone}</p>
                    <p>{contact.email}</p>
                </div>
                <div>
                    <img src={contact.pictureUrl} width='120px' alt='mypicture' />
                </div>
            </div>
            <h1>Curriculum Vitae</h1>
            <div className='cv-container-item cv-container-item-first'>
                {props.cv.github && <p>Github: <a href={props.cv.github}>{props.cv.github}</a></p>}
                {props.cv.techlist && <p>{props.cv.techlist}</p>}
            </div>
            {props.cv.profile && 
                <div className='cv-container-item-left'>
                    <h3>Profile</h3>
                    <hr />
                    {props.cv.profile.content.map(paragraph => <p>{paragraph}</p>)}
                </div>
            }
            {props.cv.projects &&
                <div className='cv-container-item-right'>
                    <h3>Projects</h3>
                    <hr />
                    {props.cv.projects.map(project => 
                        <div className='project-card'>
                            <img src={project.thumbnailUrl} width='140px' alt='mypicture' />
                            <div>
                                <h4>{project.name}</h4>
                                <p>{project.description}</p>
                                <p className='project-card-links'><a href={project.githubUrl}>github</a> - <a href={project.showcaseUrl}>showcase</a></p>
                            </div>
                        </div>
                    )}
                </div>
            }
            <div className='cv-container-item'>
                <h3>References</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Education</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Communication</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Other Skills</h3>
                <hr />

            </div>
            <div className='cv-container-item'>
                <h3>Attachments</h3>
                <hr />

            </div>
        </div>
    )
}

export default connect(mapStateToProps, null)(Home)

