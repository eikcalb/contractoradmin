import React, { useContext, useEffect, useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { AuthHandler } from '../components/guard';
import { VIEW_CONTEXT } from '../lib';
import { LoginView } from '../components/auth';

export function Login() {
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({ showModal: false })

    useEffect(() => {
        viewCTX.showToolbar(false)
        viewCTX.showFooter(false)

        return () => {
            viewCTX.showToolbar(true)
            viewCTX.showFooter(true)
        }
    }, [])

    return (
        <AuthHandler>
            <div className='columns is-gapless is-fullheight is-multiline'>
                <div className='column is-flex-centered is-atleast-fullheight'>
                    <LoginView />
                </div>
                <div className='column is-6 is-hidden-touch is-flex has-background-info' />
            </div>
        </AuthHandler>
    )
}