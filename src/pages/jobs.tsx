import React, { useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';

export function Jobs() {
    const [state, setState] = useState({ showModal: false })
    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <JobSideList onCreateNew={() => setState({ ...state, showModal: true })} className='column is-3 is-12-touch is-clipped is-fullheight' />
            <JobDetail job={null} className='column is-9 is-12-touch is-flex' />
            <CreateJob show={state.showModal} onClose={() => setState({ ...state, showModal: false })} onComplete={() => {
                setState({ ...state, showModal: false })
            }} />
        </div>
    )
}