import React from 'react'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'

interface OwnProps {
    formValues: any,
    clearActionValues: any
}

const MyCVFormPanelCommunication: React.FC<OwnProps> = (props) => {

  const communication = props.formValues
  const clearActionValues = props.clearActionValues

  return (
    <Formik
      initialValues={{ ...communication }}
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

          {/* replaces FormPanel children props */}
          <div className='form-label'>Name</div>
          <Field className='form-input' placeholder='Name' type='text' name='name' disabled={isSubmitting} />
          <ErrorMessage name='name' component='div' />
          <div className='form-label'>Languages</div>
          <FieldArray name="languages" render={() => (
            <div className='language-panel'>
              {values.languages && values.languages.map((index: number) => {
                return (<div key={index} className='language-pair'>
                  <Field className='form-input' name={`languages.${index}.language`} placeholder='Language name' />
                  <Field className='form-input' name={`languages.${index}.level`} placeholder='Level' />
                </div>)
              })}
            </div>
          )} />
          <div className='form-label'>Content</div>
          <Field className='form-textarea' placeholder='Content' as='textarea' type='text' name='content' disabled={isSubmitting} />
          <ErrorMessage name='content' component='div' />
          
          <DeleteButton isSubmitting={isSubmitting} />
          <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
          <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={communication} />
          <SaveButton isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  )
}

export default MyCVFormPanelCommunication
