import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { JobDetail } from '../components/job';
import { CreateJob } from '../components/jobcreation';
import { JobSideList } from "../components/JobSideList";
import { useEscapeHandler } from "../components/util";
import { IJob, Job } from '../lib/job';
import links from '../lib/links';
import { DUMMY_USER, User } from '../lib/user';
import { APPLICATION_CONTEXT } from '../lib';

export function Jobs() {
    const ctx = useContext(APPLICATION_CONTEXT);
    const [state, setState] = useState({ loading: false, showModal: false, selected: null as null | IJob })
    const [active, setActive] = useState([] as IJob[])
    const [inactive, setInactive] = useState([] as IJob[])
    const { addToast } = useToasts()
    const location = useLocation()

    const dismissModal = () => {
        setState({ ...state, showModal: false })
        const containers = window.document.getElementsByClassName('pac-container')
        for (let i; i < containers.length; i++) {
            containers.item(i)?.remove()
        }
    }

    const removeEscapeHandler = useEscapeHandler(dismissModal)

    useEffect(() => {
        return removeEscapeHandler()
    }, [])

    useEffect(() => {
        setState({ ...state, loading: true });
        const unsubscribe = Job.listenForActiveAndPendingJobs(async (err, docs: IJob[]) => {
            if (err) {
                setState({ ...state, loading: false });
                return addToast(err.message || 'Failed to get jobs!');
            }
            docs = await Promise.all(
                docs.map(async (v) => {
                    if (v.status !== 'available' && v.executed_by) {
                        v.user = await User.getExternalUser(ctx, v.executed_by);
                    }
                    return v;
                })
            );
            setState({ ...state, loading: false });
            setActive(docs)
        })

        Job.getInactiveJobs().then(async (jobs) => await jobs.map(async (v: IJob) => {
            v.user = await User.getExternalUser(ctx, v.executed_by);
            return v;
        })).then(jobs => {
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
            <JobSideList activeJobs={active} inactiveJobs={inactive} onCreateNew={() => setState({ ...state, showModal: true })} className='column is-3 is-12-mobile is-12-touch is-clipped is-fullheight' />
            <JobDetail onCancel={(job: IJob) => {
                if (job.status === 'complete') {
                    setInactive(inactive.filter(v => v.id !== job.id))
                } else {
                    setActive(active.filter(v => v.id !== job.id))
                }
                setState({ ...state, selected: null })
            }}
                job={id ? state.selected : null} className='column is-9 is-12-touch is-12-mobile is-flex' />
            {state.showModal ?
                <CreateJob show={state.showModal} onClose={dismissModal} onComplete={() => {
                    dismissModal()
                }} />
                : null}
        </div>
    )
}