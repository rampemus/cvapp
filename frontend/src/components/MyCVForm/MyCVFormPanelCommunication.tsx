import React from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import { ServiceType } from '../../services/cvService'

interface OwnProps {
    formValues: any,
}

const MyCVFormPanelCommunication: React.FC<OwnProps> = (props) => {

  const communication = props.formValues
  const clearActionValues = { name: '', languages: [{ language: '', level: '' }], content: [''] }
  const serviceType = ServiceType.COMMUNICATION

  return (
    <Formik
      initialValues={{ ...communication }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {({ values, isSubmitting, setValues }) => (
        <Form className='form-component'>

          {/* replaces FormPanel children props */}
          <div className='form-label'>Name</div>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <div className='form-label'>Languages</div>
          <FieldArray name="languages" render={() => (
            <div className='language-panel'>
              {values.languages && values.languages.map((language: any, index: number) => {
                return (<div key={language._id} className='language-pair'>
                  <Field className='form-input' name={`languages.${index}.language`} placeholder='Language name' />
                  <Field className='form-input' name={`languages.${index}.level`} placeholder='Level' />
                </div>)
              })}
            </div>
          )} />
          <div className='form-label'>Content</div>
          <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
          <ErrorMessage name='content' component='div' />
          
          <DeleteButton isSubmitting={isSubmitting} handleDelete={()=>{}}/>
          <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
          <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={communication} />
          <SaveButton isSubmitting={isSubmitting}/>
        </Form>
      )}
    </Formik>
  )
}

export default MyCVFormPanelCommunication
