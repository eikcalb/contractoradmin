import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ChatContext, MessageDetail, MessageList } from '../components/messages';
import { APPLICATION_CONTEXT } from '../lib';
import { IChatItem } from '../lib/message';

export function Messages() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const { chats } = useContext(ChatContext)
    const [chat, setChat] = useState<IChatItem | undefined>(undefined)
    const location = useLocation()

    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const chat = chats.find(chat => chat.id === id)
            if (chat) {
                setChat(chat)
            } else {
                // Check if chat object was passed in order to initialize a chat, the ID in this scenario should be `new`
                const { chat } = location.state as { chat: IChatItem } || { chat: null }
                if (chat) {
                    // TODO: always check database if the chat thread has already been created
                    setChat(chat)
                } else {
                    setChat(undefined)
                }
            }
        } else {
            setChat(undefined)
        }
    }, [location, chats])

    return (
        <div className='columns is-gapless px-4 py-4 is-fullheight is-multiline'>
            <MessageList onNewChat={() => { }} className='column is-4 is-12-mobile is-clipped is-fullheight' />
            <MessageDetail chat={chat} className='column is-6 is-12-mobile is-flex' />
        </div>
    )
}