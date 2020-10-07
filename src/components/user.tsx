import React from 'react'
import { User, DUMMY_USER } from '../lib/user'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import links from '../lib/links'



export function UserListItem({ user }: { user: User }) {
    return (
        <div className="card">
            <div className='card-content'>
                <div className='columns is-vcentered is-mobile'>
                    <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                        <figure className='image is-flex is-96x96'>
                            <img className='is-rounded' src={user.profileImageURL} />
                        </figure>
                    </div>
                    <div className='column has-text-left ml-3'>
                        <p className='title is-5 my-1'>{`${user.firstName} ${user.lastName}`}</p>
                        <p className='is-size-5'><span className='icon has-text-info'><FaStar /></span>{user.starRate}</p>
                    </div>
                </div>
                <div className='content'>
                    <p style={{ maxLines: 2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{user.profileBio}</p>
                </div>
            </div>
            <div className='card-footer'>
                <Link to={links.profile} className='card-footer-item'>
                    <span>View Profile</span>
                </Link>
                <Link to={links.messages} className='card-footer-item'>
                    <span>Message</span>
                </Link>
            </div>
        </div>
    )
}

export function UserList({ className }) {
    return (
        <div className={className}>
            {[DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER, DUMMY_USER].map(u => (
                <Link key={u.id} to={`/f`} className='column is-4-widescreen is-6-desktop is-12-touch list-item' >
                    <UserListItem user={u} />
                </Link>
            ))}
        </div>
    )
}