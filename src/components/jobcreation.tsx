import Tags from "@yaireo/tagify/dist/react.tagify";
import React, { useState, useCallback, useMemo, useContext, useEffect, useLayoutEffect, createRef, Ref, useRef } from 'react';
import { FaChevronLeft, FaMapMarkerAlt, FaSearch, FaUpload, FaDollarSign } from 'react-icons/fa';
import { useToasts } from 'react-toast-notifications';
import { debounce, useLoadGoogleMaps } from "./util";
import { Job, IJob } from "../lib/job";
import firebase from 'firebase'
import { APPLICATION_CONTEXT } from "../lib";
import validator from "validator";
import { getCurrentLocation } from "../lib/location";
import { v4 } from "uuid";

/**
 * Component for creating a form field.
 * 
 * @param param Object containing parameters to build the input field
 */
export function FormField({ label, value, onChange, className, type, placeholder, icon, readOnly = false, locationAutocomplete = false, tagifyRef = null as any, required = false, whitelist = [] as any[], mode = 'select', disabled = false, loading = false, tags = false, showBorder = true, containerClassName = '', isTextArea = false, maxLength = Number.MAX_SAFE_INTEGER, helpTextTop = "", helpTextLeft = "", helpTextRight = "", hasAddons = false, addon = <></> }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const loadingGoogleMaps = useLoadGoogleMaps()
    let listener: google.maps.MapsEventListener
    let autocomplete: google.maps.places.Autocomplete

    useEffect(() => {

        if (inputRef.current && locationAutocomplete && !loadingGoogleMaps) {
            autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                fields: ['formatted_address', 'geometry', 'place_id']
            })

            listener = autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                const data = {
                    address: place.formatted_address,
                    coords: {
                        longitude: place.geometry?.location?.lng(),
                        latitude: place.geometry?.location?.lat(),
                    },
                    id: place.place_id,
                    place_id: place.place_id
                }
                onChange(data)
            })
        }

        return () => {
            listener?.remove()
            autocomplete?.unbindAll()
        }
    }, [loadingGoogleMaps, locationAutocomplete])

    useEffect(() => {
        if (!locationAutocomplete && inputRef.current && google) {
            listener?.remove()
            google.maps?.event?.clearInstanceListeners(inputRef.current)
        }
    }, [locationAutocomplete])

    return (
        <div className={`${containerClassName} ${showBorder ? 'job-form-field' : ''} field has-text-left`}>
            <label className='label is-flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}><span>{label}</span> <span className='has-text-right has-text-weight-normal is-size-7'>{helpTextTop}</span></label>
            {!hasAddons ?
                <div className={`control ${icon ? 'has-icons-left' : ''} is-expanded`}>
                    {isTextArea ?
                        tags ?
                            <Tags
                                tagifyRef={tagifyRef}
                                value={value}
                                settings={{
                                    placeholder,
                                    whitelist,
                                    mode: null,
                                    trim: true,
                                    autoComplete: {
                                        enabled: true,
                                        rightKey: true
                                    }
                                }}
                                inputMode='textarea'
                                className={`${className}`}
                                loading={loading}
                                maxLength={maxLength}
                                required={required}
                                disabled={disabled}
                                onChange={e => (onChange(e.target.value))}
                            />
                            :
                            <textarea required={required} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} className={`${className} textarea`} maxLength={maxLength} placeholder={placeholder} />
                        :
                        tags ?
                            <Tags
                                tagifyRef={tagifyRef}
                                value={value}
                                settings={{
                                    placeholder,
                                    whitelist,
                                    mode,
                                    trim: true,
                                    autoComplete: {
                                        enabled: true,
                                        rightKey: true
                                    },
                                    maxLength
                                }}
                                readOnly={readOnly}
                                required={required}
                                className={`${className} input`}
                                loading={loading}
                                maxLength={maxLength}
                                disabled={disabled}
                                onChange={e => (e.persist(), onChange(e.target.value))}
                            />
                            :
                            locationAutocomplete ?
                                <input ref={inputRef} key={'autocomplete'} required={required} disabled={disabled} value={undefined} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} />
                                :
                                <input ref={inputRef} key={'nonutocomplete'} required={required} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} />
                    }
                    {icon ? <span className='icon is-small is-left'>{icon}</span> : null}
                </div>
                :
                <div className={`${hasAddons ? 'has-addons' : ''} field`}>
                    <div className={`control ${icon ? 'has-icons-left' : ''} is-expanded`}>
                        {tags ?
                            <Tags
                                tagifyRef={tagifyRef}
                                value={value}
                                settings={{
                                    placeholder,
                                    whitelist,
                                    mode,
                                    trim: true,
                                    autoComplete: {
                                        enabled: true,
                                        rightKey: true
                                    }
                                }}
                                readOnly={readOnly}
                                required={required}
                                className={`${className} input`}
                                disabled={disabled}
                                loading={loading}
                                maxLength={maxLength}
                                onChange={e => (e.persist(), onChange(e.target.value))}
                            />
                            :
                            locationAutocomplete ?
                                <input ref={inputRef} key='autocomplete-2' required={required} disabled={disabled} value={undefined} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} style={{ borderRight: 0 }} />
                                :
                                <input ref={inputRef} key='non-autocomplete-2' required={required} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} className={`${className} input`} type={type} placeholder={placeholder} style={{ borderRight: 0 }} />
                        }
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

export function FileInput({ disabled, value, onChange, onRemovePhoto }) {
    const ref = useRef<HTMLInputElement>(null)

    return (
        <div className='field job-form-field has-text-left my-4'>
            <label className='label is-flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}><span>Job Photos</span> <span className='has-text-right has-text-weight-normal is-size-7'>Add photos to help describe this job</span></label>
            <div className='control is-expanded'>
                <div className='file is-flex is-centered is-normal'>
                    <label className='file-label is-flex-grow-1'>
                        <input onChange={(el) => {
                            if (el.target.files) {
                                const files: File[] = []
                                for (let i = 0; i < el.target.files?.length; i++) {
                                    files.push(el.target.files[i])
                                }
                                if (files.length > 0) {
                                    onChange(files)
                                }
                            }
                        }} className='file-input' multiple ref={ref} disabled={disabled} type='file' accept='image/*' />
                        <span className='file-cta is-flex is-flex-centered' style={{ width: '100%' }}>
                            <span className='file-icon'>
                                <FaUpload />
                            </span>
                            <span className='file-label'>
                                SELECT PHOTOS
                            </span>
                        </span>
                    </label>
                </div>
                {value && value.length > 0 ?
                    <div className='field is-grouped is-grouped-multiline'>
                        {value.map((file: File, index) =>
                            <div key={`${index}-${file.name}`} className='control mr-2 my-2 '>
                                <div className='tags has-addons'>
                                    <span key={`${file.name}-${file.size}-${index}`} className='tag is-dark'>{file.name}</span>
                                    <button onClick={() => { onRemovePhoto(index) }} className='tag is-delete'></button>
                                </div>
                            </div>
                        )}
                    </div>
                    : null}
            </div>
        </div>
    )
}

export function CreateJob({ onClose, show, onComplete }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        loading: false,
        tasks: '',
        type: '',
        title: '',
        description: '',
        address: '',
        requiredPersons: '',
        price: '',
        loadingTypes: true,
        fetchingLocation: false,
        manualAddress: false,
        location: null as any,
    })
    const [photos, setPhotos] = useState([] as File[])
    const { addToast } = useToasts()
    const types = useMemo(() => {
        return {
            jobTypes: new Array<string>(),
            location: [],
        }
    }, [])
    const tagifyRef = createRef(), tagifyRef2 = createRef()


    // const _search = debounce(async (ctx, cb) => {
    //     try {
    //         const jobTypes = types.allJobTypes.filter(type=>type)
    //         return cb(null, jobTypes)
    //     } catch (e) {
    //         cb(e, null)
    //     }
    // }, 500)

    useEffect(() => {
        new Promise(async () => {
            try {
                types.jobTypes = await Job.getJobTypes(ctx)
                const tagify: any = tagifyRef.current
                console.log(tagifyRef)
                if (tagify) {
                    tagify.settings.whitelist.length = 0; // reset current whitelist
                    tagify.loading(true).dropdown.hide.call(tagify)
                    tagify.settings.whitelist.push(...types.jobTypes, ...tagify.value)
                    tagify.loading(false).dropdown.hide.call(tagify, tagify.value);

                    (tagifyRef.current as any).settings.whitelist = types.jobTypes
                }
            } catch (e) {
                console.log(e)
                addToast('Failed to load job types!', { appearance: 'error' })
            }
        })
    }, [])

    return (
        <form className={`modal ${show ? 'is-active' : ''}`} onSubmit={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            setState({ ...state, loading: true })
            try {
                const job_type = JSON.parse(state.type)[0]?.value
                console.log(job_type, state.type)
                const newJob: any = {
                    date_created: firebase.firestore.FieldValue.serverTimestamp(),
                    job_title: state.title,
                    job_type,
                    posted_by: ctx.user?.id,
                    salary: parseInt(state.price, 10),
                    required_count: parseInt(state.requiredPersons, 10),
                    wage: 'deployment',
                    status: 'available',
                    tasks: JSON.parse(state.tasks).map(v => ({ id: v4(), text: v.value })),
                    location: state.location ? {
                        id: state.location.place_id,
                        place_id: state.location.place_id,
                        address: state.location.address,
                        coords: {
                            latitude: state.location.coords.latitude || null,
                            longitude: state.location.coords.longitude || null,
                            accuracy: state.location.coords.accuracy || null,
                            altitude: state.location.coords.altitude || null,
                            heading: state.location.coords.heading || null,
                            altitudeAccuracy: state.location.coords.altitudeAccuracy || null,
                            speed: state.location.coords.speed || null,
                        }, timestamp: state.location.timestamp || Date.now()
                    } : undefined,
                    job_description: state.description
                }
                if (state.manualAddress && !state.address) {
                    throw new Error('You must provide your address manually!')
                } else if (state.manualAddress) {
                    newJob.location.address = state.address
                }

                console.log(newJob)

                if (newJob.job_type && !validator.isEmpty(newJob.job_type) && !types.jobTypes.find(type => type === newJob.job_type)) {
                    // Job type is new. 
                    throw new Error('Invalid job type!')
                }

                await Job.addNewJob(ctx, newJob, photos)
                setState({ ...state, loading: false })
                addToast("Successfully added job!", { appearance: 'success' })
                onComplete()
            } catch (e) {
                console.log(e);
                setState({ ...state, loading: false })
                addToast(e.message || "Failed to add job!", { appearance: 'error' })
            }
        }}>
            <div className='modal-background'></div>
            <div className='modal-card'>
                <header className='modal-card-head'>
                    <div className='modal-card-title is-mobile is-vcentered columns'>
                        <div className='column has-text-left'>
                            <button className='button' onClick={onClose}><span className='icon'><FaChevronLeft /></span><span className='is-hidden-mobile'> View Current Jobs</span></button>
                        </div>
                        <div className='column has-text-left-mobile is-10-mobile'>
                            <span>New Job Listing</span>
                        </div>
                        <a className='column is-hidden-mobile'></a>
                    </div>
                </header>
                <div className='modal-card-body px-0'>
                    <div className='container'>
                        <div className='level px-4 pb-4' style={{ borderBottom: 'solid 1px #1112' }}>
                            <p className='level-item has-text-left is-block is-size-4 has-text-centered-touch'>Job Details</p>
                            <p className='level-item has-text-right is-block has-text-grey-light has-text-centered-touch'>All fields are required to be filled out</p>
                        </div>
                        <div className='container is-fluid pb-4 px-0'>
                            <div className='columns mx-0 px-4'>
                                <div className='column is-6'>
                                    <FormField required disabled={state.loading} maxLength={types.jobTypes.length} value={state.type} tagifyRef={tagifyRef} tags whitelist={types.jobTypes} onChange={(type) => { setState((state) => ({ ...state, type })) }} className='' containerClassName='mb-4' label="Job Type" placeholder='Begin typing a job type' type='text' icon={<FaSearch />} helpTextLeft='Search and select a job type to improve search results when finding a contractor' />
                                    <FormField required disabled={state.loading} value={state.title} onChange={(title) => setState({ ...state, title })} className='' containerClassName='my-4' label="Title" placeholder='Provide a title for the job' type='text' icon={null} helpTextLeft='Will be seen by contractors in search result and as an active status' helpTextRight='Maximum 30 characters' maxLength={30} />
                                    <FormField required disabled={state.loading} value={state.description} onChange={(description) => setState({ ...state, description })} className='' containerClassName='my-4' label="Description" isTextArea placeholder='Provide a description of the job' type='text' icon={null} helpTextLeft='Give a short description to improve finding a contractor that fits the job' helpTextRight='Maximum 80 characters' maxLength={80} />
                                    <FormField locationAutocomplete={!state.manualAddress} required={!state.manualAddress} disabled={state.loading || state.fetchingLocation} value={state.address} onChange={(e) => {
                                        if (state.manualAddress) {
                                            return setState({ ...state, address: e })
                                        }
                                        const { address, coords, place_id } = e
                                        setState((state) => ({
                                            ...state,
                                            location: {
                                                address,
                                                place_id,
                                                id: place_id,
                                                coords
                                            },
                                        }))
                                    }} className='' containerClassName='my-4' label="Location Address" placeholder='Begin typing the first line of the address' type='text' icon={<FaMapMarkerAlt />}
                                        hasAddons addon={(
                                            <div className='control'>
                                                <button disabled={state.loading || state.fetchingLocation} className={`button ${state.fetchingLocation ? 'is-loading' : ''} ${state.manualAddress ? 'is-info has-text-white' : ''}`} onClick={async () => {
                                                    const manualAddress = !state.manualAddress
                                                    if (manualAddress) {
                                                        // If manual address is true, fetch the current location
                                                        setState({ ...state, fetchingLocation: true })
                                                        try {
                                                            setState({ ...state, location: await getCurrentLocation() })
                                                            addToast("Using your current location!", { appearance: 'success' })
                                                            setState((state) => ({ ...state, address: '', manualAddress, fetchingLocation: false }))
                                                        } catch (e) {
                                                            console.log(e);
                                                            setState((state) => ({ ...state, fetchingLocation: false }))
                                                            addToast(e.message || "Failed to set location manually!", { appearance: 'error' })
                                                        }
                                                    } else {
                                                        setState((state) => ({ ...state, location: null, manualAddress }))
                                                    }
                                                }} type='button' style={{ color: state.manualAddress ? 'unset' : 'black', borderLeft: 0, zIndex: 4 }}><span className='is-size-7'>{state.manualAddress ? 'using current location' : 'or use current location'}</span></button>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className='column is-6'>
                                    <FormField required disabled={state.loading} value={state.requiredPersons} onChange={(requiredPersons) => setState({ ...state, requiredPersons })} hasAddons className='' containerClassName='mb-4' label="How many persons are needed for the job"
                                        placeholder='How many persons are needed for the job'
                                        type='number' helpTextRight='e.g. 10 persons maximum per job'
                                        icon={null}
                                        addon={(
                                            <div className='control'>
                                                <button className='button' disabled style={{ color: 'black', borderLeft: 0 }}>Persons</button>
                                            </div>
                                        )}
                                    />
                                    <FormField required disabled={state.loading} value={state.price} onChange={(price) => setState({ ...state, price })} hasAddons className='' containerClassName='my-4' label="Pay"
                                        placeholder='Provide an amount'
                                        type='number' helpTextLeft='Will be seen in search results. Cannot be adjusted once the listing is pending or active'
                                        icon={<FaDollarSign />}
                                        addon={(
                                            <div className='control'>
                                                <button className='button' disabled style={{ color: 'black', borderLeft: 0 }}>Per Deployment</button>
                                            </div>
                                        )}
                                    />
                                    <FormField required disabled={state.loading} value={state.tasks} tags onChange={(tasks) => setState((state) => ({ ...state, tasks }))} isTextArea className='' containerClassName='my-4' label="Tasks" placeholder='Add a task' type='text' icon={null} helpTextTop='Provide each task required to be completed for this listing' helpTextRight='Separate each task with a comma (,)' />

                                    <FileInput disabled={state.loading} value={photos} onRemovePhoto={(i) => { setPhotos(photos.filter((_, index) => index !== i)) }} onChange={(photos) => setPhotos(photos)} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <footer className='modal-card-foot is-flex-centered'>
                    <button disabled={state.loading} className='button' onClick={onClose}>Cancel</button>
                    <button disabled={state.loading} className={`button is-info ${state.loading ? 'is-loading' : ''}`} type='submit'>Confirm</button>
                </footer>
            </div>
        </form>
    )
}