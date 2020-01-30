import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { ICV, IProfile, ICommunication, IInfo, IContact, IProject, IExperience } from '../services/cvService'
import FormPanel from './MyCVForm/MyCVFormPanel'
import { ServiceType } from '../services/cvService'

interface OwnProps {
  cv: ICV | undefined
}

const MyCVForm: React.FC<OwnProps> = (props) => {

  const cv = props.cv

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
    >
      <div className='form-label'>Name</div>
      <Field className='form-input' placeholder='Name' type='text' name='name' />
      <ErrorMessage name='name' component='div' />
      <div className='form-label'>Content</div>
      <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />
      <ErrorMessage name='content' component='div' />
    </FormPanel>
  )

  const renderCommunicationForm = (communication:ICommunication, field: string) => { return (
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
  }

  const renderInfoForm = (info: IInfo, field: string) => {
    return(
      <FormPanel
        formValues={{
          id: info.id,
          name: info.name,
          content: info.content
        }}
        serviceType={ServiceType.INFO}
        field={field}
        key={info.id}
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

  const renderContactForm = (contact: IContact, field: string) => {
    return(
      <FormPanel
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
        field={field}
        key={contact.id}
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

  const renderProjectForm = (project: IProject, field: string) => {
    return (
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

  const renderExperienceForm = (experience: IExperience, field: string) => {
    return(
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
  }

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
      </div>
        
      <h3>Contact</h3>
      <div className='form-component-container'>
        {renderContactForm(cv.contact, 'contact')}
      </div>
      <h3>Profile</h3>
      <div className='form-component-container'>
        {cv.profile ? renderProfileForm(cv.profile, 'profile') : <FormPanel serviceType={ServiceType.PROFILE} field='profile' />}
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
        {cv.communication ? renderCommunicationForm(cv.communication, 'communication') : <FormPanel serviceType={ServiceType.COMMUNICATION} field='communication'/>}
      </div>
      <h3>Other skills</h3>
      <div className='form-component-container'>
        {cv.skills ? renderInfoForm(cv.skills, 'skills') : <FormPanel serviceType={ServiceType.INFO} field='skills' />}
      </div>
      <h3>Info</h3>
      <div className='form-component-container'>
        {cv.info ? renderInfoForm(cv.info, 'info') : <FormPanel serviceType={ServiceType.INFO} field='info' />}
      </div>
      <h3>Attachments</h3>
      <div className='form-component-container'>
        {cv.attachments ? renderInfoForm(cv.attachments, 'attachments') : <FormPanel serviceType={ServiceType.INFO} field='attachments' />}
        {!cv.attachments && <p style={{height: '110px'}}/>}
      </div>
    </div>
  )
} else {
    return (
      <div>CV not found</div>
    )
  }
}

export default MyCVForm
