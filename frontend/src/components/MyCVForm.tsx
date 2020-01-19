import React from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { ICV, IProfile, ICommunication, IInfo, IContact, IProject, IExperience } from '../services/cvService'
import MyCVFormDateSelector from './MyCVFormDateSelector'
import FormPanel from './MyCVFormPanel'

interface OwnProps {
  cv: ICV | undefined
}

const MyCVForm: React.FC<OwnProps> = (props) => {

  const { cv } = props

  const renderProfileForm = (profile:IProfile) => { return (
    <FormPanel formValues={profile} clearActionValues={{name: '', content: ''}}>
      <div className='form-label'>Name</div>
      <Field className='form-input' placeholder='Name' type='text' name='name'/>
      <ErrorMessage name='name' component='div' />
      <div className='form-label'>Content</div>
      <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content'/>
      <ErrorMessage name='content' component='div' />
    </FormPanel> 
  )}

  const renderCommunicationForm = (communication:ICommunication) => { return (
    <Formik
      initialValues={{...communication}}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
      key={communication.id}
    >
      {({ values, isSubmitting, setValues }) => (
        <Form className='form-component'>
          <div className='form-label'>Name</div>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <div className='form-label'>Languages</div>
          <FieldArray name="languages" render={() => (
            <div className='language-panel'>
              {values.languages && values.languages.map((language, index) => {
                return (<div key={index} className='language-pair'>
                  <Field className='form-input' name={`languages.${index}.language`} placeholder='Language name'/>
                  <Field className='form-input' name={`languages.${index}.level`} placeholder='Level'/>
                </div>)
              })}
            </div>
          )}/>
          <div className='form-label'>Content</div>
          <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
          <ErrorMessage name='content' component='div' />

          <button className='form-delete-button form-button' type='submit' disabled={isSubmitting}>
            Delete
          </button>
          <button
            className='form-clear-button form-button'
            type='submit'
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault()
              setValues({
                ...values,
                name: '',
                languages: [{ language: '', level: ''}],
                content: ['']
              })
            }}
          >
          Clear
          </button>

          <button
            className='form-cancel-button form-button'
            type='submit'
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault()
              setValues({ ...communication })
            }}
          >
            Cancel
          </button>
          <button className='form-save-button form-button' type='submit' disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  )}

  const renderInfoForm = (info: IInfo) => {
    return(
      <FormPanel formValues={info} clearActionValues={{ name: '', content: '' }}>
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
      <FormPanel formValues={contact} clearActionValues={{ address: '', company: '', email: '', firstname: '', lastname: '', phone: '', phoneAvailable: '', pictureUrl: ''}}>
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
    return (<FormPanel formValues={project} clearActionValues={{ description: '', githubUrl: '', name: '', showcaseUrl: '', thumbnailUrl: '' }}>
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
    </FormPanel>)
  }

  const renderExperienceForm = (experience: IExperience) => {
    return(
      <Formik
        initialValues={{ ...experience }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
        key={experience.id}
      >
        {({ isSubmitting, setValues, values }) => (
          <Form className='form-component'>
            <div className='form-label'>Name</div>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <div className='form-label'>Time duration</div>
            <div className='timeFrameContainer'>
              <div>
              <MyCVFormDateSelector date={values.timeFrame.startDate} handleChange={(newDate)=>{
                setValues( { ...values, timeFrame: {
                  startDate: newDate,
                  endDate: values.timeFrame.endDate,
                }})
              }}/>
              </div>
              <div className='time-divider'>-</div>
              <div>
              <MyCVFormDateSelector date={values.timeFrame.endDate} handleChange={(newDate) => {
                setValues({
                  ...values, timeFrame: {
                    startDate: values.timeFrame.startDate,
                    endDate: newDate,
                  }
                })
              }}/>
              </div>
            </div>
            <div className='form-label'>Content</div>
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='description' disabled={isSubmitting} />
            <ErrorMessage name='description' component='div' />

            <button className='form-delete-button form-button' type='submit' disabled={isSubmitting}>
              Delete
            </button>
            <button
              className='form-clear-button form-button'
              type='submit'
              disabled={isSubmitting}
              onClick={(event)=>{
                event.preventDefault()
                setValues({ 
                  ...values, 
                  description: '', 
                  name: '', 
                  timeFrame: {
                    startDate: new Date(),
                    endDate: new Date()
                  }
                })
              }}
            >
              Clear
            </button>
            <button
              className='form-cancel-button form-button'
              type='submit'
              disabled={isSubmitting}
              onClick={(event) => {
                event.preventDefault()
                setValues({ ...experience })
              }}
            >
              Cancel
            </button>
            <button className='form-save-button form-button' type='submit' disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    )
  }

  if (cv) { return (
    <div className='cvFormContainer'>
      <FormPanel formValues={{ id:cv.id, name: cv.name, github: cv.github, techlist: cv.techlist }} clearActionValues={{name: '', github: '', techlist: '' }}>
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
