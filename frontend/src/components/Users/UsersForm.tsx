import React, { useState } from 'react'
import { showNotification, Type } from '../../reducers/notificationReducer'
import { connect } from 'react-redux'
import { UserState } from '../../reducers/userReducer'
import { AppState } from '../..'
import { Formik, Form, Field } from 'formik'
import usersService from '../../services/usersService'
import { UserSchema, IDetails } from '../../utils/validators'
import { setLoading } from '../../reducers/loadingReducer'

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
  showNotification: Function,
  setLoading: Function
}

const mapDispatchToProps: DispatchProps = {
  showNotification,
  setLoading
}

const mapStateToProps = (state: AppState, props: OwnProps) => {
  return {
    user: state.user
  }
}

enum CalcDateAfter {
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
      validate={(values) => {
        const validationResult = UserSchema.validate(values, true)
        if (!validationResult.error) return {}
        const errorArray: [IDetails] = validationResult.error?.details.map((detail: IDetails) => { return {
          ...detail,
          message: detail.message.includes('fails to match the required pattern')
          ? '"name" has forbidden characters'
          : detail.message
        }})
        return {
          name: errorArray.find((error) => error.context.key === 'name')?.message,
          username: errorArray.find((error) => error.context.key === 'username')?.message,
          password: errorArray.find((error) => error.context.key === 'password')?.message,
          passwordConfirm: errorArray.find((error) => error.context.key === 'passwordConfirm')?.message,
          oldPassword: errorArray.find((error) => error.context.key === 'oldPassword')?.message,
        }
      }} 
      onSubmit={(values, { setSubmitting, setValues }) => {
        props.setLoading(true)
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
              props.setLoading(false)
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
            props.setLoading(false)
          }).catch((error) => {
            props.showNotification(error.response.data.error, Type.ERROR, 5) 
          })
        }
        setSubmitting(false)
        props.closeForm()
      }}
    >
      {({ isSubmitting, isValid, errors }) => (
        <Form>
          {props.newUser ? 'Create new user' : 'Modify user ' + props.formValues?.username + ':'}
          <p>Full name</p>
          <Field id='NewUserFullName' key={'namefield'} className='user-form-input' placeholder='Full Name' type='text' name='name' disabled={isSubmitting} />
          <div key={'nameerrormessage'} className='form-input-error-message'>{errors?.name}</div>
          <p>Username</p>
          <Field id='NewUserName' key={'usernamefield'} className='user-form-input' placeholder='Username' type='text' name='username' disabled={isSubmitting} />
          <div key={'usernameerrormessage'} className='form-input-error-message'>{errors?.username}</div>
          {props.newUser ? <p>User is valid</p> : <p>User is valid after changes (admin only)</p>}
          <div>
            <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDateAfter.TWO_WEEKS))} /> a fortnight
            <input type="radio" name="expires" onClick={() => setExpires(new Date(CalcDateAfter.ONE_MONTH))} /> a month
            <input type="radio" name="expires" onClick={() => setExpires(null)} /> forever
          </div>
          {!props.newUser && <p key='olduserparagraph'>Re-enter old password</p>}
          {!props.newUser && <Field id='OldPassword' key='oldpasswordfield' className='user-form-input' type='password' name='oldPassword' disabled={isSubmitting} />}
          <div key={'oldpassworderrormessage'} className='form-input-error-message'>{errors?.oldPassword}</div>
          {props.newUser ? <p>Password for new user</p> : <p>New password</p>}
          <Field id='NewPassword' key='passwordfield' className='user-form-input' type='password' name='password' disabled={isSubmitting} />
          <div key={'passworderrormessage'} className='form-input-error-message'>{errors?.password}</div>
          {props.newUser ? <p>Confirm password</p> : <p>Confirm new password</p>}
          <Field id='NewPasswordConfirm' key='confirmpasswordfield' className='user-form-input' type='password' name='passwordConfirm' disabled={isSubmitting} />
          <div key={'passwordconfirmationerrormessage'} className='form-input-error-message'>{errors?.passwordConfirm}</div>
          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button className='toolbar-button' onClick={(event) => {
              event.preventDefault()
              props.closeForm()
            }}>Cancel</button>
            <button id='SubmitUserForm' className='toolbar-button' type='submit' disabled={isSubmitting || !isValid}>
              {props.newUser ? 'Submit' : 'Submit changes'}
            </button>
          </div>
        </Form>)}
    </Formik>
  )
}
    
export default connect(mapStateToProps,mapDispatchToProps)(UsersForm)