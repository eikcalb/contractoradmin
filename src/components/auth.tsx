import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { AuthHandler } from '../components/guard';
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from '../lib';
import logo from "../logo.svg";
import { FaPhoneAlt, FaSms, FaUser, FaEnvelope, FaKey, FaEyeSlash, FaEye, FaPlus, FaUserPlus } from 'react-icons/fa';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import links from '../lib/links';

export interface IRegister {
    first_name: string,
    last_name: string,
    password: string,
    password_verify: string,
    email: string,
    phone_number: string,
}

export interface ILogin {
    code: string,
    phone_number: string,
    password: string,
    showPassword: boolean,
    loading?: boolean
}

export function RegisterView() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        showModal: false,
        showCodeRequest: true,
        showPassword: false,
        showPasswordVerify: false,
        loading: false,
    })
    const [formState, setFormState] = useState<IRegister>({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password_verify: '',
        phone_number: ''
    })

    const { addToast } = useToasts()


    /**
     * Called to verify the user's number and send OTP through specified channel.
     */
    const onSubmit = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

        setState({ ...state, loading: true })

        try {
            const done = await ctx.addAdmin(formState)

            if (!done) {
                throw new Error('Failed to verify phone number!')
            }
            addToast('Verification code sent to your phone!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false })
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Verification failed!', {
                appearance: 'error'
            })
            setState({ ...state, loading: false })
        }
    }, [state])


    return (
        <div className='section'>
            <figure className='image is-96x96 is-flex' style={{ margin: 'auto' }}>
                <img src={logo} className='is-rounded' />
            </figure>

            <p className='help mb-4 has-text-weight-bold'>Improving the experience of managing temporary services</p>

            <form className='my-2' onSubmit={onSubmit}>
                <div className='field is-horizontal'>
                    <div className='field-body'>
                        <div className='field'>
                            <div className='control has-icons-left '>
                                <input autoComplete="given-name" disabled={state.loading} required value={formState.first_name} onChange={(e) => setFormState({ ...formState, first_name: e.target.value })} placeholder='enter firstname...' className='input' type='text' />
                                <span className='icon is-left is-small'><FaUser /></span>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control has-icons-left '>
                                <input autoComplete="family-name" disabled={state.loading} required value={formState.last_name} onChange={(e) => setFormState({ ...formState, last_name: e.target.value })} placeholder='enter lastname...' className='input' type='text' />
                                <span className='icon is-left is-small'><FaUser /></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='field'>
                    <div className='control has-icons-left '>
                        <input autoComplete="off" disabled={state.loading} required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder='enter your email address...' className='input' type='email' />
                        <span className='icon is-left is-small'><FaEnvelope /></span>
                    </div>
                </div>

                <div className='field'>
                    <div className='control has-icons-left '>
                        <input autoComplete="off" disabled={state.loading} required value={formState.phone_number} onChange={(e) => setFormState({ ...formState, phone_number: e.target.value })} placeholder='enter your phone number...' className='input' type='tel' />
                        <span className='icon is-left is-small'><FaPhoneAlt /></span>
                    </div>
                </div>

                <div className='field is-horizontal'>
                    <div className='field-body'>
                        <div className='field has-addons'>
                            <div className='control has-icons-left is-expanded'>
                                <input autoComplete="off" disabled={state.loading} required value={formState.password} onChange={(e) => setFormState({ ...formState, password: e.target.value })} placeholder='enter your password...' className='input' type={state.showPassword ? 'text' : 'password'} />
                                <span className='icon is-left is-small'><FaKey /></span>
                            </div>
                            <div className='control'>
                                <button className='button' type='button' onClick={(e) => setState({ ...state, showPassword: !state.showPassword })}>{state.showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className='field has-addons'>
                            <div className='control has-icons-left is-expanded'>
                                <input autoComplete="off" disabled={state.loading} required value={formState.password_verify} onChange={(e) => setFormState({ ...formState, password_verify: e.target.value })} placeholder='enter your password...' className='input' type={state.showPasswordVerify ? 'text' : 'password'} />
                                <span className='icon is-left is-small'><FaKey /></span>
                            </div>
                            <div className='control'>
                                <button className='button' type='button' onClick={(e) => setState({ ...state, showPasswordVerify: !state.showPasswordVerify })}>{state.showPasswordVerify ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='field mt-6'>
                    <div className='control'>
                        <button disabled={state.loading} className={`button is-uppercase is-success ${state.loading ? 'is-loading' : ''}`} type='submit'>
                            <FaUserPlus />&nbsp; Register
                    </button>
                    </div>
                </div>
            </form>

            <div className='section mt-6 is-size-7'>
                <p>Already have an account?</p>
                <Link to={links.login}>Click here to login</Link>
            </div>
        </div>
    )

}


export function LoginView() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        showModal: false,
        showCodeRequest: true,
        loading: false
    })

    const { addToast } = useToasts()


    /**
     * Called to verify the user's number and send OTP through specified channel.
     */
    const onSubmitCodeRequest = useCallback(async (form: { code: string }) => {
        setState({ ...state, loading: true })

        try {
            const done = await ctx.triggerVerification(form.code)

            if (!done) {
                throw new Error('Failed to verify phone number!')
            }
            addToast('Verification code sent to your phone!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false })
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Verification failed!', {
                appearance: 'error'
            })
            setState({ ...state, loading: false })
        }
    }, [state])

    /**
     * Called to login to application after the OTP has been received and inputted in the form.
     */
    const onSubmitVerified = useCallback((form: ILogin) => {

    }, [state])


    return (
        <div className='section'>
            <figure className='image is-96x96 is-flex' style={{ margin: 'auto' }}>
                <img src={logo} className='is-rounded' />
            </figure>

            <p className='help mb-4 has-text-weight-bold'>Improving the experience of managing temporary services</p>

            {state.showCodeRequest ? (
                <CodeRequestForm loading={state.loading} onSubmit={onSubmitCodeRequest} />
            ) : (
                    <LoginForm onSubmit={onSubmitVerified} />
                )}

            <div className='section mt-6 is-size-7'>
                <p>Are you a new user?</p>
                <Link to={links.register}>Request access</Link>
            </div>
        </div>
    )
}


function CodeRequestForm({ onSubmit, loading }) {
    const [state, setState] = useState({
        code: '',
    })

    const onSubmitForm = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()

        onSubmit(state)
    }, [state])

    return (
        <form onSubmit={onSubmitForm}>
            <div className='field'>
                <div className='control has-icons-left '>
                    <input disabled={loading} required value={state.code} onChange={(e) => setState({ ...state, code: e.target.value })} placeholder='enter your phone number...' className='input is-rounded' type='text' />
                    <span className='icon is-left is-small'><FaPhoneAlt /></span>
                </div>

            </div>
            <div className='field mt-6'>
                <div className='control'>
                    <button disabled={loading} className={`button is-rounded is-uppercase is-info ${loading ? 'is-loading' : ''}`} type='submit'>
                        <FaSms />&nbsp; Send Code
                    </button>
                </div>
            </div>
        </form>
    )
}


function LoginForm({ onSubmit }) {
    const [state, setState] = useState<ILogin>({
        code: '',
        phone_number: '',
        password: '',
        showPassword: false,
        loading: false
    })

    const onSubmitForm = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()

        onSubmit(state)
    }, [state])

    return (
        <form onSubmit={onSubmitForm} >
            <div className='field'>
                <div className='control has-icons-left'>
                    <input disabled={state.loading} required value={state.phone_number} onChange={(e) => setState({ ...state, phone_number: e.target.value })} placeholder='enter your phone number...' className='input' type='tel' />
                    <span className='icon is-left is-small'><FaUser /></span>
                </div>
            </div>
        </form>
    )
}