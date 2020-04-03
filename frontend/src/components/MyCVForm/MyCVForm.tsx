import React from 'react'
import { ICV, IProfile, ICommunication, IInfo, IContact, IProject, IExperience } from '../../services/cvService'
import FormPanel from './MyCVFormPanel'
import { ServiceType } from '../../services/cvService'

interface OwnProps {
  cv: ICV | undefined
}

const renderProfileForm = (profile:IProfile, field: string) => (
  <FormPanel
    formValues={{
      id: profile.id,
      name: profile.name,
      content: profile.content,
    }}
    serviceType={ServiceType.PROFILE}
    field={field}
    key={profile.id}
  />
)

const renderCommunicationForm = (communication:ICommunication, field: string) => (
<FormPanel
  formValues={{
    id: communication.id,
    name: communication.name,
    content: communication.content,
    languages: communication.languages
  }}
  field={field}
  serviceType={ServiceType.COMMUNICATION}
  key={communication.id}
  />
)
      
const renderInfoForm = (info: IInfo, field: string) => (
  <FormPanel
    formValues={{
      id: info.id,
      name: info.name,
      content: info.content
    }}
    serviceType={ServiceType.INFO}
    field={field}
    key={info.id}
  />
)

const renderContactForm = (contact: IContact, field: string) => (
  <FormPanel
    formValues={{
      id: contact.id,
      address: contact.address,
      company: contact.company,
      email: contact.email,
      firstname: contact.firstname,
      lastname: contact.lastname,
      linkedin: contact.linkedin,
      phone: contact.phone,
      phoneAvailable: contact.phoneAvailable,
      pictureUrl: contact.pictureUrl
    }}
    serviceType={ServiceType.CONTACT}
    field={field}
    key={contact.id}
  />
)

const renderProjectForm = (project: IProject, field: string) => (
  <FormPanel
    formValues={{
      id: project.id,
      description: project.description,
      githubUrl: project.githubUrl,
      name: project.name,
      showcaseUrl: project.showcaseUrl,
      thumbnailUrl: project.thumbnailUrl
    }}
    serviceType={ServiceType.PROJECT}
    field={field}
    key={project.id}
  />
)

const renderExperienceForm = (experience: IExperience, field: string) => (
  <FormPanel
    formValues={{
      id: experience.id,
      description: experience.description,
      name: experience.name,
      timeFrame: experience.timeFrame,
    }}
    serviceType={ServiceType.EXPERIENCE}
    field={field}
    key={experience.id}
  /> 
)
const MyCVForm: React.FC<OwnProps> = (props) => {
  
  const cv = props.cv
              
  if (cv) { return (
    <div className='cvFormContainer'>
      <div className='form-component-container'>
        <FormPanel
          formValues={{
            id: cv.id,
            name: cv.name,
            github: cv.github,
            techlist: cv.techlist
          }}
          serviceType={ServiceType.CV}
          field=''
        />
      </div>
        
      <h3>Contact</h3>
      <div className='form-component-container'>
        {renderContactForm(cv.contact, 'contact')}
      </div>
      <h3>Profile</h3>
      <div className='form-component-container'>
        {cv.profile
        ? renderProfileForm(cv.profile, 'profile')
        : <FormPanel serviceType={ServiceType.PROFILE} field='profile' />}
      </div>
      <h3>Projects</h3>
      <div className='form-component-container'>
        {cv.projects && cv.projects.map((project) => renderProjectForm(project, 'projects'))}
        <FormPanel serviceType={ServiceType.PROJECT} field='projects'/>
      </div>
      <h3>References</h3>
      <div className='form-component-container'>
        {cv.reference && cv.reference.map((ref) => renderContactForm(ref, 'reference'))}
        <FormPanel serviceType={ServiceType.CONTACT} field='reference'/>
      </div>
      <h3>Work experience</h3>
      <div className='form-component-container'>
        {cv.experience && cv.experience.map((exp) => renderExperienceForm(exp, 'experience'))}
        <FormPanel serviceType={ServiceType.EXPERIENCE} field='experience'/>
      </div>
      <h3>Education</h3>
      <div className='form-component-container'>
        {cv.education && cv.education.map((edu) => renderExperienceForm(edu, 'education'))}
        <FormPanel serviceType={ServiceType.EXPERIENCE} field='education'/>
      </div>
      <h3>Communication</h3>
      <div className='form-component-container'>
        {cv.communication 
        ? renderCommunicationForm(cv.communication, 'communication') 
        : <FormPanel serviceType={ServiceType.COMMUNICATION} field='communication'/>}
      </div>
      <h3>Other skills</h3>
      <div className='form-component-container'>
        {cv.skills
        ? renderInfoForm(cv.skills, 'skills')
        : <FormPanel serviceType={ServiceType.INFO} field='skills' />}
      </div>
      <h3>Info</h3>
      <div className='form-component-container'>
        {cv.info
        ? renderInfoForm(cv.info, 'info')
        : <FormPanel serviceType={ServiceType.INFO} field='info' />}
      </div>
      <h3>Attachments</h3>
      <div className='form-component-container'>
        {cv.attachments
        ? renderInfoForm(cv.attachments, 'attachments')
        : <FormPanel serviceType={ServiceType.INFO} field='attachments' />}
        {!cv.attachments && <p style={{height: '110px'}}/>}
      </div>
      <div id='EndOfPage'></div>
    </div>
  )
} else {
    return (
      <div>CV not found</div>
    )
  }
}

export default MyCVForm
