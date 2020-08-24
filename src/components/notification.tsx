import React from 'react'
import { FaSearch, FaMapMarkerAlt, FaCheckSquare } from 'react-icons/fa'
import moment from "moment";
import { Link, NavLink } from 'react-router-dom';

export function NotificationItem({ notification }: { notification: INotification }) {
    const time = moment.unix(notification.timestamp / 1000)
    return (
        <div className='container is-fluid is-paddingless list-item' title={notification.title}>
            <div className='columns is-variable is-1 py-1 px-1 is-vcentered'>
                <div className='column is-paddingless is-6 has-text-left list-item-title'>
                    <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{getNotificationIcon(notification)} {notification.title}</p>
                </div>
                <div className='column is-paddingless has-text-right list-item-subtitle'>
                    <p>{time.fromNow()}</p>
                </div>
            </div>
            <div className='content'>
                <p>
                    {notification.content}
                </p>
            </div>
        </div>
    )
}

export function getNotificationIcon(notif: INotification) {
    switch (notif.type) {
        case 'discovery':
            return <FaSearch />
        case 'location':
            return <FaMapMarkerAlt />
        case 'progress':
            return <FaCheckSquare />
    }
}

export function NotificationList({ className }) {
    return (
        <nav className={className}>
            <div className='panel'>
                <div className={'panel-heading'}>
                    Notifications
            </div>
                {DUMMY_NOTIFICATIONS.map(n => (
                    <NavLink key={n.id} to={`/f`} activeClassName='is-active' className='panel-block'>
                        <NotificationItem notification={n} />
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export interface INotification {
    content: string
    timestamp
    type: 'discovery' | 'location' | 'progress'
    title: string
    id: string
}


const DUMMY_NOTIFICATIONS: INotification[] = [
    {
        content: 'testing 123',
        timestamp: Date.now(),
        type: 'discovery',
        title: 'testing notification',
        id: '23e'
    }
]