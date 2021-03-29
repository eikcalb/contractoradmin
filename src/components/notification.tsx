import moment from "moment";
import React, { useState, createContext, useCallback, useEffect, useContext } from 'react';
import { FaCaretDown, FaCaretUp, FaCheck, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Empty } from './util';
import { geoFirestore } from "../lib/firebase";
import { User } from "../lib/user";
import { APPLICATION_CONTEXT } from "../lib";

const NotificationContext = createContext<{ notifications: INotification[], addNotification: (notif: INotification) => any }>({ notifications: [], addNotification: (notif) => { } })

export function NotificationProvider(props) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const addNotification = useCallback((notification: INotification) => {
        setNotifications([notification, ...notifications])
    }, [notifications])

    useEffect(() => {
        const unsubscribe = User.listenForNotifications(ctx, (err, notifications) => {
            if (err) {
                console.log(err)
            } else {
                setNotifications(notifications || [])
            }
        })

        return () => { unsubscribe() }
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export function NotificationItem({ notification }: { notification: INotification }) {
    const time = moment.unix(notification.dateCreated.toMillis() / 1000)
    return (
        <div className='container is-fluid is-paddingless list-item py-2' title={notification.title}>
            <div className='columns is-variable is-1 py-1 px-1 is-vcentered'>
                <div className='column is-paddingless is-6 has-text-left has-text-centered-mobile  list-item-title'>
                    <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: "hidden" }}>{getNotificationIcon(notification)} {notification.title}</p>
                </div>
                <div className='column is-paddingless has-text-right has-text-centered-mobile list-item-subtitle'>
                    <p style={{ maxLines: 2 }}>{time.fromNow()}</p>
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
            return <span className='icon has-text-white has-background-info is-small' style={{ borderRadius: '50%', fontSize: '0.6em' }}> <FaSearch /> </span>
        case 'location':
            return <span className='icon has-text-white has-background-info is-small' style={{ borderRadius: '50%', fontSize: '0.6em' }}> <FaMapMarkerAlt /> </span>
        case 'progress':
            return <span className='icon has-text-white has-background-info is-small' style={{ borderRadius: '50%', fontSize: '0.6em' }}> <FaCheck /> </span>
    }
}

export function NotificationList({ className }) {
    const [expanded, setExpanded] = useState(true)
    const notifCtx = useContext(NotificationContext)
    console.log()
    return (
        <nav className={className}>
            <div className='panel is-clipped' >
                <div onClick={() => setExpanded(!expanded)} className='panel-heading is-size-6 has-text-left has-background-white-bis is-align-items-center is-flex is-flex-direction-row is-justify-content-space-between'>
                    <p>Notifications</p>
                    <button className='button is-static has-background-white is-rounded is-size-8 is-small'>
                        {!expanded ?
                            <FaCaretUp size={16} className={`icon has-text-black is-small`} />
                            :
                            <FaCaretDown size={16} className={`icon has-text-black is-small`} />}
                    </button>
                </div>
                <div style={{ transition: "all 0.500s linear" }} className={`${!expanded ? 'is-height-0' : ''}`}>
                    {notifCtx.notifications.length > 0 ?
                        notifCtx.notifications.map((n, index) => (
                            <Link key={`${n.id}-${index}`} to={`/f`} className='panel-block'>
                                <NotificationItem notification={n} />
                            </Link>
                        ))
                        :
                        <Empty text='No Notification available' />
                    }
                </div>
            </div>
        </nav>
    )
}

export interface INotification {
    content: string
    dateCreated
    type: 'discovery' | 'location' | 'progress'
    title: string
    id: string
}

const DUMMY_NOTIFICATIONS: INotification[] = [
    {
        content: 'testing 123',
        dateCreated: Date.now(),
        type: 'discovery',
        title: 'testing notification',
        id: '23xe'
    },
    {
        content: 'testing 12',
        dateCreated: Date.now(),
        type: 'location',
        title: 'testing notification',
        id: '23xe'
    },
    {
        title: 'testing 1',
        dateCreated: Date.now(),
        type: 'progress',
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.?",
        id: '23se'
    },
    {
        title: 'testing 1',
        dateCreated: Date.now(),
        type: 'location',
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.?",
        id: '23se'
    },
    {
        title: 'testing 1',
        dateCreated: Date.now(),
        type: 'discovery',
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.?",
        id: '23se'
    }
]