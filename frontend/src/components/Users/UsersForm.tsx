import React, { useState } from 'react'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect } from 'react-redux'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'
import { Formik, Form, Field } from 'formik'
import usersService from '../../services/usersService'

interface OwnProps {
  closeForm: Function,
  reloadUsers: Function,
  newUser: boolean,
  formValues?: {
    id: string,
    name: string,
    username: string,
    expires?: Date | null
  }
}

export interface StateProps {
  user: UserState
}
export interface DispatchProps {
  showNotification: Function
}

const mapDispatchToProps: DispatchProps = {
  showNotification
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

enum CalcDate {
  TWO_WEEKS = Date.now() + 1000 * 60 * 60 * 24 * 14,
  ONE_MONTH = Date.now() + 1000 * 60 * 60 * 24 * 30
}

type Props = OwnProps & StateProps & DispatchProps

const UsersForm: React.FC<Props> = (props) => {
  const [expires, setExpires] = useState<Date | undefined | null>(undefined)
  
  return (
    <Formik
      initialValues={ {
        name: props.formValues?.name || '',
        username: props.formValues?.username || '',
        password: '',
        passwordConfirm: '',
        oldPassword: ''
      }}
      enableReinitialize
      onSubmit={(values, { setSubmitting, setValues }) => {
        if (props.newUser) {
          if (values.password === values.passwordConfirm) {
            usersService.createUser(props.user, values.username, values.name, values.password, expires).then(response => {
              setExpires(undefined)
              props.showNotification(`User ${response.data.name} was created`, Type.SUCCESS, 4)
              props.reloadUsers()
              props.closeForm()
              setValues({
                name: '',
                username: '',
                password: '',
                passwordConfirm: '',
                oldPassword: ''
              })
            }).catch((error) => props.showNotification(error.response.data.error, Type.ERROR, 5))
          } else {
            props.showNotification('Password and password confirmation does not match', Type.WARNING, 4)
          }
        } else {
          const changes = {
            name: props.formValues && props.formValues.name !== values.name ? values.name : undefined,
            username: props.formValues && props.formValues.username !== values.username ? values.username : undefined,
            password: values.oldPassword.length > 8 ? values.oldPassword : undefined,
            newPassword: values.passwordConfirm.length > 8 ? values.passwordConfirm : undefined,
            expires: props.formValues && props.formValues.expires && props.formValues.expires !== expires ? expires : undefined
          }
          usersService.modifyUser(
            props.user,
            props.formValues?.id || '',
            changes
          ).then((response) => {
            props.reloadUsers()
            props.closeForm()
            props.showNotification('User modifications updated successfully', Type.SUCCESS, 5)
          }).catch((error) => {
            props.showNotification(error.response.data.error, Type.ERROR, 5) 
          })
        }
        setSubmitting(false)
        props.closeForm()
      }}
    >
      {({ isSubmitting, isValid, errors, values, setValues }) => (
        <Form>
          {props.newUser ? 'Create new user' : 'Modify user ' + props.formValues?.username + ':'}
          <p>Full name</p>
          <Field key={'namefield'} className='user-form-input' placeholder='Full Name' type='text' name='name' disabled={isSubmitting} />
          <p>Username</p>
          <Field key={'usernamefield'} className='user-form-input' placeholder='Username' type='text' name='username' disabled={isSubmitting} />
          {props.newUser ? <p>User is valid</p> : <p>User is valid after changes (admin only)</p>}
          <div>
            <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDate.TWO_WEEKS))} /> a fortnight
            <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDate.ONE_MONTH))} /> a month
            <input type="radio" name="expires" onClick={() => setExpires(null)} /> forever
          </div>
          {!props.newUser && <p key='olduserparagraph'>Re-enter old password</p>}
          {!props.newUser && <Field key='oldpasswordfield' className='user-form-input' type='password' name='oldPassword' disabled={isSubmitting} />}
          {props.newUser ? <p>Password for new user</p> : <p>New password</p>}
          <Field key='passwordfield' className='user-form-input' type='password' name='password' disabled={isSubmitting} />
          {props.newUser ? <p>Confirm password</p> : <p>Confirm new password</p>}
          <Field key='confirmpasswordfield' className='user-form-input' type='password' name='passwordConfirm' disabled={isSubmitting} />
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button className='toolbar-button' onClick={(event) => {
            event.preventDefault()
            props.closeForm()
          }}>Cancel</button>
            <button className='toolbar-button' type='submit' disabled={isSubmitting || !isValid}>
              {props.newUser ? 'Submit' : 'Submit changes'}
            </button>
          </div>
        </Form>)}
    </Formik>
  )
}
    
export default connect(mapStateToProps,mapDispatchToProps)(UsersForm)