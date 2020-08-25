import React from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';

export function Jobs() {
    return (
        <div className='columns is-gapless px-4 py-4 is-atleast-fullheight'>
            <JobSideList className='column is-3 is-12-touch' />
            <div className='column is-9 is-flex' style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <JobDetail job={DUMMY_JOBS[1]} />
            </div>
        </div>
    )
}