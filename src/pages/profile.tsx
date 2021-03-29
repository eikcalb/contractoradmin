import React, { useContext, useEffect, useState } from 'react';
import { FaEnvelope, FaExclamationCircle, FaGraduationCap, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { Empty } from "../components/util";
import { APPLICATION_CONTEXT } from '../lib';
import { Job } from '../lib/job';
import { User } from '../lib/user';
import moment from "moment";
import logo from '../logo.svg'


/**
 * Profile component for viewing details of a user's profile. 
 */
export function Profile() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState<boolean>(true)
    const [comments, setComments] = useState<{ text: string, first_name: string, last_name: string }[]>([])
    const [loadingComments, setLoadingComments] = useState<boolean>(true)
    const location = useLocation()
    const { id } = useParams()
    const { addToast } = useToasts()

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const { user } = location.state as { user: User } || { user: null }
                if (user) {
                    setUser(user)
                } else {
                    if (!id) {
                        throw new Error('No user found!')
                    }
                    const user = await User.getExternalUser(ctx, id)
                    setUser(user)
                }
            } catch (e) {
                console.log(e)
                addToast(e.message || 'Failed to load user data!', { appearance: 'error' })
            } finally {
                setLoading(false)
            }
        })()
    }, [location])

    useEffect(() => {
        (async () => {
            if (!user) {
                setLoadingComments(false)
                return
            }
            try {
                setLoadingComments(true)
                const commentsData = await User.getComments(id)
                setComments(commentsData)
            } catch (e) {
                console.log(e)
                addToast(e.message || 'Failed to load comments!', { appearance: 'error' })
            } finally {
                setLoadingComments(false)
            }
        })()
    }, [user])

    return (
        <div className='is-1 is-variable px-3 py-3 my-0 is-fullheight is-multiline'>
            <div className='has-background-link' style={{
                height: '10em',
                width: '100%',
                borderRadius: '1em 1em 0 0',
                border: 'solid #dadada88 1px',
                borderBottom: 0
            }}></div>
            {loading ?
                <div className='columns is-flex-centered is-gapless is-clipped' style={{
                    marginBottom: '0.8em',
                    borderRadius: '0 0 1em 1em',
                    backgroundColor: '#fafafa',
                    border: 'solid #dadada88 1px',
                    borderTop: 0,
                    height: '76%',
                }}>
                    <div className='column is-4 is-12-mobile'>
                        <div className='section px-6'>
                            <progress className="progress is-small is-danger" max="100">loading</progress>
                        </div>
                    </div>
                </div>
                :
                !user ?
                    <Empty className='is-flex is-flex-direction-column is-size-5 is-flex-centered'
                        icon={<FaExclamationCircle className='has-text-danger is-size-1 mb-4' />}
                        style={{
                            marginBottom: '0.8em',
                            borderRadius: '0 0 1em 1em',
                            backgroundColor: '#fafafa',
                            border: 'solid #dadada88 1px',
                            borderTop: 0,
                            height: '76%',
                        }}>
                        <p className='block has-text-grey is-size-6'>No user found!</p>
                    </Empty>
                    :
                    <div className='columns is-gapless' style={{
                        marginBottom: '0.8em',
                        borderRadius: '0 0 1em 1em',
                        backgroundColor: '#fafafa',
                        border: 'solid #dadada88 1px',
                        borderTop: 0,
                        minHeight: '68%',
                    }}>
                        <div className='column is-3 is-flex is-flex-direction-column has-text-left' style={{ alignItems: 'stretch' }}>
                            <figure className='image is-flex is-128x128' style={{ top: '-5.6em', alignSelf: 'center' }}>
                                <img className='is-rounded' onError={(img) => img.currentTarget.src = logo} src={Job.getPhotoURL(ctx, user.id)} style={{ background: 'radial-gradient(#fff ,#3273dc 300% 4%)', border: 'solid #8884 0.1px' }} />
                            </figure>
                            <div className='is-flex mb-4 is-flex-direction-column px-5' style={{ justifyContent: 'space-between', alignItems: 'stretch', flexGrow: 1, position: 'relative' }}>
                                <div className='content has-text-left' style={{ position: 'relative', top: '-4em', width: '100%' }}>
                                    <p className='mb-1 has-text-weight-bold'>{user.firstName} {user.lastName}</p>
                                    <p className='mb-2 is-inline-flex has-text-grey-light'>
                                        <span className='is-capitalized mr-2'>{user.occupation}</span>
                                        <span className='is-inline-flex'>
                                            <span className='icon has-text-info'><FaStar /></span>
                                            <span>{user.starRate}</span>
                                        </span>
                                    </p>
                                    <p className='mb-2'>{user.profileBio}</p>
                                    <p className='mb-1 is-flex has-text-grey' style={{ alignItems: 'center' }}>
                                        <span className='icon mr-2'><FaMapMarkerAlt /></span>{user.city || <span className='has-text-grey-light is-italic is-size-7'>Not Specified</span>}
                                    </p>
                                    <p className='mb-1 is-flex has-text-grey' style={{ alignItems: 'center' }}>
                                        <span className='icon mr-2'><FaEnvelope /></span>{user.email || <span className='has-text-grey-light is-italic is-size-7'>Not Specified</span>}
                                    </p>
                                    <p className='mb-1 is-flex has-text-grey' style={{ alignItems: 'center' }}>
                                        <span className='icon mr-2 is-size-5'><FaGraduationCap /></span>{user.educationalBackground[0] || <span className='has-text-grey-light is-italic is-size-7'>Not Specified</span>}
                                    </p>
                                </div>
                                <div className='has-text-grey-light is-uppercase has-text-left is-size-7'>Joined {moment(user.dateCreated).calendar({ sameElse: 'DD/MMM/YYYY' })}</div>
                            </div>
                        </div>
                        <div className='column is-5 is-flex is-flex-direction-column has-text-left' style={{ alignItems: 'stretch', border: 'solid #dadada88 1px', }}>
                            <div className='is-flex is-flex-direction-column' style={{ justifyContent: 'flex-start', alignItems: 'stretch', flexGrow: 1, position: 'relative' }}>
                                <header className='px-5 py-3 is-size-7 has-text-weight-bold is-uppercase'>Comments</header>
                                <div className='content has-text-left px-5 py-2 is-size-7 has-background-white' style={{ flexGrow: 1 }}>
                                    {loadingComments ?
                                        <div className='section px-6'>
                                            <progress className="progress is-small is-danger" max="100">loading</progress>
                                        </div>
                                        :
                                        <>
                                            {comments.length < 1 && <Empty className='mb-4' icon={<FaExclamationCircle className='has-text-warning-dark is-size-2 mb-3' />} style={{ backgroundColor: 'transparent' }} text={`${user.id === ctx.user!.id ? 'You have' : 'User has'} not received any comment yet!`} />}
                                            {comments.map(comment => <p className='my-3'><span>"{comment.text}"</span><span>-{`${comment.first_name} ${comment.last_name}`}</span></p>)}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='column is-4 is-flex is-flex-direction-column has-text-left' style={{ alignItems: 'stretch' }}>
                            <div className='is-flex is-flex-direction-column' style={{ justifyContent: 'flex-start', alignItems: 'stretch', flexGrow: 1, position: 'relative' }}>
                                <header className='px-5 py-3 is-size-7 has-text-weight-bold is-uppercase'>Skills</header>
                                <div className='has-text-left px-5 py-2 is-size-7 has-background-white'>
                                    {user.skills.length < 1 && <Empty className='mb-4' icon={<FaExclamationCircle className='has-text-warning-dark is-size-2 mb-3' />} style={{ backgroundColor: 'transparent' }} text={`${user.id === ctx.user!.id ? 'You have' : 'User has'} not selected any skill yet!`} />}
                                    {user.skills.map(skill => {
                                        return <p className='my-3'>- {skill}</p>
                                    })}
                                </div>
                                <header className='px-5 py-3 is-size-7 has-text-weight-bold is-uppercase'>Licenses</header>
                                <div className='has-text-left px-5 py-2 is-size-7 has-background-white' style={{ flexGrow: 1 }}>
                                    {user.licenses.length < 1 && <Empty icon={<FaExclamationCircle className='has-text-warning-dark is-size-2 mb-3' />} style={{ backgroundColor: 'transparent' }} text={`${user.id === ctx.user!.id ? 'You have' : 'User has'} not provided any licnese yet!`} />}
                                    {user.licenses.map(license => {
                                        return (
                                            <div className='columnsmy-3 has-text-centered-mobile'>
                                                <p className='column'>- {license.license_number}</p>
                                                <p className='column is-3'>Expires {moment(license.expiration_date).calendar({ sameElse: 'DD/MMM/YYYY' })}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}