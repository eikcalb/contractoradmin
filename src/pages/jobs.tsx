import React, { useState, useEffect } from 'react'
import { NotificationList } from '../components/notification'
import { PaymentList } from '../components/payment'
import { CardFragment, useEscapeHandler } from "../components/util";
import { JobListItem, JobDetail, DUMMY_JOBS } from '../components/job';
import { JobSideList } from "../components/JobSideList";
import { JobList } from "../components/JobList";
import { UserList } from '../components/user';
import { CreateJob } from '../components/jobcreation';
import { IJob, Job } from '../lib/job';
import { useToasts } from 'react-toast-notifications';
import { DUMMY_USER } from '../lib/user';
import { useParams, useRouteMatch, useLocation } from 'react-router-dom';
import links from '../lib/links';

export function Jobs() {
    const [state, setState] = useState({ loading: false, showModal: false, selected: null as null | IJob })
    const [active, setActive] = useState([] as IJob[])
    const [inactive, setInactive] = useState([] as IJob[])
    const { addToast } = useToasts()
    const location = useLocation()

    const removeEscapeHandler = useEscapeHandler(() => setState({ ...state, showModal: false }))

    useEffect(() => {
        return removeEscapeHandler()
    }, [])

    useEffect(() => {
        setState({ ...state, loading: true });
        const unsubscribe = Job.listenForActiveJobs(async (err, docs: IJob[]) => {
            if (err) {
                setState({ ...state, loading: false });
                return addToast(err.message || 'Failed to get jobs!');
            }
            docs = await Promise.all(
                docs.map(async (v) => {
                    v.user = DUMMY_USER;
                    return v;
                })
            );
            setState({ ...state, loading: false });
            setActive(docs)
        })

        Job.getInactiveJobs().then(jobs => {
            setInactive(jobs)
        }).catch(e => {
            console.log(e)
            addToast(e.message || "Failed to get inactive jobs", {
                appearance: 'error'
            })
        })

        return unsubscribe;
    }, []);

    const { id } = useParams()
    const activeMatch = useRouteMatch({
        path: links._jobItem.active,
        strict: true,
        exact: true
    })
    const inactiveMatch = useRouteMatch({
        path: links._jobItem.inactive
    })

    useEffect(() => {
        if (id) {
            if (activeMatch) {
                const selected = active.find(v => v.id === id)
                console.log(id, 'active: ', activeMatch, inactiveMatch, 'selected: ', selected)
                setState({ ...state, selected: selected || null })
            } else if (inactiveMatch) {
                const selected = inactive.find(v => v.id === id)
                setState({ ...state, selected: selected || null })
            }
        }
    }, [location, active, inactive])

    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <JobSideList activeJobs={active} inactiveJobs={inactive} onCreateNew={() => setState({ ...state, showModal: true })} className='column is-3 is-12-touch is-clipped is-fullheight' />
            <JobDetail onCancel={(job: IJob) => {
                if (job.status === 'complete') {
                    setInactive(inactive.filter(v => v.id !== job.id))
                } else {
                    setActive(active.filter(v => v.id !== job.id))
                }
                setState({ ...state, selected: null })
            }}
                job={id ? state.selected : null} className='column is-9 is-12-touch is-flex' />
            {state.showModal ?
                <CreateJob show={state.showModal} onClose={() => setState({ ...state, showModal: false })} onComplete={() => {
                    setState({ ...state, showModal: false })
                }} />
                : null}
        </div>
    )
}