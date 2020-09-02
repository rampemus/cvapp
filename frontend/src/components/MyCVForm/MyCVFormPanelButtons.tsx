import React from 'react'

interface DeleteProps {
  isSubmitting: boolean,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  id: string
}

const DeleteButton: React.FC<DeleteProps> = (props) => {
  const { id, isSubmitting } = props
  return <button id={id} className='form-delete-button form-button' type='submit' onClick={props.handleDelete} disabled={isSubmitting}>
    Delete
    </button>
}

interface ClearProps {
  isSubmitting: boolean,
  values: any,
  clearActionValues: any,
  setValues(values: any): void,
  id: string
}

const ClearButton: React.FC<ClearProps> = (props) => {
  const { id, isSubmitting, values, clearActionValues, setValues } = props
  return <button
    id={id}
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
}

interface CancelProps {
  isSubmitting: boolean,
  setValues(values: any): void,
  formValues: any,
  id: string
}

const CancelButton: React.FC<CancelProps> = (props) => {
  const { id, isSubmitting, setValues, formValues } = props
  return <button
    id={id}
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

}

interface SaveProps {
  isSubmitting: boolean,
  id: string
}

const SaveButton: React.FC<SaveProps> = (props) => {
  const { id, isSubmitting } = props
  return <button
    id={id}
    className='form-save-button form-button'
    type='submit' disabled={isSubmitting}
  >
    Save
  </button>
}

export { DeleteButton, ClearButton, CancelButton, SaveButton }
