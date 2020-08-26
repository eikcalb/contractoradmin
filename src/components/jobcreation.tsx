import React from 'react'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'

export function FormField({ label, className, type, placeholder, icon, showBorder = true, containerClassName = '', isTextArea = false, maxLength = Number.MAX_SAFE_INTEGER, helpTextTop = "", helpTextLeft = "", helpTextRight = "", hasAddons = false, addon = <></> }) {
    return (
        <div className={`${containerClassName} ${showBorder ? 'job-form-field' : ''} field has-text-left`}>
            <label className='label is-flex' style={{ justifyContent: 'space-between' }}><span>{label}</span> <span className='has-text-right has-text-weight-normal is-size-7'>{helpTextTop}</span></label>
            {!hasAddons ?
                <div className={`control ${icon ? 'has-icons-left' : ''} is-expanded`}>
                    {isTextArea ?
                        <textarea className={`${className} textarea`} maxLength={maxLength} placeholder={placeholder} />
                        :
                        <input maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} />
                    }
                    {icon ? <span className='icon is-small is-left'>{icon}</span> : null}
                </div>
                :
                <div className={`${hasAddons ? 'has-addons' : ''} field`}>
                    <div className={`control ${icon ? 'has-icons-left' : ''} is-expanded`}>
                        <input maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} style={{ borderRight: 0 }} />
                        {icon ? <span className='icon is-small is-left'>{icon}</span> : null}
                    </div>
                    {addon}
                </div>
            }
            <div className='help'>
                <div className='container'>
                    <div className='columns'>
                        {helpTextLeft ? <p className='column has-text-left has-text-centered-touch'>{helpTextLeft} </p> : null}
                        {helpTextRight ? <p className='column has-text-right has-text-centered-touch'>{helpTextRight} </p> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function CreateJob({ onClose, show, onComplete }) {
    return (
        <div className={`modal ${show ? 'is-active' : ''}`}>
            <div className='modal-background'></div>
            <div className='modal-card'>
                <header className='modal-card-head'>
                    <div className='modal-card-title is-flex' style={{ justifyContent: 'space-between' }}>
                        <span>New Job Listing</span>
                    </div>
                </header>
                <div className='modal-card-body px-0'>
                    <div className='container'>
                        <div className='level px-4'>
                            <p className='level-item has-text-left is-block is-size-4 has-text-centered-touch'>Job Details</p>
                            <p className='level-item has-text-right is-block has-text-grey-light has-text-centered-touch'>All fields are required to be filled out</p>
                        </div>
                        <div className='container is-fluid pb-4 px-0'>
                            <div className='columns px-4'>
                                <div className='column is-6 pr-4'>
                                    <FormField className='' containerClassName='mb-4' label="Job Type" placeholder='Begin typing a job type' type='text' icon={<FaSearch />} helpTextLeft='Search and select a job type to improve search results when finding a contractor' />
                                    <FormField className='' containerClassName='my-4' label="Title" placeholder='Provide a title for the job' type='text' icon={null} helpTextLeft='Will be seen by contractors in search result and as an active status' helpTextRight='Maximum 30 characters' maxLength={30} />
                                    <FormField className='' containerClassName='my-4' label="Description" isTextArea placeholder='Provide a description of the job' type='text' icon={null} helpTextLeft='Give a short description to improve finding a contractor that fits the job' helpTextRight='Maximum 80 characters' maxLength={80} />
                                    <FormField className='' containerClassName='my-4' label="Location Address" placeholder='Begin typing a job type' type='text' icon={<FaMapMarkerAlt />}
                                        hasAddons addon={(
                                            <div className='control'>
                                                <button className='button' disabled style={{ color: 'black', borderLeft: 0 }}><span className='is-size-7'>or enter the address manually</span></button>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className='column is-6 pl-4'>
                                    <FormField hasAddons className='' containerClassName='mb-4' label="How many persons are needed for the job"
                                        placeholder='How many persons are needed for the job'
                                        type='number' helpTextRight='10 persons maximum per job'
                                        icon={null}
                                        addon={(
                                            <div className='control'>
                                                <button className='button' disabled style={{ color: 'black', borderLeft: 0 }}>Persons</button>
                                            </div>
                                        )}
                                    />
                                    <FormField hasAddons className='' containerClassName='my-4' label="Pay"
                                        placeholder='Provide an amount'
                                        type='number' helpTextLeft='Will be seen in search results. Cannot be adjusted once the listing is pending or active'
                                        icon={null}
                                        addon={(
                                            <div className='control'>
                                                <button className='button' disabled style={{ color: 'black', borderLeft: 0 }}>Per Hour</button>
                                            </div>
                                        )}
                                    />
                                    <FormField isTextArea className='' containerClassName='my-4' label="Tasks" placeholder='Add a task' type='text' icon={null} helpTextTop='Provide each task required to be completed for this listing' />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <footer className='modal-card-foot is-flex-centered'>
                    <button className='button' onClick={onClose}>Cancel</button>
                    <button className='button is-info' onClick={onComplete}>Confirm</button>
                </footer>
            </div>
        </div>
    )
}