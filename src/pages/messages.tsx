import React from 'react';
import { DUMMY_MESSAGES, MessageDetail, MessageList } from '../components/messages';
import { DUMMY_USER } from '../lib/user';

export function Messages() {
    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <MessageList onCreateNew={() => { }} className='column is-3 is-12-touch is-clipped is-fullheight' />
            <MessageDetail message={DUMMY_MESSAGES} contact={DUMMY_USER} className='column is-9 is-12-touch is-flex' />
        </div>
    )
}