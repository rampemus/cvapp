import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { ICV, IProfile, ICommunication, IInfo, IContact, IProject, IExperience } from '../services/cvService'
import FormPanel from './MyCVForm/MyCVFormPanel'
import FormPanelExperience from './MyCVForm/MyCVFormPanelExperience'
import FormPanelCommunication from './MyCVForm/MyCVFormPanelCommunication'
import { ServiceType } from '../services/cvService'

interface OwnProps {
  cv: ICV | undefined
}

const MyCVForm: React.FC<OwnProps> = (props) => {

  const { cv } = props

  const renderProfileForm = (profile:IProfile) => { return (
    <FormPanel
      formValues={{
        id: profile.id,
        name: profile.name,
        content: profile.content,
      }}
      serviceType={ServiceType.PROFILE}
    >
      <div className='form-label'>Name</div>
      <Field className='form-input' placeholder='Name' type='text' name='name' />
      <ErrorMessage name='name' component='div' />
      <div className='form-label'>Content</div>
      <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />
      <ErrorMessage name='content' component='div' />
    </FormPanel>
  )}

  const renderCommunicationForm = (communication:ICommunication) => { return (
    <FormPanelCommunication
      formValues={{
        id: communication.id,
        name: communication.name,
        content: communication.content,
        languages: communication.languages
      }}
      key={communication.id}
    />
  )}

  const renderInfoForm = (info: IInfo) => {
    return(
      <FormPanel
        formValues={{
          id: info.id,
          name: info.name,
          content: info.content
        }}
        serviceType={ServiceType.INFO}
      >
        <div className='form-label'>Name</div>
        <Field className='form-input' placeholder='Name' type='text' name='name'/>
        <ErrorMessage name='name' component='div' />
        <div className='form-label'>Content</div>
        <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content'/>
        <ErrorMessage name='content' component='div' />
      </FormPanel>
    )
  }

  const renderContactForm = (contact: IContact, noDelete?: boolean) => {
    return(
      <FormPanel
        key={contact.id}
        formValues={{
          id: contact.id,
          address: contact.address,
          company: contact.company,
          email: contact.email,
          firstname: contact.firstname,
          lastname: contact.lastname,
          phone: contact.phone,
          phoneAvailable: contact.phoneAvailable,
          pictureUrl: contact.pictureUrl
        }}
        serviceType={ServiceType.CONTACT}
      >
        <div className='form-label'>Firstname</div>
        <Field className='form-input' placeholder='Firstname' type='text' name='firstname'/>
        <ErrorMessage name='fistname' component='div' />
        <div className='form-label'>Lastname</div>
        <Field className='form-input' placeholder='LastName' type='text' name='lastname'/>
        <ErrorMessage name='lastname' component='div' />
        <div className='form-label'>E-mail</div>
        <Field className='form-input' placeholder='mailto@mail.com' type='text' name='email'/>
        <ErrorMessage name='email' component='div' />
        <div className='form-label'>Phone</div>
        <Field className='form-input' placeholder='+358000000000' type='text' name='phone'/>
        <ErrorMessage name='phone' component='div' />
        <div className='form-label'>Available</div>
        <Field className='form-input' placeholder='Available during 9 am -  4 pm' type='text' name='phoneAvailable'/>
        <ErrorMessage name='phoneAvailable' component='div' />
        <div className='form-label'>Address</div>
        <Field className='form-input' placeholder='Streetname 1 A 1, 00100 Cityname' type='text' name='address'/>
        <ErrorMessage name='address' component='div' />
        <div className='form-label'>Company</div>
        <Field className='form-input' placeholder='Company name' type='text' name='company'/>
        <ErrorMessage name='company' component='div' />
        <div className='form-label'>Picture</div>
        <Field className='form-input' placeholder='Picture Url' type='text' name='pictureUrl'/>
        <ErrorMessage name='pictureUrl' component='div' />
      </FormPanel>
    )
  }

  const renderProjectForm = (project: IProject) => {
    return (
      <FormPanel
        key={project.id}
        formValues={{
          id: project.id,
          description: project.description,
          githubUrl: project.githubUrl,
          name: project.name,
          showcaseUrl: project.showcaseUrl,
          thumbnailUrl: project.thumbnailUrl
        }}
        serviceType={ServiceType.PROJECT}
      >
        <div className='form-label'>Name</div>
        <Field className='form-input' placeholder='Name' type='text' name='name'/>
        <ErrorMessage name='name' component='div' />
        <div className='form-label'>Description</div>
        <Field className='form-textarea' placeholder='Description' as='textarea' type='text' name='description'/>
        <ErrorMessage name='description' component='div' />
        <div className='form-label'>Github</div>
        <Field className='form-input' placeholder='Github url' type='text' name='githubUrl'/>
        <ErrorMessage name='name' component='div' />
        <div className='form-label'>Showcase</div>
        <Field className='form-input' placeholder='Showcase url' type='text' name='showcaseUrl'/>
        <ErrorMessage name='name' component='div' />
        <div className='form-label'>Thumbnail</div>
        <Field className='form-input' placeholder='Thumbnail url' type='text' name='thumbnailUrl'/>
        <ErrorMessage name='name' component='div' />
      </FormPanel>
    )
  }

  const renderExperienceForm = (experience: IExperience) => {
    return(
      <FormPanelExperience
        formValues={{
          id: experience.id,
          description: experience.description,
          name: experience.name,
          timeFrame: experience.timeFrame,
        }}
        key={experience.id}
      /> 
    )
  }

  if (cv) { return (
    <div className='cvFormContainer'>
      <FormPanel
        formValues={{
          id: cv.id,
          name: cv.name,
          github: cv.github,
          techlist: cv.techlist
        }}
        serviceType={ServiceType.CV}
      >
        <div className='form-label'>Name</div>
        <Field className='form-input' placeholder='CV name' type='text' name='name' />
        <ErrorMessage name='name' component='div' />
        <div className='form-label'>Github</div>
        <Field className='form-input' placeholder='Github url' type='text' name='github'/>
        <ErrorMessage name='github' component='div' />
        <div className='form-label'>Techlist</div>
        <Field className='form-input' placeholder='Java, CSS, Python, ...' type='text' name='techlist'/>
        <ErrorMessage name='techlist' component='div' />
      </FormPanel>
        
      <h3>Contact*</h3>
      {renderContactForm(cv.contact, true)}
      <h3>Profile</h3>
      {cv.profile && renderProfileForm(cv.profile)}
      <h3>Projects</h3>
      {cv.projects && cv.projects.map((project) => renderProjectForm(project))}
      <h3>References</h3>
      {cv.reference && cv.reference.map((ref) => renderContactForm(ref))}
      <h3>Work experience</h3>
      {cv.experience && cv.experience.map((exp) => renderExperienceForm(exp))}
      <h3>Education</h3>
      {cv.education && cv.education.map((edu) => renderExperienceForm(edu))}
      <h3>Communication</h3>
      {cv.communication && renderCommunicationForm(cv.communication)}
      <h3>Other skills</h3>
      {cv.skills && renderInfoForm(cv.skills)}
      <h3>Info</h3>
      {cv.info && renderInfoForm(cv.info)}
      <h3>Attachments</h3>
      {cv.attachments && renderInfoForm(cv.attachments)}
    </div>
  )
} else {
    return (
      <div>CV not found</div>
    )
  }
}

export default MyCVForm
