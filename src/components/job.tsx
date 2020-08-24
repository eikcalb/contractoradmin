import React from 'react'
import { User, DUMMY_USER } from '../lib/user'
import { unix } from 'moment'
import { NavLink, Link } from 'react-router-dom'
import { STYLES } from '../lib/theme'

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