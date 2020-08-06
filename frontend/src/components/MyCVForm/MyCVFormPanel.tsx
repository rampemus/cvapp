import React from 'react'
import { Formik, Form, } from 'formik'
import { DeleteButton, ClearButton, CancelButton, SaveButton } from './MyCVFormPanelButtons'
import cvService, { ServiceType } from '../../services/cvService'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateCVs, addEmptyCVObject, removeTempCVObject, CVAction } from '../../reducers/cvReducer'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'
import { IDetails } from '../../utils/validators'
import { getValidatorResult, arrayToString, stringToArray, renderFields } from '../../utils/CVFormHelper'

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

    return <Formik
      initialValues={Object.fromEntries(
        Object.entries(formValues)
          .map(([key, value]) => key === 'content' ? [key, arrayToString(value)] : [key, value])
      )}
      enableReinitialize
      validate={(values) => {
        const errorArray: [IDetails] = getValidatorResult(values, field)
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
        if (values.id.includes('temp')) {
          const path = location.pathname
          const id = path.substring('/myCV/'.length)
          const newValues = Object.fromEntries(
            Object.entries(values)
              .filter(([key, value]) => formValues[key] !== value)
              .map(([key, value]) => key === 'content' ? [key, stringToArray(value)] : [key, value])
          )
          cvService.createObject(serviceType, newValues, id, props.user, field).then(response => {
            props.updateCVs(props.user)
          })
        } else {
          const changes = Object.fromEntries(
            Object.entries(values)
              .filter(([key, value]) => formValues[key] !== value)
              .map(([key, value]) => key === 'content' ? [key, stringToArray(value)] : [key, value])
          )
          cvService.modifyObject(serviceType, values.id, changes, props.user).then(response => {
            props.updateCVs(props.user)
            setSubmitting(false)
          })
        }
      }}
      key={formValues.id + field}
    >
      {({ isSubmitting, isValid, errors, values, setValues }) =>
        <Form className='form-component'>
          {showPanelId && values.id}

          {renderFields(formValues.id, isSubmitting, errors, values, setValues, props.field)}

          <DeleteButton id={field + 'Delete' + formValues.id} isSubmitting={isSubmitting || field === 'contact' || field === ''} handleDelete={(event: any) => {
            event.preventDefault()
            if (values.id.includes('temp')) {
              const path = location.pathname
              const CVid = path.substring('/myCV/'.length)
              props.removeTempCVObject(CVid, field, values.id)
            } else {
              cvService.deleteObject(serviceType, values.id, props.user)
              props.updateCVs(props.user)
            }
          }} />
          <ClearButton id={field + 'Clear' + formValues.id} isSubmitting={isSubmitting} values={values} clearActionValues={clearActionValues} setValues={setValues} />
          <CancelButton id={field + 'Cancel' + formValues.id} isSubmitting={isSubmitting} setValues={setValues} formValues={formValues} />
          <SaveButton id={field + 'Save' + formValues.id} isSubmitting={isSubmitting || !isValid} />
        </Form>
      }
    </Formik>

  } else {
    return <div
      className='form-component-empty'
      key={props.field + '-empty'}
      onClick={() => {
        const path = location.pathname
        const CVid = path.substring('/myCV/'.length)
        props.addEmptyCVObject(CVid, field)
      }}
    >
      <img id={props.field + 'Add'} src='plus.svg' width='100px' height='100px' alt='add' />
    </div>

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyCVFormPanel)
