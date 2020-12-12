import React, { useEffect } from 'react'
import './Preview.scss'
import { connect, ConnectedProps } from 'react-redux'
import { AppState } from '..'
import { ICV, IContact, IExperience, ICommunication } from '../services/cvService'
import { setLoading } from '../reducers/loadingReducer'

const renderTimeFrame = (timeFrame: { startDate: Date, endDate: Date }) => {
  const ongoing = timeFrame.endDate.valueOf() - new Date().valueOf() > 0
  const startDate = timeFrame.startDate
  const endDate = ongoing ? new Date() : timeFrame.endDate
  const duration = endDate.valueOf() - startDate.valueOf()
  const month = 1000 * 60 * 60 * 24 * 30
  const year = 1000 * 60 * 60 * 24 * 365
  if (duration < month) {
    return ongoing
      ? <p>
        {startDate.getFullYear()}/{startDate.getMonth() + 1}/{startDate.getDate() + 1}
        &nbsp;–&nbsp;
        </p>
      : <p>
        {startDate.getFullYear()}/{startDate.getMonth() + 1}/{startDate.getDate() + 1}
        &nbsp;–&nbsp;
        {endDate.getFullYear()}/{endDate.getMonth() + 1}/{endDate.getDate() + 1}
      </p>
  }
  if (duration < year)
    return ongoing
      ? <p>
        {startDate.getFullYear()}/{startDate.getMonth() + 1}
        &nbsp;–&nbsp;
        </p>
      : <p>
        {startDate.getFullYear()}/{startDate.getMonth() + 1}
        &nbsp;–&nbsp;
        {endDate.getFullYear()}/{endDate.getMonth() + 1}
      </p>
  return ongoing
    ? <p>{startDate.getFullYear()} – </p>
    : <p>{startDate.getFullYear()} – {endDate.getFullYear()}</p>
}

interface OwnProps {
  preview?: ICV | null
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    cv: state.cv.cvs[0]
  }
}

const mapDispatchToProps = {
  setLoading
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

const Home: React.FC<Props> = (props) => {
  const cv: ICV = props.preview || props.cv
  if (!cv) {
    return <div>No default cv</div>
  }

  // for preventing using componentDidUpdate
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    props.setLoading(false)
  }, [props])

  const contact = cv.contact
  const reference: IContact[] | undefined = cv.reference
  const experience: IExperience[] | undefined = cv.experience
  const education: IExperience[] | undefined = cv.education
  const communication: ICommunication | undefined = cv.communication
  const projects = cv.projects && [...cv.projects]

  return <div className='cv-container'>
    <div className='cv-container-item contact-container'>
      <div>
        <p id='NameInfo'>{contact.firstname} {contact.lastname}</p>
        {contact.address && <p>{contact.address}</p>}
        {contact.phone && <p>Phone num. {contact.phone}</p>}
        {contact.email && <p>{contact.email}</p>}
        {contact.linkedin
          && <p>
            <a id='LinkedinProfile' href={contact.linkedin}>linkedin profile</a>
          </p>}
      </div>
      <div>
        <img
          id='ContactPicture'
          src={contact.pictureUrl}
          width='120px'
          alt='mypicture'
        />
      </div>
    </div>
    <h1>Curriculum Vitae</h1>
    <div className='cv-container-item cv-container-item-first'>
      {cv.github && <p>Github: <a href={cv.github}>{cv.github}</a></p>}
      {cv.techlist && <p>{cv.techlist}</p>}
    </div>
    <div className='cv-container-item cv-container-item-left'>
    {cv.profile &&
      <>
        <h3>
          <img src='profile.svg' width='45px' height='45px' alt='profileimage' />
          Profile
        </h3>
        <hr />
        {cv.profile.content.map((paragraph, index) =>
        <p key={`profile-p-${index}`} >
          {paragraph}
        </p>)}
      </>}
    <div className='cv-container-item'></div>
    {education && education.length > 0 &&
      <>
        <h3><img src='education.svg' width='45px' height='45px' alt='icon' />Education</h3>
        <hr />
        <div className='key-value-container'>
          {education.sort((a: IExperience, b: IExperience) =>
            b.timeFrame.endDate.getTime() - a.timeFrame.endDate.getTime()
          ).map((edu: IExperience, index) => [
            <div className='key-value-container-left' key={index + '-education-left'}>
              {renderTimeFrame(edu.timeFrame)}
            </div>,
            <div className='key-value-container-right' key={index + '-education-right'}>
              {/* <p>{edu.description}</p> */}
              {edu.content.map((eduRow, index) =>
                <p key={index + 'edu' + edu.id}>{eduRow}</p>
              )}
            </div>
          ])}
        </div>
      </>}
    </div>
    {cv.projects && cv.projects.length > 0 &&
      <div className='cv-container-item cv-container-item-right'>
        <h3><img src='project.svg' width='45px' height='40px' alt='icon' />Projects</h3>
        <hr />
        {projects && projects.sort((a, b) => { return -1 }).map((project, index) =>
          <div className='project-card' key={index + 'project'}>
            <div style={{
              width: '140px',
              marginRight: '10px'
            }}>
              <img
                id={'thumbnailImage' + project.id}
                src={project.thumbnailUrl}
                width="100%"
                alt='mypicture'
              />
            </div>
            <div>
              <h4>{project.name}</h4>
              {project.content.map((projectRow, index) =>
                <p key={index + 'project' + project.id}>{projectRow}</p>
              )}
              <p className='project-card-links'>
                {project.githubUrl
                  && <a
                    id={'githubLink' + project.id}
                    href={project.githubUrl}
                  >github</a>}
                {project.githubUrl
                  && project.showcaseUrl && ' - '}
                {project.showcaseUrl
                  && <a
                    id={'showcaseLink' + project.id}
                    href={project.showcaseUrl}
                  >showcase</a>}
              </p>
            </div>
          </div>
        )}
      </div>}
    <div className='pagebreak-stop'></div>
    <div className='pagebreak-padding'></div>
    {experience && experience.length > 0 &&
      <div className='cv-container-item'>
        <h3><img src='work.svg' width='55px' height='55px' alt='icon' />Work Experience</h3>
        <hr />
        <div className='key-value-container'>
          {experience.sort((a: IExperience, b: IExperience) =>
            b.timeFrame.endDate.getTime() - a.timeFrame.endDate.getTime()
          ).map((exp: IExperience, index) => [
            <div className='key-value-container-left' key={index + '-experience-left'}>
              {renderTimeFrame(exp.timeFrame)}
            </div>,
            <div className='key-value-container-right' key={index + '-experience-right'}>
              {/* <p>{exp.description}</p> */}
              {exp.content.map((expRow, index) =>
                <p key={index + 'exp' + exp.id}>{expRow}</p>
              )}
            </div>
          ])}
        </div>
      </div>}
    {communication &&
      <div className='cv-container-item'>
        <h3>
          <img src='communication.svg' width='45px' height='45px' alt='icon' />
          Language skills
        </h3>
        <hr />
        <div className='language-container'>
          {communication.languages.map((language, index) =>
            <div key={index + 'language-container'}>
              <p>{language.language}</p><p>:</p><p>{language.level}</p>
            </div>
          )}
        </div>
        {communication && communication.content.map((skill, index) =>
          <p key={index + 'skill'}>{skill}</p>
        )}
      </div>}
    {cv.skills &&
      <div className='cv-container-item'>
        <h3>
          <img src='skills.svg' width='45px' height='45px' alt='icon' />
          Other Skills
        </h3>
        <hr />
        {cv.skills.content.map((skill, index) =>
          <p key={index + 'skill'}>{skill}</p>
        )}
      </div>}
    {reference && reference.length > 0 &&
      <div className='cv-container-item'>
        <h3><img src='reference.svg' width='40px' height='40px' alt='icon' />References</h3>
        <hr />
        <div className='key-value-container'>
          {reference.sort((a, b) => { return -1 }).map((ref: IContact, index) => [
            <div className='key-value-container-left' key={index + '-reference-left'}>
              <p>{ref.firstname} {ref.lastname} {ref.company && '- ' + ref.company}</p>
            </div>,
            <div className='key-value-container-right' key={index + '-reference-right'}>
              <p>Phone num. {ref.phone} ({ref.phoneAvailable})</p>
              <p>{ref.email}</p>
            </div>
          ])}
        </div>
      </div>}
    <div className='pagebreak-stop'></div>
    <div className='pagebreak-padding'></div>
    {cv.attachments &&
      <div className='cv-container-item'>
        <h3><img src='attachment.svg' width='55px' height='45px' alt='icon' />Attachments</h3>
        <hr />
        {cv.attachments.content.map((attachment, index) =>
          <p key={index + 'attachment'}>{attachment}</p>
        )}
      </div>}
  </div>
}

export default connector(Home)
