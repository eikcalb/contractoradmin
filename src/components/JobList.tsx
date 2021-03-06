import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_USER, User } from '../lib/user';
import { APPLICATION_CONTEXT } from '../lib';
import { Job, IJob } from '../lib/job';
import { useToasts } from 'react-toast-notifications';
import { JobListItem } from './job';
import links from '../lib/links';
import { Empty } from './util';
import { FaHardHat } from 'react-icons/fa';

export function JobList({ className }: { className?: string; }) {
    const ctx = useContext(APPLICATION_CONTEXT);
    const [state, setState] = useState({ jobs: new Array<IJob>(), loading: false });

    const { addToast } = useToasts();

    useEffect(() => {
        setState({ ...state, loading: true });
        const unsubscribe = Job.listenForActiveJobs(ctx, async (err, docs: IJob[]) => {
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
            setState({ ...state, jobs: docs, loading: false });
        });

        return unsubscribe;
    }, []);

    return (
        <div className={className}>
            {state.loading ?
                <progress className="progress is-small is-info my-6" max="100">loading</progress>
                :
                <>
                    {state.jobs.length < 1 &&
                        <Empty style={{ background: 'transparent' }} text='No Active Job Available!' icon={<FaHardHat className='has-text-warning-dark is-size-4 mb-2' />} />}
                    {state.jobs.map(j => (
                        <Link key={j.id} to={`${links.activeJobs}/${j.id}`} className={`column ${state.jobs.length == 1 ? 'is-12' : 'is-4-fullhd is-6-desktop is-12-touch'} list-item`}>
                            <JobListItem job={j} />
                        </Link>
                    ))}
                </>
            }
        </div>
    );
}
