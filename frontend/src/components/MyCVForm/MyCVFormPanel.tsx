import React from 'react'
import { Formik, Form } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'

interface OwnProps {
  formValues: any,
  clearActionValues: any,
  children: any
}

const MyCVFormPanel: React.FC<OwnProps> = (props) => {

  const formValues = props.formValues
  const clearActionValues = props.clearActionValues

  return(
    <Formik
      initialValues={{ ...formValues }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
      key={formValues.id}
    >
      {({ isSubmitting, values, setValues }) => (
        <Form className='form-component'>

          {props.children}

          <DeleteButton isSubmitting={isSubmitting}/>
          <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues}/>
          <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={formValues}/>
          <SaveButton isSubmitting={isSubmitting}/>
        </Form>
      )}
    </Formik>
  )
}

export default MyCVFormPanel
