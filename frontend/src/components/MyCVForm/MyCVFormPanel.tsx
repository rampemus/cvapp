import React from 'react'
import { Formik, Form } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import cvService, { ServiceType, ICV } from '../../services/cvService'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateCVs, addEmptyCVObject, CVAction } from '../../reducers/cvReducer'

interface OwnProps {
  formValues?: Object,
  field?: string,
  serviceType: ServiceType,
  children?: any,
}
export interface StateProps { }
export interface DispatchProps {
  updateCVs: Function,
  addEmptyCVObject(id: string, field: string): CVAction
}

// const mapStateToProps = (state: AppState, props: OwnProps) => { }

const mapDispatchToProps: DispatchProps = {
  updateCVs, addEmptyCVObject
}

type Props = OwnProps & StateProps & DispatchProps

const MyCVFormPanel: React.FC<Props> = (props) => {

  const formValues = props.formValues ? Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => [key, value ? value : ''])) : null
  const clearActionValues = props.formValues ? Object.fromEntries(Object.entries(props.formValues).map(([key, value]) => key === 'id' ? [key,value] : [key, ''])) : null
  const serviceType = props.serviceType
  const location = useLocation()

  if (formValues) { return(
      <Formik
        initialValues={{ ...formValues }}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
            if ( values.id === 'noid') {
              console.log('noid submit is not handled')
            } else {
              const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => formValues[key] !== value))
              cvService.modifyObject(serviceType, values.id, changes).then(response => {
                props.updateCVs()
                setSubmitting(false)
              })
            }
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
  } else { return (
    <div
      className='form-component-empty'
      key={props.field+'-empty'}
      onClick={()=>{
        const path = location.pathname
        const id = path.substring('/myCV/'.length)
        props.addEmptyCVObject(id, props.field || '')
      }}>
        <img src='plus.svg' width='100px' height='100px' alt='add' />
      </div>
  )}
}

export default connect(null,mapDispatchToProps)(MyCVFormPanel)
