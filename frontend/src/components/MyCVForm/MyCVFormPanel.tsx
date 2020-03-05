import React from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import cvService, { ServiceType } from '../../services/cvService'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateCVs, addEmptyCVObject, removeTempCVObject, CVAction } from '../../reducers/cvReducer'
import MyCVFormDateSelector from './MyCVFormDateSelector'
import MyCVFormLanguageLevelSelector, { ILevel } from './MyCVFormLanguageLevelSelector'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'
import { ExperienceSchema, IDetails, CommunicationSchema, InfoSchema, ProjectSchema, ContactSchema, ProfileSchema, IFormattedJoiError } from '../../utils/validators'

interface OwnProps {
  formValues?: Object,
  field: string,
  serviceType: ServiceType,
  children?: any,
}
export interface StateProps {
  user: UserState
}
export interface DispatchProps {
  updateCVs: (user: UserState) => any,
  addEmptyCVObject(id: string, field: string): CVAction,
  removeTempCVObject(id: string, field: string, objectId: string): CVAction
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

const stringToArray = (data:string) => {
  return data.split('\n')
}
const arrayToString = (data:string[]) => {
  return data.join('\n')
}
const renderChildren = (id: string, isSubmitting: boolean, errors: IFormattedJoiError | any, values: any, setValues: Function, field:string) => {
  console.log(field)
  if (field === 'info' || field === 'attachments' || field === 'skills') return ([
      <div key={id + 'namelabel'} className='form-label'>Name</div>,
      <Field key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
      <div key={id + 'contentlabel'}className='form-label'>Content</div>,
      <Field key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />,
    ])
  if (field === 'projects') return ( [
      <div key={id + 'namelabel'} className='form-label'>Name</div>,
      <Field key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
      <div key={id + 'descriptionlabel'} className='form-label'>Description</div>,
      <Field key={id + 'descriptiontextarea'} className='form-textarea' placeholder='Description' as='textarea' type='text' name='description' />,
      <div key={id + 'githublabel'} className='form-label'>Github</div>, 
      <Field key={id + 'githubinput'} className='form-input' placeholder='Github url' type='text' name='githubUrl' />,
      <div key={id + 'showcaselabel'} className='form-label'>Showcase</div>,
      <Field key={id + 'showcaseurlfield'} className='form-input' placeholder='Showcase url' type='text' name='showcaseUrl' />,
      <div key={id + 'thumbnaillabel'} className='form-label'>Thumbnail</div>,
      <Field key={id + 'thumbnailurlfield'} className='form-input' placeholder='Thumbnail url' type='text' name='thumbnailUrl' />,
    ])
  if (field === 'contact' || field === 'reference') return ([
    <div key={id + 'firstnamelabel'} className='form-label'>Firstname</div>,
    <Field key={id + 'firstnameinput'} className='form-input' placeholder='Firstname' type='text' name='firstname' />,
    <div key={id + 'lastnamelabel'} className='form-label'>Lastname</div>,
    <Field key={id + 'lastnamefield'} className='form-input' placeholder='LastName' type='text' name='lastname' />,
    <div key={id + 'emaillabel'} className='form-label'>E-mail</div>,
    <Field key={id + 'emailfield'} className='form-input' placeholder='mailto@mail.com' type='text' name='email' />,
    <div key={id + 'linkedinlabel'} className='form-label'>Linkedin</div>,
    <Field key={id + 'linkedinfield'} className='form-input' placeholder='www.linkedin.com/in/xxxxx-xxxxxx-XXXXXXXXX' type='text' name='linkedin' />,
    <div key={id + 'phonelabel'} className='form-label'>Phone</div>,
    <Field key={id + 'phonefield'} className='form-input' placeholder='+358000000000' type='text' name='phone' />,
    <div key={id + 'availablelabel'} className='form-label'>Available</div>,
    <Field key={id + 'availablefield'} className='form-input' placeholder='Available during 9 am -  4 pm' type='text' name='phoneAvailable' />,
    <div key={id + 'addresslabel'} className='form-label'>Address</div>,
    <Field key={id + 'addressfield'} className='form-input' placeholder='Streetname 1 A 1, 00100 Cityname' type='text' name='address' />,
    <div key={id + 'companylabel'} className='form-label'>Company</div>,
    <Field key={id + 'companyfield'} className='form-input' placeholder='Company name' type='text' name='company' />,
    <div key={id + 'picturelabel'} className='form-label'>Picture</div>,
    <Field key={id + 'picturefield'} className='form-input' placeholder='Picture Url' type='text' name='pictureUrl' />,
    ])
  if (field === 'profile') return ([
      <div key={id + 'namelabel'} className='form-label'>Name</div>,
      <Field key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
    <div key={id + 'contentlabel'} className='form-label'>Content</div>,
    <Field key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />,
    ])
  if (field === 'communication') return ([
      <div key={id + 'namelabel'}  className='form-label'>Name</div>,
      <Field key={id + 'namefield'}className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />,
      <div key={id + 'nameerrormessage'} className='form-input-error-message'>{ errors && errors.field === 'name' && errors.id === id
      ? errors.message : ''}</div>,
      <div key={id + 'languagesfield'} className='form-label'>Languages</div>,
      <FieldArray key={id + 'languagesfieldarray'} name="languages" render={() => (
        <div className='language-panel' key={values.id + 'languagepanel'}>
          {values.languages && values.languages.map((language: any, index: number) => {
            console.log(values)
            return (<div className='language-pair' key={index + 'language-pair'}>
              <Field className='form-input' name={`languages.${index}.language`} placeholder='Language name' />
              <MyCVFormLanguageLevelSelector
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
            </div>)
          })}
          <button
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
          >
            add language
                  </button>
        </div>
      )} />,
      <div key={id + 'contentlabel'} className='form-label'>Content</div>,
      <Field key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />,
      <div key={id + 'contenterrormessage'} className='form-input-error-message'>{errors && errors.field === 'content' && errors.id === id ? errors.message : ''}</div>
    ])
  return([
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field key={id + 'namefield'} className='form-input' placeholder='CV name' type='text' name='name' />,
    <div key={id + 'githublabel'} className='form-label'>Github</div>,
    <Field key={id + 'githubfield'} className='form-input' placeholder='Github url' type='text' name='github' />,
    <div key={id + 'techlistlabel'} className='form-label'>Techlist</div>,
    <Field key={id + 'techlistfield'} className='form-input' placeholder='Java, CSS, Python, ...' type='text' name='techlist' />,
  ])
  
}

const mapDispatchToProps: DispatchProps = {
  updateCVs, addEmptyCVObject, removeTempCVObject
}

type Props = OwnProps & StateProps & DispatchProps

const MyCVFormPanel: React.FC<Props> = (props) => {

  const formValues = props.formValues ? Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => [key, value ? value : ''])) : null
  
  const showPanelId = false

  const serviceType = props.serviceType
  const location = useLocation()
  const field = props.field

  interface IUserFriendlyError {
    message: string,
    field: string,
    id: string
  }

  if (formValues && ( field === 'experience' || field === 'education')) { 
    const clearActionValues = { description: '', name: '', timeFrame: { startDate: new Date(), endDate: new Date() } }
    const experience = formValues
    return (
      <Formik
        initialValues={{ ...experience }}
        validate={(values) => {
          const validationResult = ExperienceSchema.validate(values)
          const errorArray: [IDetails] = validationResult.error && validationResult.error.details
          if (errorArray && errorArray.length > 0) return {
            message: errorArray[0].message.includes('fails to match the required pattern')
            ? '"' + errorArray[0].context.key + '" has forbidden characters'
            : errorArray[0].message,
            field: errorArray[0].context.key,
            id: experience.id
          }
          return {}
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            cvService.createObject(serviceType, values, id, props.user, field).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
            cvService.modifyObject(serviceType, values.id, changes, props.user).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          }
        }}
      >
        {({ errors, isSubmitting, values, setValues }) => {
          return <Form className='form-component'>
            {showPanelId && values.id}

            <div className='form-label'>Name</div>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            {errors && errors.field === 'name' && errors.id === experience.id
            ? <div className='form-input-error-message'>{errors.message}</div> : ''}
            <div className='form-label'>Time duration</div>
            <div className='timeFrameContainer'>
              <div>
                <MyCVFormDateSelector date={values.timeFrame.startDate} handleChange={(newDate) => {
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
                <MyCVFormDateSelector date={values.timeFrame.endDate} handleChange={(newDate) => {
                  setValues({
                    ...values, timeFrame: {
                      startDate: values.timeFrame.startDate,
                      endDate: newDate,
                    }
                  })
                }} />
              </div>
            </div>
            {errors && errors.field === 'timeFrame' && errors.id === experience.id
            ? <div className='form-input-error-message'>{errors.message}</div> : ''}
            <div className='form-label'>Description</div>
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='description' disabled={isSubmitting} />
            {errors && errors.field === 'description' && errors.id === experience.id
            ? <div className='form-input-error-message'>{errors.message}</div> : '' }

            <DeleteButton isSubmitting={isSubmitting} handleDelete={(event: any) => {
              event.preventDefault()
              if (values.id.includes('temp')) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id, props.user)
              }
            }} />
            <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
            <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={experience} />
            <SaveButton isSubmitting={isSubmitting} />
          </Form>
        }}
      </Formik>
    )
  } else if (formValues && field === 'communication') {
    const clearActionValues = { name: '', languages: [{ language: '', level: '' }], content: [''] }
    const communication = formValues

    return (
      <Formik
        initialValues={{ ...communication }}
        validate={(values) => {
          const validationResult = CommunicationSchema.validate(values)
          console.log(validationResult)
          const errorArray: [IDetails] = validationResult.error && validationResult.error.details
          if (errorArray && errorArray.length > 0) return {
            message: errorArray[0].message.includes('fails to match the required pattern')
              ? '"' + errorArray[0].context.key + '" has forbidden characters'
              : errorArray[0].message,
            field: errorArray[0].context.key,
            id: communication.id
          }
          return {}
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            cvService.createObject(serviceType, values, id, props.user, field).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
            cvService.modifyObject(serviceType, values.id, changes, props.user).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          }
        }}
      >
        {({ values, errors, isSubmitting, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {renderChildren(communication.id, isSubmitting, errors, values, setValues, props.field)} 

            <DeleteButton isSubmitting={isSubmitting} handleDelete={(event: any) => {
              event.preventDefault()
              if (values.id.includes('temp')) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id, props.user)
              }
            }} />
            <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
            <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={communication} />
            <SaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>)
  } else if (formValues) {
    const clearActionValues = props.formValues
      ? Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => key === 'id' ? [key, value] : [key, ''])) 
      : null
    
    return(
      <Formik
        initialValues={Object.fromEntries(
          Object.entries(formValues)
            .map(([key, value]) => key === 'content' ? [key, arrayToString(value)] : [key, value])
        )}
        enableReinitialize
        validate={(values) => {
          let validationResult = null
          switch(field) {
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
          }
          console.log(validationResult)
          const errorArray: [IDetails] = validationResult && validationResult.error && validationResult.error.details
          if (errorArray && errorArray.length > 0) return {
          message: errorArray[0].message.includes('fails to match the required pattern')
          ? '"' + errorArray[0].context.key + '" has forbidden characters'
          : errorArray[0].message,
          field: errorArray[0].context.key,
          id: formValues.id}
          return {}
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log('onSubmit', values)
          if ( values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            const newValues = Object.fromEntries(
              Object.entries(values)
                .filter(([key, value]) => formValues[key] !== value)
                .map(([key, value]) => key === 'content' ? [key, stringToArray(value)] : [key, value])
            )
            cvService.createObject(serviceType, newValues, id, props.user, field).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(
              Object.entries(values)
                .filter(([key, value]) => formValues[key] !== value)
                .map(([key, value]) => key === 'content' ? [key,stringToArray(value)] : [key, value])
            )
            cvService.modifyObject(serviceType, values.id, changes, props.user).then(response => {
              props.updateCVs(props.user)
              setSubmitting(false)
            })
          }
        }}
        key={formValues.id + field }
      >
        {({ isSubmitting, errors, values, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {renderChildren(formValues.id, isSubmitting, errors, values, setValues, props.field)}

            <DeleteButton isSubmitting={isSubmitting || field === 'contact' || field === ''} handleDelete={(event:any)=>{
              event.preventDefault()
              if ( values.id.includes('temp') ) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id, props.user)
                props.updateCVs(props.user)
              }
            }}/>
            <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues}/>
            <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={formValues}/>
            <SaveButton isSubmitting={isSubmitting}/>
          </Form>
        )}
      </Formik>
    )
  } else { return (
    <div
      className='form-component-empty'
      key={props.field+'-empty'}
      onClick={()=>{
        const path = location.pathname
        const CVid = path.substring('/myCV/'.length)
        props.addEmptyCVObject(CVid, field)
      }}>
        <img src='plus.svg' width='100px' height='100px' alt='add' />
      </div>
  )}
}

export default connect(mapStateToProps,mapDispatchToProps)(MyCVFormPanel)
