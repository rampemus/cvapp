import React from 'react'
import { Formik, Form } from 'formik'

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

          <button className='form-delete-button form-button' type='submit' disabled={isSubmitting}>
            Delete
          </button>
          <button
            className='form-clear-button form-button'
            type='submit'
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault()
              setValues({ ...values, ...clearActionValues })
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
              setValues({ ...formValues })
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

export default MyCVFormPanel
