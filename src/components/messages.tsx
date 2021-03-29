import moment from "moment";
import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { CgMoreAlt } from 'react-icons/cg';
import { FaSearch, FaComments } from 'react-icons/fa';
import { GoSettings } from 'react-icons/go';
import { User, DUMMY_USER } from '../lib/user';
import { NavLink } from "react-router-dom";


export function MessageListItem({ message }: { message: IMessage }) {
    const time = moment.unix(message.timestamp / 1000)
    return (
        <NavLink activeClassName="is-active" to={'./'} className={`message-item mb-8 is-block card is-shadowless has-background-white-ter`}>
            <div className='card-content'>
                <div className='container is-paddingless'>
                    <div className='columns'>
                        <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                            <figure className='image is-flex is-48x48'>
                                <img className='is-rounded' src={message.author.profileImageURL} />
                            </figure>
                        </div>
                        <div className='column'>
                            <div className='columns mb-0 is-mobile name-bar'>
                                <div className='has-text-left column is-narrow is-size-5 has-text-weight-medium'>
                                    <p>{`${message.author.firstName} ${message.author.lastName}`}</p>
                                </div>
                                <div className='has-text-right column'>
                                    <p>{time.calendar({sameElse:'DD/MMM/YYYY'})}</p>
                                </div>
                            </div>
                            <div className='content has-text-left'>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export function MessageList({ onCreateNew = () => { }, className = '' }) {
    return (
        <div className={`${className} panel job-panel has-background-white-ter is-flex`}>
            <div className='panel-heading is-flex is-vcentered'>
                <p className='has-text-left'>Recent Messages</p>
                <div className='field is-grouped is-grouped-right'>
                    <button className='button is-rounded' onClick={onCreateNew}><BsPencilSquare /></button>
                    <button className='button is-rounded' onClick={onCreateNew}><CgMoreAlt /></button>
                </div>
            </div>
            <div className='panel-block'>
                <div className='field has-addons' style={{ flex: 1 }}>
                    <div className='control is-expanded has-icons-left'>
                        <input style={{ borderRight: 0 }} className='input is-rounded' type='search' placeholder='Search Messages...' />
                        <span className='icon is-left'><FaSearch /></span>
                    </div>
                    <div className='control'>
                        <button style={{ borderLeft: 0 }} className='button is-rounded' onClick={() => window.alert("not ready yet")}>
                            <span className='icon is-right'><GoSettings /></span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='has-background-white-ter' style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {
                    DUMMY_MESSAGES.map(m => <MessageListItem message={m} />)
                }
            </div>
        </div>
    )
}

export function MessageDetail({ message, className, contact }: { contact?: User, className?: string, message: IMessage[] }) {
    if (!message || !contact) {
        return (
            <div className={`${className} card job-detail`} style={{ flexDirection: 'column' }}>
                <div className='card-content is-paddingless is-flex-centered has-text-grey my-6'>
                    <span className='my-4' ><FaComments fill='#811' style={{ height: "8rem", width: "8rem" }} /></span>
                    <p className='is-uppercase is-size-6 has-text-weight-bold'>Select a contact to start a chat</p>
                </div>
            </div>
        )
    }
    return (
        <div className={`${className} card job-detail`} style={{ flexDirection: 'column' }}>
            <div className='card-content is-paddingless'>
                <div className='level py-4 mb-0'>
                    <div className='level-item is-size-6'></div>
                    <div className='level-item is-size-4 has-text-weight-bold'>{`${contact.firstName} ${contact.lastName}`}</div>
                    <div className='level-item is-size-6 pr-4' style={{ justifyContent: 'flex-end' }}>
                        <button className='button is-rounded'><CgMoreAlt /></button>
                    </div>
                </div>
                <div className='container is-fluid px-0'>
                    <div className='columns is-fullheight mx-0 is-multiline'>
                        <div className='column is-8-fullhd is-7-desktop is-12 px-0'>

                        </div>
                        <div className='column is-4-fullhd is-5-desktop is-12 is-flex'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export interface IMessage {
    content
    author: User
    timestamp
    type: 'text' | 'image' | 'attachment'
    id
}

export const DUMMY_MESSAGES: IMessage[] = [
    {
        content: 'hello',
        author: DUMMY_USER,
        timestamp: Date.now(),
        type: 'text',
        id: 'abcdefgh'
    }
]