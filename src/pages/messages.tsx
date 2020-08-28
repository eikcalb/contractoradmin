import React, { useState } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { MessageList, MessageDetail, DUMMY_MESSAGES } from '../components/messages';
import { DUMMY_USER } from '../lib/user';

export function Messages() {
    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <MessageList onCreateNew={() => { }} className='column is-3 is-12-touch is-clipped is-fullheight' />
            <MessageDetail message={DUMMY_MESSAGES} contact={DUMMY_USER} className='column is-9 is-12-touch is-flex' />
        </div>
    )
}