import React from 'react'
import { User, DUMMY_USER } from '../lib/user'
import { unix } from 'moment'
import { NavLink, Link } from 'react-router-dom'
import { STYLES } from '../lib/theme'
import { FaSearch } from 'react-icons/fa'
import { GoSettings } from "react-icons/go";
import { BsPencilSquare } from "react-icons/bs";

export function JobListItem({ job }: { job: IJob }) {
    const time = unix(job.timestamp / 1000)
    return (
        <div className='card'>
            <div className='card-content'>
                <div className='columns'>
                    <div className='column is-6 has-text-centered-touch has-text-left'>
                        <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.title}</p>
                    </div>
                    <div className='column has-text-centered-touch has-text-right'>
                        <p>{job.location}</p>
                    </div>
                </div>
                <div className='content'>
                    <p>{job.description}</p>
                </div>
            </div>
            <div className='card-footer'>
                <div className='card-footer-item'>
                    <div className='columns px-4 is-vcentered is-mobile' style={{ flexDirection: 'column', flex: 1 }}>
                        <div className='column is-12'>
                            <div className='columns is-vcentered is-mobile'>
                                <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                                    <figure className='image is-flex is-32x32'>
                                        <img className='is-rounded' src={job.user.profileImageURL} />
                                    </figure>
                                </div>
                                <div className='column is-narrow'>
                                    <div className='title is-6'>{`${job.user.firstName} ${job.user.lastName}`}</div>
                                </div>
                                <div className='column has-text-right'>
                                    {time.calendar()}
                                </div>
                            </div>
                        </div>
                        <div className='column is-12'>
                            <progress className="progress is-info" style={STYLES.jobProgressBar} value={job.progress || 0} max="100">{job.progress}</progress>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export function JobItem({ job }: { job: IJob }) {
    const time = unix(job.timestamp / 1000)

    return (
        <div className='card is-shadowless has-background-white-ter'>
            <div className='card-content'>
                <div className='columns'>
                    <div className='column is-6 has-text-centered-touch has-text-left'>
                        <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{job.title}</p>
                    </div>
                    <div className='column has-text-centered-touch has-text-right'>
                        <p>{job.location}</p>
                    </div>
                </div>
                <div className='columns is-vcentered is-mobile'>
                    <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                        <figure className='image is-flex is-32x32'>
                            <img className='is-rounded' src={job.user.profileImageURL} />
                        </figure>
                    </div>
                    <div className='column is-narrow'>
                        <div className='title is-6'>{`${job.user.firstName} ${job.user.lastName}`}</div>
                    </div>
                    <div className='column has-text-right'>
                        {time.calendar()}
                    </div>
                </div>
                <div className='content'>
                    <p>{job.description}</p>
                </div>
            </div>
            <div className='columns px-4 is-vcentered is-mobile' style={{ flexDirection: 'column', flex: 1 }}>
                <div className='column is-12'>
                    <progress className="progress is-info" style={STYLES.jobProgressBar} value={job.progress || 0} max="100">{job.progress}</progress>
                </div>
            </div>
        </div>
    )
}

export function JobDetail({ job }: { job: IJob }) {
    const time = unix(job.timestamp / 1000)

    return (
        <div className='card is-fullheight job-detail'>
            <div className='card-content is-paddingless'>
                <div className='level py-4 mb-0'>
                    <div className='level-item is-size-7'>POSTED {time.calendar()}</div>
                    <div className='level-item is-size-4 has-text-weight-bold'>{job.title}</div>
                    <div className='level-item is-size-7'>{job.id}</div>
                </div>
                <div className='container is-fluid px-0'>
                    <div className='columns is-fullheight'>
                        <div className='column is-narrow is-fullheight px-0'>
                            <div className='is-16by9'></div>
                        </div>
                        <div className='column'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function JobList({ className }: { className?: string }) {
    return (
        <div className={className}>

            {DUMMY_JOBS.map(j => (
                <Link key={j.id} to={`/f`} className='column is-3-fullhd is-4-widescreen is-6-desktop is-12-touch list-item' >
                    <JobListItem job={j} />
                </Link>
            ))}
        </div>
    )
}

export function JobSideList({ className }) {
    return (
        <div className={`${className} panel job-panel has-background-white-ter`}>
            <div className='panel-heading is-flex is-vcentered'>
                <p className='has-text-left'>Job Listings</p>
                <a className='button is-rounded'><BsPencilSquare /></a>
            </div>
            <div className='panel-block'>
                <div className='field has-addons' style={{ flex: 1 }}>
                    <div className='control is-expanded has-icons-left'>
                        <input className='input is-rounded' type='search' placeholder='Search Jobs...' />
                        <span className='icon is-left'><FaSearch /></span>
                    </div>
                    <div className='control'>
                        <button className='button is-rounded'>
                            <span className='icon is-right'><GoSettings onClick={() => window.alert("paparazi")} /></span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='panel-tabs'>
                <NavLink to={'/'} activeClassName='is-active'>Active</NavLink>
                <NavLink to={'/inactive'} activeClassName='is-active'>Inactive</NavLink>
            </div>
            {DUMMY_JOBS.map(j => (
                <Link key={j.id} to={`/f`} className='job-item' >
                    <JobItem job={j} />
                </Link>
            ))}
        </div>
    )
}

export interface IJob {
    user: User
    timestamp: number
    title: string
    description: string
    location: string
    progress?: number
    id
}

export const DUMMY_JOBS: IJob[] = [
    {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam, nihil ipsam. Accusamus officiis aut velit voluptatum quis eligendi veniam nam.",
        title: "Lorem ipsum dolor sit.",
        location: "Vancouver, Canada",
        timestamp: Date.now(),
        user: DUMMY_USER,
        id: 'papp'
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