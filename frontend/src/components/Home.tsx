import React from 'react'
import './Preview.css'
import { connect } from 'react-redux'
import { AppState } from '..'
import { ICV, IContact, IExperience, ICommunication } from '../services/cvService'

const renderTimeFrame = (timeFrame: {startDate: Date, endDate: Date}) => {
    const { startDate, endDate } = timeFrame
    const duration = endDate.valueOf() - startDate.valueOf()
    const month = 1000 * 60 * 60 * 24 * 30
    const year = 1000 * 60 * 60 * 24 * 365
    if (duration < month) 
            return <p>{startDate.getFullYear()}/{startDate.getMonth() + 1}/{startDate.getDate()+1} - {endDate.getFullYear()}/{endDate.getMonth() + 1}/{endDate.getDate()+1}</p>
    if (duration < year) 
        return <p>{startDate.getFullYear()}/{startDate.getMonth()+1} - {endDate.getFullYear()}/{endDate.getMonth()+1}</p>
    return <p>{startDate.getFullYear()} – {endDate.getFullYear()}</p>
}

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
    const reference: IContact[] | undefined = props.cv.reference
    const experience: IExperience[] | undefined = props.cv.experience
    const education: IExperience[] | undefined = props.cv.education
    const communication: ICommunication | undefined = props.cv.communication

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
                <div className='cv-container-item cv-container-item-left'>
                    <h3><img src='profile.svg' width='45px' height='45px' alt='profileimage'/>Profile</h3>
                    <hr />
                    {props.cv.profile.content.map(paragraph => <p>{paragraph}</p>)}
                </div>
            }
            {props.cv.projects &&
                <div className='cv-container-item cv-container-item-right'>
                    <h3><img src='project.svg' width='50px' height='45px' alt='icon'/>Projects</h3>
                    <hr />
                    {props.cv.projects.map(project => 
                        <div className='project-card'>
                            <div style={{
                                width: '140px'
                            }}>
                                <img src={project.thumbnailUrl} width="100%" height="100%" alt='mypicture' />
                            </div>
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
                <h3><img src='reference.svg' width='45px' height='45px' alt='icon'/>References</h3>
                <hr />
                <div className='key-value-container'>
                    {reference && reference.map((ref: IContact) => [
                        <div className='key-value-container-left'>
                            <p>{ref.firstname} {ref.lastname} {ref.company && '- ' + ref.company}</p> 
                        </div>,
                        <div className='key-value-container-right'>
                            <p>Phone num. {ref.phone} ({ref.phoneAvailable})</p>
                            <p>{ref.email}</p>    
                        </div>
                    ])}
                </div>
            </div>
            <div className='cv-container-item'>
                <h3><img src='work.svg' width='45px' height='45px' alt='icon'/>Work Experience</h3>
                <hr />
                <div className='key-value-container'>
                    {experience && experience.map((exp:IExperience) => [
                        <div className='key-value-container-left'>
                            {renderTimeFrame(exp.timeFrame)}
                        </div>,
                        <div className='key-value-container-right'>
                            <p>{exp.description}</p>
                        </div>
                    ])}
                </div>
            </div>
            <div className='cv-container-item'>
                <h3><img src='education.svg' width='45px' height='45px' alt='icon'/>Education</h3>
                <hr />
                <div className='key-value-container'>
                    {education && education.map((edu: IExperience) => [
                        <div className='key-value-container-left'>
                            {renderTimeFrame(edu.timeFrame)}
                        </div>,
                        <div className='key-value-container-right'>
                            <p>{edu.description}</p>
                        </div>
                    ])}
                </div>
            </div>
            <div className='cv-container-item'>
                <h3><img src='communication.svg' width='45px' height='45px' alt='icon'/>Communication</h3>
                <hr />
                <div className='language-container'>
                    {communication && communication.languages.map(language => <div><p>{language.language}</p><p>:</p><p>{language.level}</p></div>)}
                </div>
                {communication && communication.content.map(skill =>
                    <p>{skill}</p>
                )}
            </div>
            <div className='cv-container-item'>
                <h3><img src='skills.svg' width='45px' height='45px' alt='icon'/>Other Skills</h3>
                <hr />
                {props.cv.skills && props.cv.skills.content.map(skill =>
                    <p>{skill}</p>
                )}
            </div>
            <div className='cv-container-item'>
                <h3><img src='attachment.svg' width='45px' height='45px' alt='icon'/>Attachments <span>(Please, ask during interview for these that only exist as original copies)</span></h3>
                <hr />
                {props.cv.attachments && props.cv.attachments.content.map(attachment =>
                    <p>{attachment}</p>
                )}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, null)(Home)

