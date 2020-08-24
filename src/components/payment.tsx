import React from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'

const CurrencyFormatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency', maximumFractionDigits: 2 })

export function PaymentItem({ payment }: { payment: IPayment }) {
    const time = moment.unix(payment.timestamp / 1000)

    return (
        <div className='container is-fluid is-paddingless list-item' title={payment.title}>
            <div className='columns is-variable is-1 py-1 px-1 is-vcentered'>
                <div className='column is-paddingless is-6 has-text-left list-item-title'>
                    <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{payment.title}</p>
                </div>
                <div className='column is-paddingless has-text-right list-item-subtitle'>
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
    return (
        <nav className={className} >
            <div className='panel'>
                <div className='panel-heading'>
                    Payments
        </div>
                {DUMMY_PAYMENTS.map(p => (
                    <NavLink to={`/f`} key={p.id} activeClassName='is-active' className='panel-block'>
                        <PaymentItem payment={p} />
                    </NavLink>
                ))}
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
        type: 'paid',
        timestamp: Date.now(),
        cost: 20.405,
        title: 'Clear lawn',
        payee: 'Philip Barnabas',
        id: '2354'
    }
]