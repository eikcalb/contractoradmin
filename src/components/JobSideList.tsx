import React from 'react';
import { BsPencilSquare } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa';
import { GoSettings } from "react-icons/go";
import { NavLink, Route } from 'react-router-dom';
import links from '../lib/links';
import { JobItem } from './job';

export function JobSideList({ className, activeJobs, inactiveJobs, onCreateNew }) {
    return (
        <div className={`${className} panel job-panel has-background-white-ter is-flex is-size-7`}>
            <div className='panel-heading is-flex is-vcentered'>
                <p className='has-text-left is-size-6'>Job Listings</p>
                <a className='button is-small is-rounded is-size-7' onClick={onCreateNew}><BsPencilSquare /></a>
            </div>
            <div className='panel-block'>
                <div className='field has-addons' style={{ flex: 1 }}>
                    <div className='control is-expanded has-icons-left'>
                        <input style={{ borderRight: 0 }} className='input is-rounded' type='search' placeholder='Search Jobs...' />
                        <span className='icon is-left'><FaSearch /></span>
                    </div>
                    <div className='control'>
                        <button style={{ borderLeft: 0 }} className='button is-rounded' onClick={() => window.alert("not ready yet!")} >
                            <span className='icon is-right'><GoSettings /></span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='panel-tabs'>
                <NavLink to={`${links.activeJobs}`} activeClassName='is-active'>Active</NavLink>
                <NavLink to={`${links.inactiveJobs}`} activeClassName='is-active'>Inactive</NavLink>
            </div>
            <div className='has-background-white-ter' style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Route path={`${links.activeJobs}`} render={() => activeJobs.map(j => <JobItem key={j.id} job={j} to={`${links.activeJobs}/${j.id}`} />)} />
                <Route path={`${links.inactiveJobs}`} render={() => inactiveJobs.map(j => <JobItem key={j.id} job={j} to={`${links.inactiveJobs}/${j.id}`} />)} />
            </div>
        </div>
    );
}
