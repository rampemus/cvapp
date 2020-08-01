import { IDetails, InfoSchema, ProjectSchema, ContactSchema, ProfileSchema, CommunicationSchema, ExperienceSchema, CVSchema, IFormattedJoiError } from './validators'
import React from 'react'
import MyCVFormDateSelector from '../components/MyCVForm/MyCVFormDateSelector'
import { Field, FieldArray } from 'formik'
import MyCVFormLanguageLevelSelector, { ILevel } from '../components/MyCVForm/MyCVFormLanguageLevelSelector'

const getValidatorResult = (values: any, field: string): [IDetails] => {
  let validationResult = null
  switch (field) {
    case 'info': {
      validationResult = InfoSchema.validate(values)
      break
    }
    case 'projects': {
      validationResult = ProjectSchema.validate(values)
      break
    }
    case 'attachments': {
      validationResult = InfoSchema.validate(values)
      break
    }
    case 'reference': {
      validationResult = ContactSchema.validate(values)
      break
    }
    case 'skills': {
      validationResult = InfoSchema.validate(values)
      break
    }
    case 'contact': {
      validationResult = ContactSchema.validate(values)
      break
    }
    case 'profile': {
      validationResult = ProfileSchema.validate(values)
      break
    }
    case 'communication': {
      validationResult = CommunicationSchema.validate(values)
      break
    }
    case 'experience': {
      validationResult = ExperienceSchema.validate(values)
      break
    }
    case 'education': {
      validationResult = ExperienceSchema.validate(values)
      break
    }
    default: {
      validationResult = CVSchema.validate(values)
      break
    }
  }
  return validationResult?.error?.details
}

const renderFields = (id: string, isSubmitting: boolean, errors: IFormattedJoiError | any, values: any, setValues: Function, field: string) => {
  if (field === 'experience' || field === 'education') return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label'>Time duration</div>
    <div className='timeFrameContainer'>
      <div>
        <MyCVFormDateSelector id={'StartTime' + id} date={values.timeFrame.startDate} handleChange={(newDate) => {
          setValues({
            ...values, timeFrame: {
              startDate: newDate,
              endDate: values.timeFrame.endDate,
            }
          })
        }} />
      </div>
      <div className='time-divider'>-</div>
      <div>
        <MyCVFormDateSelector id={'EndTime' + id} date={values.timeFrame.endDate} handleChange={(newDate) => {
          setValues({
            ...values, timeFrame: {
              startDate: values.timeFrame.startDate,
              endDate: newDate,
            }
          })
        }} />
      </div>
    </div>
    <div className='form-input-error-message'>{errors.id === id
      ? errors.timeFrame : ''}</div>
    <div className='form-label'>Description</div>
    <Field id={field + 'Descritpion' + id} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>
  </>

  if (field === 'info' || field === 'attachments' || field === 'skills') return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} className='form-input' placeholder='Name' type='text' name='name' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label'>Content</div>
    <Field id={field + 'Content' + id} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}
    </div>
  </>

  if (field === 'projects') return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label'>Description</div>
    <Field id={field + 'Description' + id} className='form-textarea' placeholder='Description' as='textarea' type='text' name='content' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>
    <div className='form-label'>Github</div>
    <Field id={field + 'GithubUrl' + id} className='form-input' placeholder='Github url' type='text' name='githubUrl' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.githubUrl : ''}</div>
    <div className='form-label'>Showcase</div>
    <Field id={field + 'ShowcaseUrl' + id} className='form-input' placeholder='Showcase url' type='text' name='showcaseUrl' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.showcaseUrl : ''}</div>
    <div className='form-label'>Thumbnail</div>
    <Field id={field + 'ThumbnailUrl' + id} className='form-input' placeholder='Thumbnail url' type='text' name='thumbnailUrl' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.thumbnailUrl : ''}</div>
  </>

  if (field === 'contact' || field === 'reference') return <>
    <div className='form-label'>Firstname</div>
    <Field id={field + 'Firstname' + id} className='form-input' placeholder='Firstname' type='text' name='firstname' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.firstname : ''}</div>
    <div className='form-label'>Lastname</div>
    <Field id={field + 'Lastname' + id} className='form-input' placeholder='LastName' type='text' name='lastname' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.lastname : ''}</div>
    <div className='form-label'>E-mail</div>
    <Field id={field + 'Email' + id} className='form-input' placeholder='mailto@mail.com' type='text' name='email' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.email : ''}</div>
    <div className='form-label'>Linkedin</div>
    <Field id={field + 'Linkedin' + id} className='form-input' placeholder='www.linkedin.com/in/xxxxx-xxxxxx-XXXXXXXXX' type='text' name='linkedin' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.linkedin : ''}</div>
    <div className='form-label'>Phone</div>
    <Field id={field + 'Phone' + id} className='form-input' placeholder='+358000000000' type='text' name='phone' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.phone : ''}</div>
    <div className='form-label'>Available</div>
    <Field id={field + 'PhoneAvailable' + id} className='form-input' placeholder='Available during 9 am -  4 pm' type='text' name='phoneAvailable' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.phoneAvailable : ''}</div>
    <div className='form-label'>Address</div>
    <Field id={field + 'Address' + id} className='form-input' placeholder='Streetname 1 A 1, 00100 Cityname' type='text' name='address' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.address : ''}</div>
    <div className='form-label'>Company</div>
    <Field id={field + 'Company' + id} className='form-input' placeholder='Company name' type='text' name='company' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.company : ''}</div>
    <div className='form-label'>Picture</div>
    <Field id={field + 'PictureUrl' + id} className='form-input' placeholder='Picture Url' type='text' name='pictureUrl' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.pictureUrl : ''}</div>
  </>

  if (field === 'profile') return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} className='form-input' placeholder='Name' type='text' name='name' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label'>Content</div>
    <Field id={field + 'Content' + id} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}
    </div>
  </>

  if (field === 'communication') return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label language-label'>Languages</div>
    <FieldArray name="languages" render={() => (
      <div className='language-panel'>
        {values.languages && values.languages.map((language: any, index: number) => <div className='language-pair' key={index + 'language-pair'}>
          <Field id={'LanguageNameField' + id + index} className='form-input' name={`languages.${index}.language`} placeholder='Language name' />
          <MyCVFormLanguageLevelSelector
            id={'LanguageLevelSelector' + id + index}
            initLevel={language.level}
            handleChange={(newLevel) => {
              const newValues = {
                ...values,
                languages: values.languages.map((entry: { language: string, level: string }) =>
                  entry.language === language.language ? { language: entry.language, level: newLevel } : entry)
              }
              setValues(newValues)
            }
            } />
          <button className='form-button' onClick={(event) => {
            event.preventDefault()
            const newValues = {
              ...values,
              languages: values.languages.filter((entry: { language: string, level: string }) =>
                entry.language !== language.language)
            }
            setValues(newValues)
          }}>delete</button>
        </div>
        )}
        <button
          id={'AddLanguage' + id}
          className='add-language-button form-button'
          disabled={isSubmitting}
          onClick={(event) => {
            event.preventDefault()
            const newValues = {
              ...values,
              languages: values.languages.concat({ language: '', level: ILevel.Elementary })
            }
            setValues(newValues)
          }}
        > add language </button>
      </div>
    )} />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.languages : ''}</div>
    <div className='form-label'>Content</div>
    <Field id={field + 'Content' + id} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>
  </>

  return <>
    <div className='form-label'>Name</div>
    <Field id={field + 'Name' + id} className='form-input' placeholder='CV name' type='text' name='name' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>
    <div className='form-label'>Github</div>
    <Field id={field + 'Github' + id} className='form-input' placeholder='Github url' type='text' name='github' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.github : ''}</div>
    <div className='form-label'>Techlist</div>
    <Field id={field + 'Techlist' + id} className='form-input' placeholder='Java, CSS, Python, ...' type='text' name='techlist' />
    <div className='form-input-error-message'>{errors.id === id
      ? errors.techlist : ''}</div>
  </>

}

const stringToArray = (data: string) => {
  return data.split('\n')
}
const arrayToString = (data: string[]) => {
  return data.join('\n')
}

export { getValidatorResult, renderFields, stringToArray, arrayToString }