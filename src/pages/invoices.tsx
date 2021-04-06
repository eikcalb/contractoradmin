import React, { useContext, useEffect, useState, useCallback } from 'react';
import { FaEnvelope, FaExclamationCircle, FaGraduationCap, FaMapMarkerAlt, FaStar, FaDownload } from 'react-icons/fa';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Empty } from "../components/util";
import { APPLICATION_CONTEXT } from '../lib';
import { Job } from '../lib/job';
import { User } from '../lib/user';
import moment from "moment";
import logo from '../logo_runner.jpg'
import { IInvoice, Payment, INVOICE_PAGE_LIMIT } from '../lib/payment';


/**
 * Profile component for viewing details of a user's profile. 
 */
export function Invoices() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [invoices, setInvoices] = useState<IInvoice[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const location = useLocation()
    const { id } = useParams()
    const { addToast } = useToasts()

    const fetchPayment = useCallback(async () => {
        try {
            setLoading(true)
            const pageToFetch = Math.max(0, Math.floor(invoices.length / INVOICE_PAGE_LIMIT)) + 1
            // This loads the specified page limit and includes count of imcomplete previous page
            const limit = INVOICE_PAGE_LIMIT + (INVOICE_PAGE_LIMIT - (invoices.length % INVOICE_PAGE_LIMIT))
            const paymentData = await Payment.getInvoices(ctx, pageToFetch, limit)
            setInvoices([...invoices, ...paymentData])
        } catch (e) {
            addToast(e.message || 'Failed to fetch invoices', { appearance: 'error' })
            console.log(e, 'failed to fetch invoices')
        } finally {
            setLoading(false)
        }
    }, [invoices])

    useEffect(() => {
        fetchPayment()
    }, [ctx.user, ctx.user?.id])

    return (
        <div className='is-1 is-variable px-3 py-3 my-0 is-fullheight is-uppercase is-multiline'>
            <nav style={{
                width: '100%',
                borderRadius: '1em 1em 0 0',
                border: 'solid #dadada88 1px',
            }}>
                <div className='level py-3 px-5 mb-0'>
                    <div className='level-item py-1 is-size-7'><span className='is-flex-grow-1 has-text-left has-text-centered-mobile'>Invoices</span></div>
                    <div className='level-item py-1 is-size-7 has-text-centered'>search</div>
                    <div className='level-item py-1 is-size-7'><span className='is-flex-grow-1 has-text-right has-text-centered-mobile'>Page 1 of 10</span></div>
                </div>
            </nav>
            {loading ?
                <div className='columns is-flex-centered is-gapless is-clipped' style={{
                    marginBottom: '0.8em',
                    borderRadius: '0 0 1em 1em',
                    backgroundColor: '#fafafa',
                    border: 'solid #dadada88 1px',
                    borderTop: 0,
                    height: '80%',
                }}>
                    <div className='column is-4 is-12-mobile'>
                        <div className='section px-6'>
                            <progress className="progress is-small is-danger" max="100">loading</progress>
                        </div>
                    </div>
                </div>
                :
                <div className='columns is-gapless' style={{
                    marginBottom: '0.8em',
                    borderRadius: '0 0 1em 1em',
                    backgroundColor: '#fafafa',
                    border: 'solid #dadada88 1px',
                    borderTop: 0,
                    minHeight: '80%',
                }}>
                    {invoices.length <= 0 && <Empty style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'transparent', width: '100%' }} text="No invoice available yet" />}

                    {invoices.length > 0 &&
                        <div className='table-container' style={{ width: '100%' }}>
                            <table className='table is-clipped is-bordered is-striped is-hoverable is-fullwidth' style={{
                                minWidth: '100%',
                                minHeight: '100%',
                                borderRadius: '0 0 1em 1em',
                                border: 'solid #dadada88 1px',
                            }}>
                                <thead>
                                    <tr className='is-size-7 py-2'>
                                        <th>Invoice ID</th>
                                        <th>Invoice Date</th>
                                        <th>Job title</th>
                                        <th>Location</th>
                                        <th>Amount</th>
                                        <th>Contractor Name</th>
                                        <th>Payment Method</th>
                                        <th>Invoice PDF</th>
                                    </tr>
                                </thead>
                                <tbody className='is-size-7 py-2'>
                                    {invoices.map(invoice => (
                                        <tr>
                                            <td>{invoice.invoiceReference}</td>
                                            <td>{moment(invoice.dateCreated).format('DD-MMM-YYYY')}</td>
                                            <td>{invoice.jobTitle}</td>
                                            <td>{invoice.location}</td>
                                            <td>{invoice.amount}</td>
                                            <td>{invoice.deployee}</td>
                                            <td>{invoice.paymentMethod}</td>
                                            <td><Link to={invoice.invoiceURL}>View PDF <FaDownload /></Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            }
        </div>
    )
}