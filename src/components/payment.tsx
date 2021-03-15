import React, { useState } from 'react'
import moment from 'moment'
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { NavLink, Link } from 'react-router-dom'
import { Empty } from './util';

const CurrencyFormatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency', maximumFractionDigits: 2 })

export function PaymentItem({ payment }: { payment: IPayment }) {
    const time = moment.unix(payment.timestamp / 1000)

    return (
        <div className='container is-fluid is-paddingless list-item py-2' title={payment.title}>
            <div className='columns is-variable is-1 py-1 px-1 is-vcentered'>
                <div className='column is-paddingless is-6 has-text-left has-text-centered-mobile list-item-title'>
                    <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{payment.title}</p>
                </div>
                <div className='column is-paddingless has-text-right has-text-centered-mobile list-item-subtitle'>
                    <p>{time.fromNow()}</p>
                </div>
            </div>
            <div className='content'>
                <p>
                    {getPaymentDescription(payment)}
                </p>
            </div>
        </div>
    )
}

export function PaymentList({ className }) {
    const [expanded, setExpanded] = useState(true)

    return (
        <nav className={className} >
            <div className='panel is-clipped'>
                <div onClick={() => setExpanded(!expanded)} className='panel-heading has-text-left has-background-white-bis is-align-items-center is-flex is-flex-direction-row is-justify-content-space-between'>
                    <p>Payments</p>
                    <button className='button is-static has-background-white is-rounded is-small'>
                        {!expanded ?
                            <FaCaretUp size={16} className={`icon has-text-black is-small`} />
                            :
                            <FaCaretDown size={16} className={`icon has-text-black is-small`} />}
                    </button>
                </div>
                <div style={{ transition: "all 0.500s linear" }} className={`${!expanded ? 'is-height-0' : ''}`}>
                    {DUMMY_PAYMENTS.length > 0 ?
                        DUMMY_PAYMENTS.map(p => (
                            <Link to={`/ f`} key={p.id} className='panel-block'>
                                <PaymentItem payment={p} />
                            </Link>
                        ))
                        :
                        <Empty text='No Payment data available' />
                    }
                </div>
            </div>
        </nav>
    )
}

export interface IPayment {
    type: 'pending' | 'paid'
    timestamp
    cost: number
    title
    payee
    id: string
}

export function getPaymentDescription(payment: IPayment): string {
    switch (payment.type) {
        case 'pending':
            return `You have a pending charge of ${CurrencyFormatter.format(payment.cost)} for the completion of this job by ${payment.payee}`
        case 'paid':
            return `A payment of ${CurrencyFormatter.format(payment.cost)} has been submitted to ${payment.payee}`
    }
}


export const DUMMY_PAYMENTS: IPayment[] = [
    {
        type: 'pending',
        timestamp: Date.now(),
        cost: 20.405,
        title: 'Clear lawn',
        payee: 'Philip Barnabas',
        id: '2ss354'
    },
    {
        type: 'paid',
        timestamp: Date.now(),
        cost: 200.405,
        title: 'Clear lawn and take out firewood',
        payee: 'Philip Barnabas',
        id: '23sss54'
    },
    {
        type: 'pending',
        timestamp: Date.now(),
        cost: 3000.405,
        title: 'Clear lawn',
        payee: 'Philip Barnabas',
        id: '235s4'
    }
]