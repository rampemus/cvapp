import React from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import cvService, { ServiceType, ICV } from '../../services/cvService'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateCVs, addEmptyCVObject, removeTempCVObject, CVAction } from '../../reducers/cvReducer'
import MyCVFormDateSelector from './MyCVFormDateSelector'

interface OwnProps {
  formValues?: Object,
  field: string,
  serviceType: ServiceType,
  children?: any,
}
export interface StateProps { }
export interface DispatchProps {
  updateCVs: Function,
  addEmptyCVObject(id: string, field: string): CVAction,
  removeTempCVObject(id: string, field: string, objectId: string): CVAction
}

// const mapStateToProps = (state: AppState, props: OwnProps) => { }

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

  if (formValues && ( field === 'experience' || field === 'education')) { 
    const clearActionValues = { description: '', name: '', timeFrame: { startDate: new Date(), endDate: new Date() } }
    const experience = formValues
    return (
      <Formik
        initialValues={{ ...experience }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            console.log('createObject', serviceType, values, id, field)
            cvService.createObject(serviceType, values, id, field).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
            cvService.modifyObject(serviceType, values.id, changes).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {/* replaces FormPanel children props */}
            <div className='form-label'>Name</div>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
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
            <div className='form-label'>Content</div>
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='description' disabled={isSubmitting} />
            <ErrorMessage name='description' component='div' />

            <DeleteButton isSubmitting={isSubmitting} handleDelete={(event: any) => {
              event.preventDefault()
              if (values.id.includes('temp')) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id)
              }
            }} />
            <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
            <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={experience} />
            <SaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    )
  } else if (formValues && field === 'communication') {
    const clearActionValues = { name: '', languages: [{ language: '', level: '' }], content: [''] }
    const communication = formValues

    return (
      <Formik
        initialValues={{ ...communication }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            console.log('MyCVFormPanel', props.field)
            cvService.createObject(serviceType, values, id, field).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
            cvService.modifyObject(serviceType, values.id, changes).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          }
        }}
      >
        {({ values, isSubmitting, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {/* replaces FormPanel children props */}
            <div className='form-label'>Name</div>
            <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
            <ErrorMessage name='name' component='div' />
            <div className='form-label'>Languages</div>
            <FieldArray name="languages" render={() => (
              <div className='language-panel' key={values.id+'languagepanel'}>
                {values.languages && values.languages.map((language: any, index: number) => {
                  return (<div className='language-pair' key={index + 'language-pair'}>
                    <Field className='form-input' name={`languages.${index}.language`} placeholder='Language name' />
                    <Field className='form-input' name={`languages.${index}.level`} placeholder='Level' />
                  </div>)
                })}
              </div>
            )} />
            <div className='form-label'>Content</div>
            <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
            <ErrorMessage name='content' component='div' />

            <DeleteButton isSubmitting={isSubmitting} handleDelete={(event: any) => {
              event.preventDefault()
              if (values.id.includes('temp')) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id)
              }
            }} />
            <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
            <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={communication} />
            <SaveButton isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    )
  } else if (formValues) {
    const clearActionValues = props.formValues ? Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => key === 'id' ? [key, value] : [key, ''])) : null
    
    return(
      <Formik
        initialValues={{ ...formValues }}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          if ( values.id.includes('temp')) {
            const path = location.pathname
            const id = path.substring('/myCV/'.length)
            cvService.createObject(serviceType, values, id, field).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          } else {
            const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
            cvService.modifyObject(serviceType, values.id, changes).then(response => {
              props.updateCVs()
              setSubmitting(false)
            })
          }
        }}
        key={formValues.id + field }
      >
        {({ isSubmitting, values, setValues }) => (
          <Form className='form-component'>
            {showPanelId && values.id}

            {props.children}

            <DeleteButton isSubmitting={isSubmitting || field === 'contact' || field === ''} handleDelete={(event:any)=>{
              event.preventDefault()
              if ( values.id.includes('temp') ) {
                const path = location.pathname
                const CVid = path.substring('/myCV/'.length)
                props.removeTempCVObject(CVid, field, values.id)
              } else {
                cvService.deleteObject(serviceType, values.id)
                props.updateCVs()
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

export default connect(null,mapDispatchToProps)(MyCVFormPanel)
