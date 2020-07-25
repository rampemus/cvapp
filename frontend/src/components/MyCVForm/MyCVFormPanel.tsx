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
import { 
  ExperienceSchema,
  IDetails,
  CommunicationSchema,
  InfoSchema,
  ProjectSchema,
  ContactSchema,
  ProfileSchema,
  IFormattedJoiError,
  CVSchema
} from '../../utils/validators'

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
  addEmptyCVObject: (id: string, field: string) => CVAction,
  removeTempCVObject: (id: string, field: string, objectId: string) => CVAction
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
  if (field === 'experience' || field === 'education') return([
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'durationlabel'} className='form-label'>Time duration</div>,
    <div key={id + 'timeframecontainer'} className='timeFrameContainer'>
      <div>
        <MyCVFormDateSelector id={'StartTime'+id} date={values.timeFrame.startDate} handleChange={(newDate) => {
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
    </div>,
    <div key={id + 'timeframeerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.timeFrame : ''}</div>,
    <div key={id + 'descriptionlabel'} className='form-label'>Description</div>,
    <Field id={field + 'Descritpion' + id} key={id + 'descriptionfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />,
    <div key={id + 'descriptionerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div> 
  ])
  if (field === 'info' || field === 'attachments' || field === 'skills') return ([
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'contentlabel'}className='form-label'>Content</div>,
    <Field id={field + 'Content' + id} key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />,
    <div key={id + 'contenterrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>,
  ])
  if (field === 'projects') return ( [
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'descriptionlabel'} className='form-label'>Description</div>,
    <Field id={field + 'Description' + id} key={id + 'descriptiontextarea'} className='form-textarea' placeholder='Description' as='textarea' type='text' name='content' />,
    <div key={id + 'descriptionerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>,
    <div key={id + 'githublabel'} className='form-label'>Github</div>, 
    <Field id={field + 'GithubUrl' + id} key={id + 'githubinput'} className='form-input' placeholder='Github url' type='text' name='githubUrl' />,
    <div key={id + 'githuberrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.githubUrl : ''}</div>,
    <div key={id + 'showcaselabel'} className='form-label'>Showcase</div>,
    <Field id={field + 'ShowcaseUrl' + id} key={id + 'showcaseurlfield'} className='form-input' placeholder='Showcase url' type='text' name='showcaseUrl' />,
    <div key={id + 'showcaseerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.showcaseUrl : ''}</div>,
    <div key={id + 'thumbnaillabel'} className='form-label'>Thumbnail</div>,
    <Field id={field + 'ThumbnailUrl' + id} key={id + 'thumbnailurlfield'} className='form-input' placeholder='Thumbnail url' type='text' name='thumbnailUrl' />,
    <div key={id + 'thumbnailurlerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.thumbnailUrl : ''}</div>,
  ])
  if (field === 'contact' || field === 'reference') return ([
    <div key={id + 'firstnamelabel'} className='form-label'>Firstname</div>,
    <Field id={field + 'Firstname' + id} key={id + 'firstnameinput'} className='form-input' placeholder='Firstname' type='text' name='firstname' />,
    <div key={id + 'firstnameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.firstname : ''}</div>,
    <div key={id + 'lastnamelabel'} className='form-label'>Lastname</div>,
    <Field id={field + 'Lastname' + id} key={id + 'lastnamefield'} className='form-input' placeholder='LastName' type='text' name='lastname' />,
    <div key={id + 'lastnameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.lastname : ''}</div>,
    <div key={id + 'emaillabel'} className='form-label'>E-mail</div>,
    <Field id={field + 'Email' + id} key={id + 'emailfield'} className='form-input' placeholder='mailto@mail.com' type='text' name='email' />,
    <div key={id + 'emailerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.email : ''}</div>,
    <div key={id + 'linkedinlabel'} className='form-label'>Linkedin</div>,
    <Field id={field + 'Linkedin' + id} key={id + 'linkedinfield'} className='form-input' placeholder='www.linkedin.com/in/xxxxx-xxxxxx-XXXXXXXXX' type='text' name='linkedin' />,
    <div key={id + 'linkedinerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.linkedin : ''}</div>,
    <div key={id + 'phonelabel'} className='form-label'>Phone</div>,
    <Field id={field + 'Phone' + id} key={id + 'phonefield'} className='form-input' placeholder='+358000000000' type='text' name='phone' />,
    <div key={id + 'phoneerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.phone : ''}</div>,
    <div key={id + 'availablelabel'} className='form-label'>Available</div>,
    <Field id={field + 'PhoneAvailable' + id} key={id + 'availablefield'} className='form-input' placeholder='Available during 9 am -  4 pm' type='text' name='phoneAvailable' />,
    <div key={id + 'availableerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.phoneAvailable : ''}</div>,
    <div key={id + 'addresslabel'} className='form-label'>Address</div>,
    <Field id={field + 'Address' + id} key={id + 'addressfield'} className='form-input' placeholder='Streetname 1 A 1, 00100 Cityname' type='text' name='address' />,
    <div key={id + 'addresserrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.address : ''}</div>,
    <div key={id + 'companylabel'} className='form-label'>Company</div>,
    <Field id={field + 'Company' + id} key={id + 'companyfield'} className='form-input' placeholder='Company name' type='text' name='company' />,
    <div key={id + 'companyerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.company : ''}</div>,
    <div key={id + 'picturelabel'} className='form-label'>Picture</div>,
    <Field id={field + 'PictureUrl' + id} key={id + 'picturefield'} className='form-input' placeholder='Picture Url' type='text' name='pictureUrl' />,
    <div key={id + 'pictureerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.pictureUrl : ''}</div>,
  ])
  if (field === 'profile') return ([
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='Name' type='text' name='name' />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'contentlabel'} className='form-label'>Content</div>,
    <Field id={field + 'Content' + id} key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' />,
    <div key={id + 'contenterrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.content : ''}</div>,
  ])
  if (field === 'communication') return ([
    <div key={id + 'namelabel'}  className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'}className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'languagesfield'} className='form-label language-label'>Languages</div>,
    <FieldArray key={id + 'languagesfieldarray'} name="languages" render={() => (
      <div className='language-panel' key={values.id + 'languagepanel'}>
        {values.languages && values.languages.map((language: any, index: number) => {
          return (<div className='language-pair' key={index + 'language-pair'}>
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
            }/>
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
        >
        add language
        </button>
      </div>
    )} />,
    <div key={id + 'languageerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.languages : ''}</div>,
    <div key={id + 'contentlabel'} className='form-label'>Content</div>,
    <Field id={field + 'Content' + id} key={id + 'contentfield'} className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />,
    <div key={id + 'contenterrormessage'} className='form-input-error-message'>{errors.id === id 
      ? errors.content : ''}</div>
  ])
  return([
    <div key={id + 'namelabel'} className='form-label'>Name</div>,
    <Field id={field + 'Name' + id} key={id + 'namefield'} className='form-input' placeholder='CV name' type='text' name='name' />,
    <div key={id + 'nameerrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.name : ''}</div>,
    <div key={id + 'githublabel'} className='form-label'>Github</div>,
    <Field id={field + 'Github' + id} key={id + 'githubfield'} className='form-input' placeholder='Github url' type='text' name='github' />,
    <div key={id + 'githuberrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.github : ''}</div>,
    <div key={id + 'techlistlabel'} className='form-label'>Techlist</div>,
    <Field id={field + 'Techlist' + id} key={id + 'techlistfield'} className='form-input' placeholder='Java, CSS, Python, ...' type='text' name='techlist' />,
    <div key={id + 'techlisterrormessage'} className='form-input-error-message'>{errors.id === id
      ? errors.techlist : ''}</div>,
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
  
  if (formValues) {
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
          const errorArray: [IDetails] = validationResult?.error?.details
          console.log('errorArray before if', errorArray)
          if (errorArray && errorArray.length > 0) {
            const key = errorArray[0]?.context?.key
            return {
              [key]: errorArray[0].message.includes('fails to match the required pattern')
                ? '"' + errorArray[0].context.key + '" has forbidden characters'
                : errorArray[0].message,
              id: formValues.id
            }
          }
          return {}
        }}
        onSubmit={(values, { setSubmitting }) => {
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
              // setSubmitting(false)
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
        {({ isSubmitting, isValid, errors, values, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {renderChildren(formValues.id, isSubmitting, errors, values, setValues, props.field)}

            <DeleteButton id={field + 'Delete' + formValues.id} isSubmitting={isSubmitting || field === 'contact' || field === ''} handleDelete={(event:any)=>{
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
            <ClearButton id={field + 'Clear' + formValues.id} isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues}/>
            <CancelButton id={field + 'Cancel' + formValues.id} isSubmitting={isSubmitting} setValues={setValues} formValues={formValues}/>
            <SaveButton id={field + 'Save' + formValues.id} isSubmitting={isSubmitting || !isValid}/>
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
      }}
    >
      <img id={props.field + 'Add'} src='plus.svg' width='100px' height='100px' alt='add' />
    </div>
  )}
}

export default connect(mapStateToProps,mapDispatchToProps)(MyCVFormPanel)
