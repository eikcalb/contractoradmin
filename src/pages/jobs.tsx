import React from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';

export function Jobs() {
    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <JobSideList className='column is-3 is-12-touch is-clipped is-fullheight'/>
            <JobDetail job={DUMMY_JOBS[1]} className='column is-9 is-12-touch is-flex' />
        </div>
    )
}