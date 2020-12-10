import moment, { unix } from 'moment'
import React from 'react'
import { FaExpandAlt, FaStar, FaMapMarkerAlt, FaGlobeAfrica, FaClipboardList, FaHardHat } from 'react-icons/fa'
import { GrUserWorker } from "react-icons/gr";
import { NavLink } from 'react-router-dom'
import { STYLES } from '../lib/theme'
import { DUMMY_USER, User } from '../lib/user'
import { IJob } from '../lib/job'
import firebase from "firebase";

export function JobListItem({ job }: { job: IJob }) {
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
                                        <img className='is-rounded' src={job.user?.profileImageURL} />
                                    </figure>
                                </div>
                                <div className='column is-narrow'>
                                    <div className='title is-6'>{`${job.user?.firstName} ${job.user?.lastName}`}</div>
                                </div>
                                <div className='column has-text-right'>
                                    {time.calendar()}
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
    const time = moment(job.date_created.toMillis())
    let endTime
    if (job.date_completed) endTime = moment(job.date_completed.toMillis())

    return (
        <NavLink activeClassName="is-active" to={to} className={`job-item mb-8 is-block card is-shadowless has-background-white-ter`}>
            <div className='card-content'>
                <div className='container is-paddingless'>
                    <div className='columns'>
                        <div className='column is-6 has-text-centered-touch has-text-left'>
                            <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.job_title}</p>
                        </div>
                        <div className='column has-text-centered-touch has-text-right'>
                            <p>{job.location_address}</p>
                        </div>
                    </div>
                    <div className='columns is-vcentered is-mobile'>
                        <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                            <figure className='image is-flex is-32x32'>
                                <img className='is-rounded' src={job.user?.profileImageURL} />
                            </figure>
                        </div>
                        <div className='column is-narrow'>
                            <div className='title is-6'>{`${job.user?.firstName||'John'} ${job.user?.lastName||"Doe"}`}</div>
                        </div>
                        <div className='column has-text-right'>
                            {time.calendar()}
                        </div>
                    </div>
                    <div className='content'>
                        <p>{job.job_description}</p>
                    </div>
                </div>
                <div className='columns px-4 pt-4 is-vcentered is-mobile' style={{ flexDirection: 'column', flex: 1 }}>
                    <div className='column is-12'>
                        {job.progress && job.progress >= 100 ? (
                            <p>Completed {endTime.calendar()}</p>
                        ) :
                            <progress className="progress is-info" style={STYLES.jobProgressBar} value={job.progress || 0} max="100">{job.progress}</progress>
                        }
                    </div>
                </div>
            </div>
        </NavLink >
    )
}

export function JobDetail({ job, className }: { job: IJob | null, className?: string }) {
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
        <div className={`${className} card job-detail`} style={{ flexDirection: 'column' }}>
            <div className='card-content is-paddingless'>
                <div className='level py-4 mb-0'>
                    <div className='level-item is-size-6'>POSTED {time.calendar()}</div>
                    <div className='level-item is-size-4 has-text-weight-bold'>{job.job_title}</div>
                    <div className='level-item is-size-6'>{job.id}</div>
                </div>
                <div className='container is-fluid px-0'>
                    <div className='columns is-fullheight mx-0 is-multiline'>
                        <div className='column is-8-fullhd is-7-desktop is-12 px-0'>
                            <JobDetailTask job={job} />
                        </div>
                        <div className='column is-4-fullhd is-5-desktop is-12 is-flex'>
                            <JobDetailUser job={job} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function JobDetailTask({ job }: { job: IJob }) {
    let endTime, startTime, totalTime
    if (job.date_completed) endTime = unix(job.date_completed.toMillis())
    if (job.date_created) startTime = unix(job.date_created.toMillis())
    if (endTime && startTime) totalTime = endTime.diff(startTime, 'h', true)

    return (
        <div className='is-atleast-fullheight is-flex' style={{ flexDirection: 'column' }}>
            <figure className='image is-16by9' style={{ position: 'relative', paddingTop: '30%' }}>
                <img src={'https://via.placeholder.com/728x90.png'} />
                <a className='button is-large' style={{ position: 'absolute', bottom: 4, right: 4, background: 'transparent', border: 0 }}>
                    <span className='icon is-size-2'><FaExpandAlt /></span>
                </a>
            </figure>
            <div className='is-flex py-4' style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div className='section'>
                    <table className='table is-hoverable is-fullwidth'>
                        <tbody>
                            <tr>
                                <td className=' has-text-right'>LOCATION</td>
                                <td className=' has-text-left'>{job.location_address}</td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'>DESCRIPTION</td>
                                <td className=' has-text-left'>{job.job_description}</td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'>PAY</td>
                                <td className=' has-text-left'>{job.salary}</td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'>TASKS</td>
                                <td className=' has-text-left'>
                                    {job.tasks && job.tasks.length > 1 ? job.tasks?.map(task => <p>- {task.text}</p>) : `-`}
                                </td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'> START</td>
                                <td className='has-text-left'>{startTime.calendar() || `-`}</td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'>END</td>
                                <td className=' has-text-left'>{endTime?.calendar() || `-`}</td>
                            </tr>
                            <tr>
                                <td className=' has-text-right'>TOTAL TIME</td>
                                <td className=' has-text-left'>{totalTime?.toFixed(2) || `-`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {job.progress && job.progress >= 100 ? (
                    <button className='button is-info is-uppercase mx-4' style={{ alignSelf: 'flex-end' }}>View Invoice</button>
                ) :
                    <button className='button is-white is-uppercase is-inverted mx-4' style={{ alignSelf: 'flex-start' }}>Cancel Job</button>
                }
            </div>
        </div >
    )
}

export function JobDetailUser({ job }: { job: IJob }) {
    let startTime
    if (job.date_created) startTime = moment(job.date_created.toMillis() )

    return (
        <div className='container pt-4 pb-0 is-flex' style={{ flexDirection: 'column' }} >
            <div className='columns is-vcentered'>
                <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                    <figure className='image is-80x80 is-flex'>
                        <img className='is-rounded' src={job.user?.profileImageURL} />
                    </figure>
                </div>
                <div className='column'>
                    <div className='container'>
                        <div className='columns is-marginless is-vcentered is-mobile'>
                            <div className='column pb-0 pl-0'>
                                <p className='is-size-5 has-text-left has-text-weight-bold'>{`${job.user?.firstName || "John"} ${job.user?.lastName ||'Doe'}`}</p>
                            </div>
                            <div className="column has-text-right pr-0 pb-0 is-size-6">View Profile</div>
                        </div>
                        <div className='content has-text-left'>
                            <p className='is-size-6'><span className='icon has-text-info'><FaStar /></span>{job.user?.starRate} &nbsp;{generateUserJobType(DUMMY_USER)}</p>
                            <p>{job.user?.profileBio}</p>
                            <p className='has-text-right'><span className='is-uppercase has-text-grey-light is-size-7'>member since</span> {job.user?.dateCreated?.toDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='is-flex py-4' style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <table className='table is-hoverable is-fullwidth'>
                    <tbody>
                        <tr>
                            <td className='has-text-right'>CONTACT</td>
                            <td className='has-text-left'>{job.user?.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td className='has-text-right'>ACTIVE TASK</td>
                            <td className='has-text-left'>{job.user?.activeTask}</td>
                        </tr>
                        <tr>
                            <td className='has-text-right'>START TIME</td>
                            <td className='has-text-left'>{startTime.calendar()}</td>
                        </tr>
                        <tr>
                            <td className='has-text-right'>HIGHLIGHTE SKILLS AND LICENSES</td>
                            <td className='has-text-left'>
                                {job.user?.skills && job.user.skills.length > 1 ? job.user.skills?.map(task => <p>- {task}</p>) : `-`}
                            </td>

                        </tr>
                    </tbody>
                </table>
                <button className='button is-info is-uppercase mx-4' style={{ alignSelf: 'flex-start' }}>Message</button>
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