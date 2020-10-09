import React, { useContext, useEffect, useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { AuthHandler } from '../components/guard';
import { VIEW_CONTEXT } from '../lib';

export interface IRegister {
    first_name: string,
    last_name: string,
    password: string,
    password_verify: string,
    email: string,
    phone_number: string
}

export function Register() {
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({ showModal: false })
    const [formState, setFormState] = useState<IRegister>({
        first_name: '',
        last_name: '',
        password: '',
        password_verify: '',
        email: '',
        phone_number: '',
        showPassword:false,
        showPasswordVerify:false
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