import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ICV, IProfile, ICommunication, IInfo, IContact, IProject, IExperience } from '../services/cvService'

interface OwnProps {
  cv: ICV | undefined
}

const MyCVForm: React.FC<OwnProps> = (props) => {

  const { cv } = props

  console.log('cv form about',cv)

  const renderProfileForm = (profile:IProfile) => { return (
    <Formik
      initialValues={{ ...profile }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
      key={profile.id}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
          <ErrorMessage name='content' component='div' />
          <button>
            Cancel
            </button>
          <button type='submit' disabled={isSubmitting}>
            Save
            </button>
        </Form>
      )}
    </Formik>
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
      {({ isSubmitting }) => (
        <Form>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
          <ErrorMessage name='content' component='div' />
          <div>
            Language panel
          </div>
          <button>
            Cancel
          </button>
          <button type='submit' disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  )}

  const renderInfoForm = (info: IInfo) => {
    return(
      <Formik
        initialValues={{ ...info }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
        key={info.id}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
            <ErrorMessage name='content' component='div' />
            <div> Cancel </div>
            <button type='submit' disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    )
  }

  const renderContactForm = (contact: IContact) => {
    return(
      <Formik
        initialValues={{ ...contact }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
        key={contact.id}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field className='form-input' placeholder='Firstname' type='text' name='firstname' disabled={isSubmitting} />
            <ErrorMessage name='fistname' component='div' />
            <Field className='form-input' placeholder='LastName' type='text' name='lastname' disabled={isSubmitting} />
            <ErrorMessage name='lastname' component='div' />
            <Field className='form-input' placeholder='E-mail' type='text' name='email' disabled={isSubmitting} />
            <ErrorMessage name='email' component='div' />
            <Field className='form-input' placeholder='Phone number' type='text' name='phone' disabled={isSubmitting} />
            <ErrorMessage name='phone' component='div' />
            <Field className='form-input' placeholder='Available: 9 am -  4 pm' type='text' name='phoneAvailable' disabled={isSubmitting} />
            <ErrorMessage name='phoneAvailable' component='div' />
            <Field className='form-input' placeholder='Address' type='text' name='address' disabled={isSubmitting} />
            <ErrorMessage name='address' component='div' />
            <Field className='form-input' placeholder='Company' type='text' name='company' disabled={isSubmitting} />
            <ErrorMessage name='company' component='div' />
            <Field className='form-input' placeholder='Picture Url' type='text' name='pictureUrl' disabled={isSubmitting} />
            <ErrorMessage name='pictureUrl' component='div' />
            <button>
              Cancel
            </button>
            <button type='submit' disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    )
  }

  const renderProjectForm = (project: IProject) => {
    return (<Formik
      initialValues={{ ...project }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
      key={project.id}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <Field className='form-textarea' placeholder='Description' as='textarea' type='text' name='description' disabled={isSubmitting} />
          <ErrorMessage name='description' component='div' />
          <Field className='form-input' placeholder='Github' type='text' name='githubUrl' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <Field className='form-input' placeholder='Showcase url' type='text' name='showcaseUrl' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <Field className='form-input' placeholder='Thumbnail url' type='text' name='thumbnailUrl' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <button>
            Cancel
            </button>
          <button type='submit' disabled={isSubmitting}>
            Save
            </button>
        </Form>
      )}
    </Formik>)
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
        {({ isSubmitting }) => (
          <Form>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='description' disabled={isSubmitting} />
            <ErrorMessage name='description' component='div' />
            <Field className='form-input' placeholder='Time frame' type='text' name='timeFrame' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <button>
              Cancel
            </button>
            <button type='submit' disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    )
  }

  if (cv) { return (
    <div className='cvFormContainer'>
      CV form
      <Formik
        initialValues={{ name: cv.name, github: cv.github, techlist: cv.techlist }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <Field className='form-input' placeholder='Github url' type='text' name='github' disabled={isSubmitting} />
            <ErrorMessage name='github' component='div' />
            <Field className='form-input' placeholder='Techlist' type='text' name='techlist' disabled={isSubmitting} />
            <ErrorMessage name='techlist' component='div' />
            <button>
              Cancel
            </button>
            <button type='submit' disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
      <h3>Contact*</h3>
      Contact form
      {renderContactForm(cv.contact)}
      <h3>Profile</h3>
      Profile form
      {cv.profile && renderProfileForm(cv.profile)}
      <h3>Projects</h3>
      Projects form (Array)
      {cv.projects && cv.projects.map((project) => renderProjectForm(project))}
      <h3>References</h3>
      {cv.reference && cv.reference.map((ref) => renderContactForm(ref))}
      <h3>Work experience</h3>
      Experience form (Array)
      {cv.experience && cv.experience.map((exp) => renderExperienceForm(exp))}
      <h3>Education</h3>
      Experience^^ (Array)
      {cv.education && cv.education.map((edu) => renderExperienceForm(edu))}
      <h3>Communication</h3>
      Communication form
      {cv.communication && renderCommunicationForm(cv.communication)}
      <h3>Other skills</h3>
      Skills form
      {cv.skills && renderInfoForm(cv.skills)}
      <h3>Info</h3>
      Info form
      {cv.info && renderInfoForm(cv.info)}
      <h3>Attachments</h3>
      Info form
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
