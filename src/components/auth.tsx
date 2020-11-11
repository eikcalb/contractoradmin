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
import { FaPhoneAlt, FaSms, FaUser, FaEnvelope, FaKey, FaEyeSlash, FaEye, FaPlus, FaUserPlus, FaAngleDoubleRight, FaSignInAlt, FaChevronLeft } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useToasts } from 'react-toast-notifications';
import { Link, useHistory, useLocation } from 'react-router-dom';
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
    const history = useHistory()
    const location = useLocation()

    const onSubmit = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

        setState({ ...state, loading: true })

        try {
            const response = await ctx.addAdmin(formState)

            if (!response || !response.success) {
                throw new Error('Failed to register user!')
            }
            addToast('User registered successfully!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false })
            history.push(links.login, location.state)
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Failed to add new user!', {
                appearance: 'error'
            })
            setState({ ...state, loading: false })
        }
    }, [state, formState])


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
                        <input autoComplete="off" disabled={state.loading} required value={formState.phone_number} onChange={(e) => setFormState({ ...formState, phone_number: e.target.value })} placeholder='enter your phone number include the "+" sign...' className='input' type='tel' />
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
                                <input autoComplete="off" disabled={state.loading} required value={formState.password_verify} onChange={(e) => setFormState({ ...formState, password_verify: e.target.value })} placeholder='re-enter your password...' className='input' type={state.showPasswordVerify ? 'text' : 'password'} />
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
                        <button disabled={state.loading} className={`button is-rounded is-fullwidth is-uppercase is-success ${state.loading ? 'is-loading' : ''}`} type='submit'>
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
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({
        showCodeRequest: true,
        loading: false,
        phone: ''
    })

    const { addToast } = useToasts()


    /**
     * Called to verify the user's number and send OTP through specified channel.
     */
    const onSubmitCodeRequest = useCallback(async (form: { phone: string, channel: 'sms' | 'call' }) => {
        setState({ ...state, loading: true })

        try {
            // Check if number exists in database
            await ctx.validateNumber(form.phone)
            // Generate OTP code for provided number
            const done = await ctx.triggerVerification(form.phone, form?.channel)

            if (!done) {
                throw new Error('Failed to verify phone number!')
            }

            addToast('Verification code sent to your phone!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false, phone: form.phone })
            return true
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Verification failed!', {
                appearance: 'error'
            })
            setState({ ...state, loading: false })
            return false
        }
    }, [state])

    /**
     * Called to login to application after the OTP has been received and inputted in the form.
     */
    const onSubmitVerified = useCallback(async (form: ILogin) => {
        setState({ ...state, loading: true })

        try {
            const user = await ctx.login(form.phone_number, form.code, form.password)

            if (!user) {
                throw new Error('Failed to login!')
            }

            addToast('Login successful!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false, })
            return true
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Login failed!', {
                appearance: 'error'
            })
            setState({ ...state, loading: false })
            return false
        }
    }, [state])


    return (
        <div className='section'>
            <figure className='image is-96x96 is-flex' style={{ margin: 'auto' }}>
                <img src={logo} className='is-rounded' />
            </figure>

            <p className='help mb-4 has-text-weight-bold'>Improving the experience of managing temporary services</p>

            {state.showCodeRequest ? (
                <CodeRequestForm onComplete={() => setState({ ...state, showCodeRequest: false })} loading={state.loading} onSubmit={onSubmitCodeRequest} />
            ) : (
                    <LoginForm onCancel={() => setState({ ...state, showCodeRequest: true })} loading={state.loading} phone={state.phone} onSubmit={onSubmitVerified} />
                )}

            <div className='section mt-6 is-size-7'>
                <p>Are you a new user?</p>
                <Link to={links.register}>Request access</Link>
            </div>
        </div>
    )
}


function CodeRequestForm({ onSubmit, loading, onComplete }) {
    const [state, setState] = useState({
        phone: '',
        channel: 'sms'
    })
    const [viewState, setView] = useState({
        showOptions: false,
        hold: false,
        holdTimer: 0,
    })

    let intervalID

    const onSubmitForm = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Trigger code to be sent. `success` decides if the code was successfully triggered.
        const success = await onSubmit(state)
        if (success) {
            let counter = 59

            clearInterval(intervalID)
            intervalID = setInterval(() => {
                if (counter === 0) {
                    clearInterval(intervalID)
                    setView({ ...viewState, hold: false, showOptions: true, holdTimer: counter })
                    return
                }
                setView({ ...viewState, hold: true, holdTimer: counter, showOptions: true, })
                counter--
            }, 1000)
        }
    }, [state, viewState])

    return (
        <form onSubmit={onSubmitForm}>
            <div className='field'>
                <div className='control has-icons-left '>
                    <input autoComplete="off" disabled={loading || viewState.hold} required value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} placeholder='enter your phone number...' className='input is-rounded' type='tel' />
                    <span className='icon is-left is-small'><FaPhoneAlt /></span>
                </div>

            </div>
            <div className='field mt-4'>
                <div className='control'>
                    {viewState.showOptions ?
                        (
                            <button onClick={onComplete} disabled={loading} className={`button is-rounded is-uppercase is-success ${loading ? 'is-loading' : ''}`} type='button'>
                                <FaAngleDoubleRight />&nbsp; Proceed
                            </button>
                        ) : (
                            <button disabled={loading || viewState.hold} className={`button is-rounded is-uppercase is-info ${loading ? 'is-loading' : ''}`} type='submit'>
                                {state.channel === 'sms' ? <><FaSms />&nbsp; Send Code</> : <><FaPhoneAlt />&nbsp; Call Me</>}
                            </button>
                        )
                    }
                </div>
            </div>

            <div className='field is-size-7'>

                {viewState.showOptions ? (
                    <>
                        <p className='help mt-4 mb-2'>Didn't get code? {viewState.hold ? <span className='has-text-danger'>Try again in: {viewState.holdTimer}s</span> : null}</p>
                        <div className='control buttons has-addons is-centered'>
                            <button onClick={() => {
                                setView({ ...viewState, showOptions: false })
                            }} disabled={loading || viewState.hold} className={`button has-text-weight-bold is-info is-outlined is-small is-rounded is-uppercase`} type='button'>
                                <span className='is-size-7'>Try Again</span>
                            </button>
                            <button onClick={() => {
                                setState({ ...state, channel: state.channel === 'sms' ? 'call' : 'sms' })
                                setView({ ...viewState, showOptions: false })
                            }} disabled={loading || viewState.hold} className={`button has-text-weight-bold is-info is-outlined is-small is-rounded is-uppercase`} type='button'>
                                <span className='is-size-7'> {state.channel === 'sms' ? "Use voice" : "Use SMS"}</span>
                            </button>
                        </div>
                    </>
                ) : null}
            </div>

        </form>
    )
}


function LoginForm({ phone, loading, onSubmit, onCancel }) {
    const [state, setState] = useState<ILogin>({
        code: '',
        phone_number: phone,
        password: '',
        showPassword: false,
    })

    const onSubmitForm = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()

        await onSubmit(state)
    }, [state])

    return (
        <form onSubmit={onSubmitForm} >
            <div className='field'>
                <div className='control has-icons-left'>
                    <input autoComplete="off" disabled required value={state.phone_number} placeholder='enter your phone number...' className='input' type='tel' />
                    <span className='icon is-left is-small'><FaUser /></span>
                </div>
            </div>
            <div className='field'>
                <div className='control has-icons-left'>
                    <input autoComplete="off" pattern={'/.{4}/'} max={9999} maxLength={4} minLength={4} disabled={state.loading} required value={state.code} onChange={(e) => setState({ ...state, code: e.target.value })} placeholder='enter 4 digits code...' className='input' type='number' />
                    <span className='icon is-left is-small'><RiLockPasswordLine /></span>
                </div>
            </div>
            <div className='field has-addons'>
                <div className='control has-icons-left is-expanded'>
                    <input autoComplete="off" disabled={state.loading} required value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} placeholder='enter your password...' className='input' type={state.showPassword ? 'text' : 'password'} />
                    <span className='icon is-left is-small'><FaKey /></span>
                </div>
                <div className='control'>
                    <button className='button' type='button' onClick={(e) => setState({ ...state, showPassword: !state.showPassword })}>{state.showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>
            <div className='field mt-6'>
                <div className='control buttons is-centered'>
                    <button onClick={onCancel} disabled={loading} className={`button is-rounded is-uppercase is-dark is-outlined`} type='button'>
                        <FaChevronLeft />&nbsp; Back
                    </button>
                    <button disabled={loading} className={`button is-rounded is-uppercase is-success ${loading ? 'is-loading' : ''}`} type='submit'>
                        <FaSignInAlt />&nbsp; Login
                    </button>
                </div>
            </div>
        </form>
    )
}