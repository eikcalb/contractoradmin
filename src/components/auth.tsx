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
import { FaPhoneAlt, FaSms, FaUser } from 'react-icons/fa';
import { useToasts } from 'react-toast-notifications';

export interface IRegister {
    first_name: string,
    last_name: string,
    password: string,
    password_verify: string,
    email: string,
    phone_number: string,
    showPassword: boolean
    showPasswordVerify: boolean
}

export interface ILogin {
    code: string,
    phone_number: string,
    password: string,
    showPassword: boolean,
    loading?: boolean
}

export function RegisterView() {
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({ showModal: false })
    const [formState, setFormState] = useState<IRegister>({
        first_name: '',
        last_name: '',
        password: '',
        password_verify: '',
        email: '',
        phone_number: '',
        showPassword: false,
        showPasswordVerify: false
    })

    useEffect(() => {
        viewCTX.showToolbar(false)
    }, [])

    return (
        <AuthHandler>
            <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
                <JobSideList onCreateNew={() => setState({ ...state, showModal: true })} className='column is-6 is-12-touch is-clipped is-fullheight' />
                <JobDetail job={null} className='column is-6 is-hidden-touch is-flex' />
                <CreateJob show={state.showModal} onClose={() => setState({ ...state, showModal: false })} onComplete={() => {
                    setState({ ...state, showModal: false })
                }} />
            </div>
        </AuthHandler>
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
    const onSubmitCodeRequest = useCallback(async (form: { code: string, channel: 'sms' | 'call' }) => {
        setState({ ...state, loading: true })

        try {
            const done = await ctx.triggerVerification(form.code, form?.channel)

            if (!done) {
                throw new Error('Failed to verify phone number!')
            }
            addToast('Verification code sent to your phone!', {
                appearance: 'success'
            })
            setState({ ...state, loading: false, })
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
                <CodeRequestForm onComplete={() => setState({ ...state, showCodeRequest: false })} loading={state.loading} onSubmit={onSubmitCodeRequest} />
            ) : (
                    <LoginForm onSubmit={onSubmitVerified} />
                )}
        </div>
    )
}


function CodeRequestForm({ onSubmit, loading, onComplete }) {
    const [state, setState] = useState({
        code: '',
        channel
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
            <div className='field mt-4'>
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