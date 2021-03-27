import React, { useCallback, useState, useEffect, memo } from 'react';
import { BsPencilSquare } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa';
import { NavLink, Route } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { IJob } from '../lib/job';
import links from '../lib/links';
import { JobItem } from './job';
import { Empty, Loading } from './util';
import { useDebouncedCallback } from "use-debounce";

export interface IJobListProps {
    className
    activeJobs: IJob[]
    inactiveJobs: IJob[]
    onCreateNew: any
    isActive: boolean
}

export const JobSideList = ({ className, activeJobs, isActive, inactiveJobs, onCreateNew }) => {
    const [activeSearchData, setActiveSearchData] = useState<IJob[] | null>(null)
    const [inactiveSearchData, setInactiveSearchData] = useState<IJob[] | null>(null)
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const searchAlg = useCallback((query: string, jobs: IJob[], callback: (err?: Error, job?: IJob[]) => void) => {
        if (!query || jobs?.length <= 0) {
            return jobs
        }
        const regexp = new RegExp(query, 'i')

        const result = jobs.filter(job => {
            return job.job_description?.search(regexp) >= 0 || job.job_title?.search(regexp) >= 0 || job.location_address?.search(regexp) >= 0 || job.job_type?.search(regexp) >= 0
        })
        callback(undefined, result)
    }, [activeJobs, inactiveJobs, searchText])

    const triggerSearch = useCallback(async (search) => {
        setIsLoading(true)
        try {
            if (isActive) {
                if (activeJobs.length < 1) {
                    throw new Error('There is no active job to search')
                }
                setActiveSearchData(await new Promise<IJob[]>((res, rej) => {
                    searchAlg(search, activeJobs, ((err, result) => {
                        if (err) {
                            rej(err)
                        } else {
                            if (!result || result.length < 1) {
                                rej(new Error('No data'))
                            } else {
                                setIsLoading(false)
                                res(result)
                            }
                        }
                    }))
                }))
            } else {
                if (inactiveJobs.length < 1) {
                    throw new Error('There is no inactive job to search')
                }
                setInactiveSearchData(await (new Promise<IJob[]>((res, rej) => {
                    searchAlg(search, inactiveJobs, ((err, result) => {
                        if (err) {
                            rej(err)
                        } else {
                            if (!result || result.length < 1) {
                                rej(new Error('No data'))
                            } else {
                                setIsLoading(false)
                                res(result)
                            }
                        }

                    }))
                })))
            }
        } catch (e) {
            console.log(e)
            setActiveSearchData([])
            setInactiveSearchData([])
            setIsLoading(false)
        }
    }, [activeJobs, inactiveJobs])

    const search = useDebouncedCallback((() => {
        // e.stopPropagation()
        // e.preventDefault()

        const search = searchText.trim()
        if (!search) {
            setActiveSearchData(null)
            setInactiveSearchData(null)
        }
        if (search) {
            triggerSearch(search)
        }
    }), 800)

    useEffect(() => {
        search()
    }, [searchText])

    return (
        <div className={`${className} panel job-panel has-background-white-ter is-flex is-size-7`}>
            <div className='panel-heading is-flex is-vcentered pb-4'>
                <p className='has-text-left is-size-6'>Job Listings</p>
                <a className='button is-small is-rounded is-size-7' onClick={onCreateNew}><BsPencilSquare /></a>
            </div>
            <div className='panel-block'>
                <form onSubmit={search} className='field has-addons' style={{ flex: 1 }}>
                    <div className={`control is-expanded has-icons-left`}>
                        <input style={{ borderRight: 0 }} className='input is-rounded' value={searchText} onChange={(e => setSearchText(e.target.value))} type='search' placeholder='Search Jobs...' />
                        <span className='icon is-left'><FaSearch /></span>
                    </div>
                    {/* <div className='control'>
                        <button style={{ borderLeft: 0 }} className='button is-rounded' onClick={() => window.alert("not ready yet!")} >
                            <span className='icon is-right'><GoSettings /></span>
                        </button>
                    </div> */}
                </form>
            </div>
            <div className='panel-tabs'>
                <NavLink to={`${links.activeJobs}`} activeClassName='is-active'>Active</NavLink>
                <NavLink to={`${links.inactiveJobs}`} activeClassName='is-active'>Inactive</NavLink>
            </div>
            <div className='has-background-white-ter' style={{ overflowY: 'auto', overflowX: 'hidden' }}>

                <Route path={`${links.activeJobs}`} render={() => {
                    if (isLoading) {
                        return <div key='active-loader' className='px-6 my-6 is-flex'><progress style={{ height: '0.4rem' }} className="progress is-small my-6" max="100">loading</progress></div>
                    } else if (searchText && activeSearchData && activeSearchData.length < 1) {
                        return <Empty key='active-empty' className='my-6' style={{ backgroundColor: 'transparent' }} text={'Search did not return any job'} />
                    } else {
                        return (searchText && activeSearchData ? activeSearchData : activeJobs).map(j => <JobItem key={j.id} job={j} to={`${links.activeJobs}/${j.id}`} />)
                    }
                }} />
                <Route path={`${links.inactiveJobs}`}
                    render={() => {
                        if (isLoading) {
                            return <div className='px-6 my-6 is-flex'><progress style={{ height: '0.4rem' }} className="progress is-small my-6" max="100">loading</progress></div>
                        } else if (searchText && inactiveSearchData && inactiveSearchData.length < 1) {
                            return <Empty className='my-6' style={{ backgroundColor: 'transparent' }} text={'Search did not match any job'} />
                        } else {
                            return (searchText && inactiveSearchData ? inactiveSearchData : inactiveJobs).map(j => <JobItem key={j.id} job={j} to={`${links.inactiveJobs}/${j.id}`} />)
                        }
                    }} />
            </div>
        </div>
    );
}