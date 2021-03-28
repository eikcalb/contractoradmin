import moment from 'moment';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { APPLICATION_CONTEXT } from '../lib';
import { IPayment, Payment, PAYMENT_PAGE_LIMIT } from "../lib/payment";
import { Empty } from './util';

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
                    {Payment.getPaymentDescription(payment)}
                </p>
            </div>
        </div>
    )
}

export function PaymentList({ className }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [expanded, setExpanded] = useState(true)
    const [payments, setPayments] = useState<IPayment[]>([DUMMY_PAYMENTS[0]])
    const fetchPayment = useCallback(async () => {
        try {
            const pageToFetch = Math.max(0, Math.floor(payments.length / PAYMENT_PAGE_LIMIT)) + 1
            // This loads the specified page limit and includes count of imcomplete previous page
            const limit = PAYMENT_PAGE_LIMIT + (PAYMENT_PAGE_LIMIT - (payments.length % PAYMENT_PAGE_LIMIT))
            const paymentData = await Payment.getTransactions(ctx, pageToFetch, limit)
            setPayments([...payments, ...paymentData])
        } catch (e) {
            console.log(e, 'failed to fetch payment data')
        }
    }, [payments])

    useEffect(() => {
        fetchPayment()
    }, [ctx.user, ctx.user?.id])

    return (
        <nav className={className} >
            <div className='panel is-clipped'>
                <div onClick={() => setExpanded(!expanded)} className='panel-heading is-size-6 has-text-left has-background-white-bis is-align-items-center is-flex is-flex-direction-row is-justify-content-space-between'>
                    <p>Payments</p>
                    <button className='button is-static has-background-white is-rounded is-size-8 is-small'>
                        {!expanded ?
                            <FaCaretUp size={16} className={`icon has-text-black is-small`} />
                            :
                            <FaCaretDown size={16} className={`icon has-text-black is-small`} />}
                    </button>
                </div>
                <div style={{ transition: "all 0.500s linear" }} className={`${!expanded ? 'is-height-0' : ''}`}>
                    {payments.length > 0 ?
                        payments.map(p => (
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

export const DUMMY_PAYMENTS: IPayment[] = [
    {
        status: 'pending',
        timestamp: Date.now(),
        cost: 20.405,
        title: 'Clear lawn',
        payee: 'Philip Barnabas',
        id: '2ss354'
    },
    {
        status: 'paid',
        timestamp: Date.now(),
        cost: 200.405,
        title: 'Clear lawn and take out firewood',
        payee: 'Philip Barnabas',
        id: '23sss54'
    },
    {
        status: 'pending',
        timestamp: Date.now(),
        cost: 3000.405,
        title: 'Clear lawn',
        payee: 'Philip Barnabas',
        id: '235s4'
    }
]