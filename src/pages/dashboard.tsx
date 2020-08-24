import React from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'

export function Dashboard() {
    return (
        <div className='columns is-1 is-variable px-3 py-3'>
            <NotificationList className='column is-3' />
            <div className='column is-8'></div>
            <PaymentList className='column is-3' />
        </div>
    )
}