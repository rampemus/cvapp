import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import MyCVFormDateSelector from './MyCVFormDateSelector'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'

interface OwnProps {
    formValues: any,
    clearActionValues: any
}

const MyCVFormPanelExperience: React.FC<OwnProps> = (props) => {

    const experience = props.formValues
    const clearActionValues = props.clearActionValues

    return (
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
      {({ isSubmitting, values, setValues }) => (
        <Form className='form-component'>

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

          <DeleteButton isSubmitting={isSubmitting} />
          <ClearButton isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
          <CancelButton isSubmitting={isSubmitting} setValues={setValues} formValues={experience} />
          <SaveButton isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  )
}

export default MyCVFormPanelExperience
