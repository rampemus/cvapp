import React from 'react'
import cvService, { ServiceType } from '../../services/cvService'

interface DeleteProps {
  isSubmitting: boolean,
  handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void,
}

const DeleteButton: React.FC<DeleteProps> = (props) => {
  const { isSubmitting } = props
  return(
    <button className='form-delete-button form-button' type='submit' onClick={props.handleDelete} disabled={isSubmitting}>
      Delete
    </button>
  )
}

interface ClearProps {
  isSubmitting: boolean,
  values: any,
  clearActionValues: any,
  setValues(values: any): void,
}

const ClearButton: React.FC<ClearProps> = (props) => {
  const { isSubmitting, values, clearActionValues, setValues } = props
  return(
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
  )
}

interface CancelProps {
  isSubmitting: boolean,
  setValues(values: any): void,
  formValues: any,
}

const CancelButton: React.FC<CancelProps> = (props) => {
  const { isSubmitting, setValues, formValues } = props
  return(
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
  )
}

interface SaveProps {
  isSubmitting: boolean,
}

const SaveButton: React.FC<SaveProps> = (props) => {
  const { isSubmitting } = props
  return(
    <button
      className='form-save-button form-button'
      type='submit' disabled={isSubmitting}
    >
      Save
    </button>
  )
}

export { DeleteButton, ClearButton, CancelButton, SaveButton}
