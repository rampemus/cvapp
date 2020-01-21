import React from 'react'
import { Formik, Form } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import cvService, { ServiceType, ICV } from '../../services/cvService'

interface OwnProps {
  formValues: Object,
  serviceType: ServiceType,
  children?: any,
}

const MyCVFormPanel: React.FC<OwnProps> = (props) => {

  const formValues = Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => [key, value ? value : '']))
  const clearActionValues = Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => key === 'id' ? [key,value] : [key, '']))
  const serviceType = props.serviceType

  switch(serviceType) {
    default:
      return(
          <Formik
            initialValues={{ ...formValues }}
            onSubmit={(values, { setSubmitting }) => {
              const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
              cvService.modifyObject(serviceType, values.id, changes).then(response => {
                console.log('MyCVFormPanel response is here',response)
                setSubmitting(false)
              })
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
}

export default MyCVFormPanel
