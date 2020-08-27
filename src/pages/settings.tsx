import React, { useState, useContext } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment } from "../components/util";
import { JobListItem, JobList, JobSideList, JobDetail, DUMMY_JOBS } from '../components/job';
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { NavLink, Route, Switch } from 'react-router-dom';
import links from '../lib/links';
import { FaCog, FaCogs } from 'react-icons/fa';
import { APPLICATION_CONTEXT } from '../lib';
import { unix } from 'moment';

export function SettingsDetail({ title, children = <></> }) {
    return (
        <div className="container is-fluid settings-detail">
            <div className='content mb-0 py-4'>
                <p className='has-text-weight-bold is-size-4 has-text-left has-text-centered-mobile'>{title}</p>
            </div>
            {children}
        </div>
    )
}

export function Settings() {
    const ctx = useContext(APPLICATION_CONTEXT)


    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <div className={`box px-0 py-0`} style={{ flexDirection: 'column', flex: 1 }}>
                <div className='card-content is-paddingless is-atleast-fullheight is-flex' style={{ flexDirection: 'column' }}>
                    <div className='level py-4 mb-0' style={{ boxShadow: '0 0.125em 0.25em rgba(10, 10, 10, .1)' }}>
                        <div className='level-left-item is-size-6'>
                            <p className="title is-size-6 has-text-weight-bold pl-4">Settings</p>
                        </div>
                    </div>
                    <div className='container is-flex is-fluid px-0'>
                        <div className='columns mx-0 is-multiline' style={{ flexGrow: 1 }}>
                            <div className='column is-2-fullhd is-3-desktop is-12 px-0'>
                                <div className='container'>
                                    <NavLink className='has-text-black' activeClassName='is-active' to={links.loginAndSecurity} exact>
                                        <div className='py-4 is-size-5 settings-link' >
                                            <p className='mx-4'>Login and Security</p>
                                        </div>
                                    </NavLink>
                                    <NavLink className='has-text-black' activeClassName='is-active' to={links.paymentMethods}>
                                        <div className='py-4 is-size-5 settings-link' >
                                            <p className='mx-4'>Payment Methods</p>
                                        </div>
                                    </NavLink>
                                    <NavLink className='has-text-black' activeClassName='is-active' to={links.additionalFeatures}>
                                        <div className='py-4 is-size-5 settings-link' >
                                            <p className='mx-4'>Additional Features</p>
                                        </div>
                                    </NavLink>
                                    <NavLink className='has-text-black' activeClassName='is-active' to={links.legalDocuments}>
                                        <div className='py-4 is-size-5 settings-link' >
                                            <p className='mx-4'>Legal Documents</p>
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                            <div className='column is-10-fullhd is-9-desktop is-12 is-flex px-0'>
                                <Switch >
                                    <Route path={links.loginAndSecurity} exact render={() => (
                                        <LoginAndSecurity />
                                    )} />
                                    <Route render={() => (
                                        <div className="container is-fluid is-flex-centered settings-detail py-6">
                                            <div className='content has-text-grey'>
                                                <span className='my-4' ><FaCogs fill='#811' style={{ height: "8rem", width: "8rem" }} /></span>
                                                <p className='is-uppercase is-size-6 has-text-weight-bold'>View and manage job listings</p>
                                            </div>
                                        </div>
                                    )} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export function LoginAndSecurity() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        email: ctx.user?.email, editEmail: false, isLoadingEmail: false,
        lastPasswordChanged: ctx.user?.lastPasswordChanged ? unix(ctx.user?.lastPasswordChanged / 1000) : null
    })

    return (
        <SettingsDetail title={"Login and Security"} children={(
            <>
                <div className='columns'>
                    <div className='column has-text-left has-text-centered-mobile'>
                        <p className='title input is-size-5 pb-2 is-shadowless px-0' style={{ border: 0 }}>Email Address</p>
                        <p className='subtitle has-text-grey'>Email address connected to your account</p>
                    </div>
                    <div className='column has-text-right has-text-centered-mobile'>
                        <div className={`control`}>
                            <input className={`input ${state.editEmail ? '' : 'is-static'} has-text-black is-size-5 has-text-right has-text-centered-mobile`} value={state.email} contentEditable={false} disabled={!state.editEmail} onChange={e => setState({ ...state, email: e.target.value })} />
                        </div>
                        <div className='field is-grouped is-grouped-right'>
                            <div className='control'>
                                <button className='button is-white' onClick={() => setState({ ...state, editEmail: !state.editEmail })}>Change</button>
                            </div>
                            {state.editEmail ? (
                                <div className='control'>
                                    <button className={`button is-info ${state.isLoadingEmail ? 'is-loading' : ''}`} onClick={() => {
                                        setState({ ...state, isLoadingEmail: true })
                                    }}>Change</button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className='columns'>
                    <div className='column has-text-left has-text-centered-mobile'>
                        <p className='title input is-size-5 pb-2 is-shadowless px-0' style={{ border: 0 }}>Phone Number</p>
                        <p className='subtitle has-text-grey'>Your phone number provided upon signing-up</p>
                    </div>
                    <div className='column has-text-right has-text-centered-mobile'>
                        <div className={`control`}>
                            <input className={`input is-static has-text-right has-text-black is-size-5 has-text-centered-mobile`} disabled value={ctx.user?.contact} />
                        </div>
                        <p className='subtitle has-text-grey'>Due to restrictions, contact support to modify your phone number</p>

                    </div>
                </div>
                <div className='columns'>
                    <div className='column has-text-left has-text-centered-mobile'>
                        <p className='title input is-size-5 pb-2 is-shadowless px-0' style={{ border: 0 }}>Password</p>
                        <p className='subtitle has-text-grey'>Maintain a strong, unique password to protect your account</p>
                    </div>
                    <div className='column has-text-right has-text-centered-mobile'>
                        <div className={`control`}>
                            <input className={`input is-static has-text-right has-text-black is-size-5 has-text-centered-mobile`} disabled value={ctx.user?.contact} />
                        </div>
                        <p className='subtitle has-text-grey'>{state.lastPasswordChanged ? `Last modified ${state.lastPasswordChanged.calendar()}` : "Never Changed"}</p>

                    </div>
                </div>
            </>
        )} />
    )
}