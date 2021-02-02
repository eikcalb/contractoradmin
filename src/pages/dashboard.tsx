import React from 'react';
import { JobList } from "../components/JobList";
import { NotificationList } from '../components/notification';
import { PaymentList } from '../components/payment';
import { UserList } from '../components/user';
import { CardFragment } from "../components/util";

export function Dashboard() {
    return (
        <div className='columns is-1 is-variable px-3 py-3 is-atleast-fullheight'>
            <NotificationList className='column is-3 is-2-widescreen' />
            <div className='column is-6 is-8-widescreen is-flex' style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardFragment header='Active Jobs' optionsText={'View All'} style={{ marginBottom: '0.8em', flexGrow: 2 }}>
                    <JobList className={'columns is-multiline is-1 is-variable'} />
                </CardFragment>
            </div>
            <PaymentList className='column is-3 is-2-widescreen' />
        </div>
    )
}