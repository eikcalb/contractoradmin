import React from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList } from '../components/job';
import { UserList } from '../components/user';

export function Dashboard() {
    return (
        <div className='columns is-1 is-variable px-3 py-3 is-atleast-fullheight'>
            <NotificationList className='column is-3 is-2-widescreen' />
            <div className='column is-6 is-8-widescreen is-flex' style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardFragment header='Active Jobs' optionsText={'View All'} style={{ marginBottom: '0.8em', flexGrow: 2 }}>
                    <JobList className={'columns is-multiline is-1 is-variable'} />
                </CardFragment>
                <CardFragment header='Recently Hired' optionsText={'View All'} style={{ flexGrow: 1 }}>
                    <UserList className={'columns is-multiline is-1 is-variable'} />
                </CardFragment>
            </div>
            <PaymentList className='column is-3 is-2-widescreen' />
        </div>
    )
}