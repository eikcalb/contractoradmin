import React, { useContext, useEffect, useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { AuthHandler } from '../components/guard';
import { VIEW_CONTEXT } from '../lib';
import { RegisterView } from '../components/auth';


export function Register() {
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({ showModal: false })
    const [formState, setFormState] = useState({
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
        viewCTX.showFooter(false)

        return () => {
            viewCTX.showFooter(true)
            viewCTX.showToolbar(true)
        }
    }, [])

    return (
        <AuthHandler>
            <div className='columns is-gapless is-fullheight is-multiline'>
                <div className='column is-flex-centered is-atleast-fullheight'>
                    <RegisterView />
                </div>
                <div className='column is-6 is-hidden-touch is-flex has-background-success' />
            </div>
        </AuthHandler>
    )
}