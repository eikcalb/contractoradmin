import moment, { unix } from 'moment'
import React, { useCallback, useState, useContext } from 'react'
import { FaExpandAlt, FaStar, FaMapMarkerAlt, FaGlobeAfrica, FaClipboardList, FaHardHat, FaCaretRight, FaArrowRight, FaChevronRight } from 'react-icons/fa'
import { ImSpinner } from "react-icons/im";
import { NavLink, Link } from 'react-router-dom'
import { STYLES } from '../lib/theme'
import { DUMMY_USER, User } from '../lib/user'
import { IJob, Job, JOB_MILE_RADIUS } from '../lib/job'
import firebase from "firebase";
import { useToasts } from 'react-toast-notifications';
import { wait } from './util';
import { APPLICATION_CONTEXT } from '../lib';
import { MapView } from './map';
import links from '../lib/links';
import { Message, IChatItem } from '../lib/message';
import logo from '../logo.jpg'

export function JobListItem({ job }: { job: IJob }) {
    const ctx = useContext(APPLICATION_CONTEXT)

    const time = moment(job.date_created.toDate())
    return (
        <div className='card'>
            <div className='card-content'>
                <div className='columns mb-0'>
                    <div className='column is-6 has-text-centered-touch has-text-left'>
                        <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.job_title}</p>
                    </div>
                    <div className='column has-text-centered-touch has-text-right'>
                        <p>{job.location_address}</p>
                    </div>

                </div>
                <div className='columns'>
                    <div className='column has-text-left'>
                        <p>{job.job_type}</p>
                    </div>
                </div>
            </div>
            <div className='card-footer'>
                <div className='card-footer-item'>
                    <div className='columns px-4 is-vcentered is-mobile' style={{ flexDirection: 'column', flex: 1 }}>
                        <div className='column is-12'>
                            <div className='columns is-vcentered is-mobile'>
                                <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                                    <figure className='image is-flex is-32x32'>
                                        <img className='is-rounded' src={Job.getPhotoURL(ctx, job.user?.id)} />
                                    </figure>
                                </div>
                                <div className='column is-narrow'>
                                    <div className='title is-6'>{`${job.user?.firstName} ${job.user?.lastName}`}</div>
                                </div>
                                <div className='column has-text-right'>
                                    {time.calendar({ sameElse: 'DD/MMM/YYYY' })}
                                </div>
                            </div>
                        </div>
                        <div className='column is-12'>
                            <progress className="progress is-info" style={STYLES.jobProgressBar} value={0} max="100">{0}</progress>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export function JobItem({ job, to }: { job: IJob, to: any }) {
    const ctx = useContext(APPLICATION_CONTEXT)

    if (job.status === 'available') {
        return <PendingJobItem job={job} to={to} key={`pending-${job.id}`} />
    }

    const time = moment(job.date_created.toMillis())
    let endTime
    if (job.date_completed) endTime = moment(job.date_completed.toMillis())

    return (
        <NavLink activeClassName="is-active" to={to} style={{ overflowX: 'auto' }} className={`job-item is-size-7 px-1 py-1 is-block card is-shadowless is-radiusless has-background-white`}>
            <div className='card-content py-2 px-2'>
                <div className='container is-paddingless'>
                    <div className='columns'>
                        <div className='column is-6 has-text-centered-touch has-text-left'>
                            <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.job_type}</p>
                        </div>
                        <div className='column has-text-centered-touch has-text-right has-text-grey'>
                            <p>{job.location_address}</p>
                        </div>
                    </div>
                    <div className='columns is-vcentered is-mobile'>
                        <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                            <figure className='image is-flex is-48x48'>
                                <img className='is-rounded' src={Job.getPhotoURL(ctx, job.user?.id)} />
                            </figure>
                        </div>
                        <div className='column px-0 has-text-left'>
                            <div className='title is-7 mb-1'>{`${job.user?.firstName || 'John'} ${job.user?.lastName || "Doe"}`}</div>
                            <p className='is-size-6'><span className='icon has-text-info'><FaStar /></span>{job.user?.starRate}</p>
                        </div>
                        <div className='column has-text-grey has-text-right'>
                            {time.calendar({ sameElse: 'DD/MMM/YYYY' })}
                        </div>
                    </div>

                </div>
                <div className='columns mb-0 is-vcentered has-text-grey is-mobile' style={{ flexDirection: 'column', flex: 1 }}>
                    <div className='column is-12'>
                        {job.progress && job.progress >= 100 ? (
                            <p>Completed {endTime.calendar({ sameElse: 'DD/MMM/YYYY' })}</p>
                        ) :
                            <progress className="progress is-info" style={STYLES.jobProgressBar} value={job.progress || 0} max="100">{job.progress}</progress>
                        }
                    </div>
                </div>
                <div className='content has-text-left has-text-grey is-flex is-flex-align-items-center'>
                    <span className='icon has-text-info is-size-6'><FaChevronRight /></span>
                    <span style={{ lineHeight: '2em' }}>{job.job_title}</span>
                </div>
            </div>
        </NavLink>
    )
}

export function PendingJobItem({ job, to }: { job: IJob, to: any }) {
    const ctx = useContext(APPLICATION_CONTEXT)

    return (
        <NavLink activeClassName="is-active" to={to} style={{ overflowX: 'auto' }} className={`job-item is-size-7 px-1 py-1 is-block card is-shadowless is-radiusless has-background-white`}>
            <div className='card-content py-2 px-2'>
                <div className='container is-paddingless'>
                    <div className='columns'>
                        <div className='column is-6 has-text-centered-touch has-text-left'>
                            <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.job_type}</p>
                        </div>
                        <div className='column has-text-centered-touch has-text-right has-text-grey'>
                            <p>{job.location_address}</p>
                        </div>
                    </div>
                    <div className='columns is-vcentered is-mobile'>
                        <div className='column has-text-left'>
                            <p className='is-size-7 is-flex is-vcentered'>
                                <span className='icon is-size-6 has-text-info spinner'><ImSpinner /></span>
                                <span style={{ lineHeight: '2em' }}>Pending</span>
                            </p>
                        </div>
                        <div className='column has-text-right'>
                            <p>Searching for deployee</p>
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export function JobDetail({ job, className, onCancel }: { onCancel: (job: IJob) => any, job: IJob | null, className?: string }) {
    if (!job) {
        return (
            <div className={`${className} card job-detail`} style={{ flexDirection: 'column' }}>
                <div className='card-content is-paddingless is-flex-centered has-text-grey my-6'>
                    <span className='my-4' ><FaHardHat fill='#811' style={{ height: "8rem", width: "8rem" }} /></span>
                    <p className='is-uppercase is-size-6 has-text-weight-bold'>View and manage job listings</p>
                </div>
            </div>
        )
    }
    const time = moment(job.date_created.toMillis())

    return (
        <div className={`${className} card job-detail is-size-6`} style={{ flexDirection: 'column' }}>
            <div className='card-content is-paddingless'>
                <div className='level py-4 mb-0' style={{ zIndex: 1 }}>
                    <div className='level-item is-size-7'>POSTED {time.calendar({ sameElse: 'DD/MMM/YYYY' })}</div>
                    <div className='level-item is-size-6 has-text-weight-bold'>{job.job_title}</div>
                    <div className='level-item is-size-7 has-text-grey'>{job.id}</div>
                </div>
                <div className='container is-fluid px-0'>
                    <div className='columns is-fullheight mx-0 my-0 is-multiline animate__animated animate__fadeIn'>
                        <div className='column is-8-fullhd is-7-desktop is-12 px-0 pt-0'>
                            <JobDetailTask onJobCancel={onCancel} job={job} />
                        </div>

                        {job.status === "available" || job.status === 'in review' ?
                            <div style={{ borderLeft: 'solid 1px #8881' }} className='column is-4-fullhd is-5-desktop is-12 is-flex is-paddingless'>
                                <MapView job={job} className='container pt-4 pb-0 is-flex' />
                            </div>
                            :
                            <div style={{ borderLeft: 'solid 1px #8881' }} className='column is-4-fullhd is-5-desktop is-12 is-flex'>
                                <JobDetailUser job={job} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export function JobDetailTask({ job, onJobCancel }: { job: IJob, onJobCancel }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({ loadingCancel: false })
    const { addToast } = useToasts()

    let endTime, startTime, totalTime
    if (job.date_completed) endTime = unix(job.date_completed.toMillis() / 1000)
    if (job.date_created) startTime = unix(job.date_created.toMillis() / 1000)
    if (endTime && startTime) totalTime = endTime.diff(startTime, 'h', true)

    const onCancel = useCallback(async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to cancel this job? If Job is accepted, it will return to the job pool. Otherwise, the job will be deleted")
            if (!confirmed) {
                return
            }
            setState({ ...state, loadingCancel: true })
            await Job.cancelJob(ctx, job)
            addToast('Cancelled job successfully!', { appearance: 'success' })
            onJobCancel(job)
        } catch (e) {
            addToast(e.message || 'Failed to cancel job!', { appearance: 'error' })
        } finally {
            setState({ ...state, loadingCancel: false })
        }
    }, [job, state])

    return (
        <div className='is-atleast-fullheight is-flex' style={{ flexDirection: 'column' }}>
            {job.status === 'available' ?
                <div className='section has-text-centered is-size-6'>
                    <span className='px-4 py-4 is-flex is-flex-centered'>Searching for deployees within {JOB_MILE_RADIUS} mile radius from you</span>
                </div>
                :
                job.status === 'in review' ?
                    <JobReview job={job} />
                    :
                    <MapView zoom={15} zoomControl={false} vertical={false} job={job} className='container pb-0 is-flex' />
            }
            <div className='is-flex py-4' style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div className='section py-2 pb-3'>
                    <table className='table is-hoverable is-fullwidth'>
                        <tbody className='is-flex is-flex-direction-column is-size-7'>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>TYPE</td>
                                <td style={{ flex: 2 }} className=' has-text-left'>{job.job_type}</td>
                            </tr>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>LOCATION</td>
                                <td style={{ flex: 2 }} className=' has-text-left'>{job.location_address}</td>
                            </tr>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>DESCRIPTION</td>
                                <td style={{ flex: 2 }} className=' has-text-left'>{job.job_description}</td>
                            </tr>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>PAY</td>
                                <td style={{ flex: 2 }} className='is-flex-align-items-center is-flex has-text-left'><span>${job.salary}</span>&nbsp;<span className='has-text-grey-light'>/{job.wage || 'deployment'}</span></td>
                            </tr>
                            {job.tasks && job.tasks.length > 0 ?
                                <tr className='is-flex has-text-left'>
                                    <td style={{ flex: 1 }} className='has-text-grey'>TASKS</td>
                                    <td style={{ flex: 2 }} className=' has-text-left'>
                                        {job.tasks?.map(task => <p key={task.text}>- {task.text}</p>)}
                                    </td>
                                </tr>
                                : null}
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'> START</td>
                                <td style={{ flex: 2 }} className='has-text-left'>{startTime.calendar({ sameElse: 'DD/MMM/YYYY' }) || `-`}</td>
                            </tr>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>END</td>
                                <td style={{ flex: 2 }} className=' has-text-left'>{endTime?.calendar({ sameElse: 'DD/MMM/YYYY' }) || `-`}</td>
                            </tr>
                            <tr className='is-flex has-text-left'>
                                <td style={{ flex: 1 }} className='has-text-grey'>TOTAL TIME</td>
                                <td style={{ flex: 2 }} className=' has-text-left'>{totalTime?.toFixed(2) || `-`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {job.progress && job.progress >= 100 ? (
                    <button className='button is-info is-uppercase mx-4' style={{ alignSelf: 'flex-end' }}>View Invoice</button>
                ) :
                    <button disabled={state.loadingCancel} onClick={onCancel} className={`button is-white is-uppercase is-inverted mx-4 ${state.loadingCancel ? 'is-loading' : ''}`} style={{ alignSelf: 'flex-start', color: 'white' }}>Cancel Job</button>
                }
            </div>
        </div >
    )
}

export function JobDetailUser({ job }: { job: IJob }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    let startTime
    if (job.date_created) startTime = moment(job.date_created.toMillis())

    return (
        <div className='container pt-4 pb-0 is-flex' style={{ flexDirection: 'column' }} >
            <div style={{ borderBottom: 'solid #aaa4 0.2px' }} className='columns is-vcentered'>
                <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                    <figure className='image is-80x80 is-flex'>
                        <img className='is-rounded' src={Job.getPhotoURL(ctx, job.user?.id)} style={{ border: 'solid #eaeaea 0.5px' }} onError={(img) => img.currentTarget.src = logo} />
                    </figure>
                </div>
                <div className='column'>
                    <div className='container'>
                        <div className='columns is-marginless is-vcentered is-mobile'>
                            <div className='column pb-0 pl-0'>
                                <p className='is-size-6 has-text-left has-text-weight-bold'>{`${job.user?.firstName} ${job.user?.lastName}`}</p>
                            </div>
                            <Link to={{ pathname: `${links.profile}/${job.user!.id}`, state: { user: job.user } }} className="column is-narrow has-text-right has-text-link pr-0 pb-0 is-size-7">View Profile</Link>
                        </div>
                        <div className='content has-text-left'>
                            <p className='is-size-6'><span className='icon has-text-info'><FaStar /></span>{job.user?.starRate}
                                {/* TODO: should option of remote or onsite be present?
                             &nbsp;{generateUserJobType(DUMMY_USER)} 
                             */}
                            </p>
                            <p className='is-size-7'>{job.user?.profileBio}</p>
                            <p className='has-text-left has-text-grey-light is-size-8'><span className='is-uppercase'>member since</span>&nbsp; {moment(job.user?.dateCreated).calendar({ sameElse: 'DD/MMM/YYYY' })}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='is-flex py-4' style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <table className='table is-hoverable is-fullwidth'>
                    <tbody className='is-size-7'>
                        <tr className='is-flex has-text-left'>
                            <td style={{ flex: 1 }} className='has-text-grey'>CONTACT</td>
                            <td style={{ flex: 2 }} className='has-text-left'>{job.user?.phoneNumber}</td>
                        </tr>
                        {/* <tr>
                            <td className='has-text-right'>ACTIVE TASK</td>
                            <td className='has-text-left'>{job.user?.activeTask}</td>
                        </tr> */}
                        <tr className='is-flex has-text-left'>
                            <td style={{ flex: 1 }} className='has-text-grey'>START TIME</td>
                            <td style={{ flex: 2 }} className='has-text-left'>{startTime.calendar({ sameElse: 'DD/MMM/YYYY' })}</td>
                        </tr>
                        <tr className='is-flex has-text-left'>
                            <td style={{ flex: 1 }} className='has-text-grey'>HIGHLIGHTED SKILLS AND LICENSES</td>
                            <td style={{ flex: 2 }} className='has-text-left'>
                                {job.user?.skills && job.user.skills.length > 0 ? job.user.skills?.map(task => <p>- {task}</p>) : `-`}
                            </td>

                        </tr>
                    </tbody>
                </table>
                <Link to={{
                    pathname: `${links.messages}/${Message.generateID(ctx.user?.id, job.user?.id)}`,
                    state: {
                        chat: {
                            id: Message.generateID(ctx.user?.id, job.user?.id),
                            initialized: false,
                            recipient: job.user,
                            users: [ctx.user, job.user],
                        } as IChatItem
                    }
                }} className='button is-info is-uppercase mx-4' style={{ alignSelf: 'flex-start' }}>Message</Link>
            </div>
        </div>
    )
}


export function JobReview({ job }: { job: IJob }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    let startTime
    if (job.date_created) startTime = moment(job.date_created.toMillis())

    return (
        <div className='section pt-5 is-flex is-clipped' style={{ flexDirection: 'column' }} >
            <div className='columns is-paddingless'>
                <div className='content column is-narrow is-size-6 has-text-centered px-4'>
                    <span className='is-flex is-flex-centered'>Deployee Found</span>
                </div>
                <div className='columns column is-vcentered'>
                    <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                        <figure className='image is-80x80 is-flex'>
                            <img className='is-rounded' src={Job.getPhotoURL(ctx, job.user?.id)} style={{ border: 'solid #eaeaea 0.5px' }} onError={(img) => img.currentTarget.src = logo} />
                        </figure>
                    </div>
                    <div className='column'>
                        <div className='container'>
                            <div className='columns is-marginless is-vcentered is-mobile'>
                                <div className='column pb-0 pl-0'>
                                    <p className='is-size-6 has-text-left has-text-weight-bold'>{`${job.user?.firstName || "John"} ${job.user?.lastName || 'Doe'}`}</p>
                                </div>
                                <div className="column is-narrow has-text-right has-text-info pr-0 pb-0 is-size-7">View Profile</div>
                            </div>
                            <div className='content has-text-left'>
                                <p className='is-size-6'><span className='icon has-text-info'><FaStar /></span>{job.user?.starRate}
                                    {/* TODO: should option of remote or onsite be present?
                             &nbsp;{generateUserJobType(DUMMY_USER)} 
                             */}
                                </p>
                                <p className='is-size-7'>{job.user?.profileBio}</p>
                                <p className='has-text-left has-text-grey-light is-size-7'><span className='is-uppercase'>member since</span>&nbsp; {moment(job.user?.dateCreated).calendar({ sameElse: 'DD/MMM/YYYY' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function generateUserJobType(user: User) {
    switch (user.jobType) {
        case 'onsite':
            return <><span className='icon has-text-info'><FaMapMarkerAlt /></span> On Site</>
        case 'remote':
            return <><span className='icon has-text-info'><FaGlobeAfrica /></span> Remote</>
    }
}

export interface IJobSample {
    user: User
    timestamp: number
    title: string
    description: string
    location: string
    progress?: number
    startTime?: number
    endTime?: number
    tasks?: string[]
    fullLocation?: string
    id
}

export const DUMMY_JOBS: IJobSample[] = [
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        progress: 80,
        tasks: [],
        id: 'papdsdp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papdefvzsdp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 99,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papdw3dsdp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 20,
        id: 'padpp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 90,
        id: 'papdvp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        id: 'papdfp'
    }
]

export const DUMMY_COMPLETED: IJobSample[] = [
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 100,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papdw3dsdp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 100,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papdw3dsdp'
    },
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        progress: 100,
        startTime: Date.now() - 12300000,
        endTime: Date.now(),
        tasks: ["Clear porch", "Clear backyard"],
        id: 'papdw3dsdp'
    },
]