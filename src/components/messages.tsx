import React from 'react'
import { User } from '../lib/user';
import moment from "moment";


export function MessageListItem(message: IMessage) {
    const time = moment.unix(message.timestamp / 1000)
    return (
        <article className='media'>
            <figure className='media-left'>
                <p className='image is-64x64'>
                    <img className='is-rounded' src={message.author.profileImageURL} />
                </p>
            </figure>
            <div className='media-content'>
                <div className='level'>
                    <div className='level-left'>
                        <div className='level-item'>
                            {`${message.author.firstName} ${message.author.lastName}`}
                        </div>
                    </div>
                    <div className='level-right'>
                        <div className='level-item'>
                            {time.fromNow()}
                        </div>
                    </div>
                </div>
                <p>{message.content}</p>
            </div>
        </article>
    )
}

export interface IMessage {
    content
    author: User
    timestamp
    type: 'text' | 'image' | 'attachment'
}