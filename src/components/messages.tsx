import moment from "moment";
import React, { createContext, HTMLAttributes, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { CgMoreAlt } from 'react-icons/cg';
import { FaComments, FaSearch } from 'react-icons/fa';
import { NavLink, Route } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { APPLICATION_CONTEXT } from "../lib";
import links from "../lib/links";
import { IChatItem, IMessage, Message } from "../lib/message";
import { User } from '../lib/user';
import { Empty } from "./util";
import { useDebouncedCallback } from "use-debounce";

export const ChatContext = createContext<{ chats: IChatItem[], setChats: (messages: IChatItem[]) => any }>({ chats: [], setChats: (chats) => { } })

export const ChatListProvider = (props) => {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [chats, setChats] = useState<IChatItem[]>([])

    const triggerListener = useCallback(() => {
        const unsubscribe = Message.listenForChats(ctx, async (err, docs) => {
            if (err) {
                console.log(err)
                return
            }
            if (!docs) {
                return
            }
            const parsedChats: IChatItem[] = await Promise.all(await docs.map(async (doc) => {
                const parsed: any = doc.data({ serverTimestamps: 'estimate' })
                const old = chats.find(chat => chat?.id === doc.id)
                parsed.id = doc.id
                try {
                    parsed.users = await Promise.all(await parsed.users.map(async (user: string) => {
                        if (user === ctx.user!.id) {
                            return ctx.user
                        } else if (old) {
                            const existing = old.users.find((existing: User) => existing.id === user)
                            if (existing) {
                                parsed.recipient = existing
                                return existing
                            } else {
                                const recipient = await User.getExternalUser(ctx, user)
                                parsed.recipient = recipient
                                return recipient
                            }
                        }
                        const recipient = await User.getExternalUser(ctx, user)
                        parsed.recipient = recipient
                        return recipient
                    }))
                    parsed.last_message = { ...parsed.last_message, createdAt: parsed.last_message?.createdAt.toDate() }
                    return parsed
                } catch (e) {
                    console.log('Failed to get user data', e)
                }
            }))

            setChats(parsedChats)
        })

        return () => unsubscribe()
    }, [chats, ctx])

    useEffect(triggerListener, [])


    return (
        <ChatContext.Provider value={{ chats, setChats }}>
            {props.children}
        </ChatContext.Provider>
    )
}

export function MessageListItem({ chat, to }: { chat: IChatItem, to: any }) {
    const time = moment(chat.last_message!.createdAt)

    return (
        <NavLink activeClassName="is-active" to={to} className={`job-item message-iitem mb-8 py-2 is-block card is-shadowless has-background-white-ter`}>
            <div className='card-content'>
                <div className='container is-paddingless'>
                    <div className='columns '>
                        <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                            <figure className='image is-flex is-48x48'>
                                <img className='is-rounded' src={chat.recipient.profilePhoto} />
                            </figure>
                        </div>
                        <div className='column'>
                            <div className='columns mb-0 is-mobile name-bar'>
                                <div className='has-text-left column has-text-weight-bold'>
                                    <p>{`${chat.recipient.firstName} ${chat.recipient.lastName}`}</p>
                                </div>
                                <div className='has-text-right is-3-mobile column'>
                                    <p>{time.calendar({ sameElse: 'DD/MMM/YYYY' })}</p>
                                </div>
                            </div>
                            <div className='content has-text-left'>
                                <p>{chat.last_message!.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export function MessageItem({ message, isCurrentUser, prevMessage, ...props }: { isCurrentUser: boolean, message: IMessage, prevMessage?: IMessage } & HTMLAttributes<HTMLDivElement>) {
    const diffDay = Message.isDifferentDay(message, prevMessage)
    return (
        <>
            {!!diffDay && <p className='is-size-8 my-4 has-text-grey-light'>{diffDay.calendar({ sameElse: 'DD/MMM/YYYY' })}</p>}
            <div {...props} style={{ flexGrow: 0, ...props.style }} className={`container my-1 ${props.className} ${isCurrentUser ? 'mr-0' : 'ml-0'}`}>
                <div className={`columns my-0 mx-0 is-vcentered ${isCurrentUser ? 'is-flex-direction-row-reverse' : ''}`}>
                    <div className='column is-paddingless is-narrow is-flex' style={{ justifyContent: 'center' }}>
                        <div className='column is-narrow is-flex' style={{ justifyContent: 'center' }}>
                            <figure className='image is-32x32 is-flex'>
                                <img className='is-rounded' src={message.user.profileImageURL} />
                            </figure>
                        </div>
                        <div className='column is-size-7'>
                            <span>{message.user.firstName} {message.user.lastName}</span>
                        </div>
                    </div>
                </div>
                <article style={{ borderRadius: '2em', border: isCurrentUser ? 'solid #dadada88 1px' : 0 }} className={`content px-4 py-2 ${isCurrentUser ? 'has-background-white has-text-black' : 'has-background-link has-text-white'}`}>
                    <p>{message.text}</p>
                </article>
            </div>
        </>
    )
}

export function MessageList({ onNewChat = () => { }, onOptionsClick = () => { }, className = '' }) {
    const { chats } = useContext(ChatContext)
    const [searchedChat, setSearchedChat] = useState<IChatItem[] | null>(null)
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const triggerSearch = useCallback(async (search) => {
        setIsLoading(true)
        try {
            if (chats.length < 1) {
                throw new Error('There is no chat to search')
            }
            if (!search) {
                setSearchedChat(null)
            }
            const regexp = new RegExp(search, 'i')

            const results = chats.filter((chat: IChatItem) => {
                return (chat.last_message ? chat.last_message.text.search(regexp) >= 0 : false) || chat.recipient.firstName?.search(regexp) >= 0 || chat.recipient.lastName?.search(regexp) >= 0
            })
            console.log(results)
            setSearchedChat(results)
            setIsLoading(false)
        } catch (e) {
            console.log(e)
            setSearchedChat([])
            setIsLoading(false)
        }
    }, [chats])

    const search = useDebouncedCallback(((e?: any) => {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }

        const search = searchText.trim()
        if (!search) {
            setSearchedChat(null)
        }
        if (search) {
            triggerSearch(search)
        }
    }), 800)

    useEffect(() => {
        search()
    }, [searchText])

    return (
        <div className={`${className} panel job-panel has-background-white-ter is-flex is-size-7`}>
            <div className='panel-heading is-flex is-vcentered pb-4'>
                <p className='has-text-left is-size-6'>Recent Messages</p>
                <div className='field is-grouped is-grouped-right'>
                    <p className='control'>
                        <button className='button is-rounded is-small' onClick={onNewChat}>
                            <span className='icon'>
                                <BsPencilSquare />
                            </span>
                        </button>
                    </p>
                    <p className='control'>
                        <button className='button is-rounded is-small' onClick={onOptionsClick}>
                            <span className='icon'>
                                <CgMoreAlt />
                            </span>
                        </button>
                    </p>
                </div>
            </div>
            <div className='panel-block'>
                <div className='field has-addons' style={{ flex: 1 }}>
                    <form onSubmit={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        search()
                    }} className='control is-expanded has-icons-left'>
                        <input value={searchText} onChange={e => setSearchText(e.target.value)} style={{ borderRight: 0 }} className='input is-rounded' type='search' placeholder='Search Messages...' />
                        <span className='icon is-left'><FaSearch /></span>
                    </form>
                    {/* <div className='control'>
                        <button style={{ borderLeft: 0 }} className='button is-rounded' onClick={() => window.alert("not ready yet")}>
                            <span className='icon is-right'><GoSettings /></span>
                        </button>
                    </div> */}
                </div>
            </div>
            <div className='has-background-white-ter' style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <Route path={`${links.messages}`} render={() => {
                    if (isLoading) {
                        return <div key='meassages-loader' className='px-6 my-6 is-flex'><progress style={{ height: '0.4rem' }} className="progress is-small my-6" max="100">loading</progress></div>
                    } else if (searchText && searchedChat && searchedChat.length < 1) {
                        return <Empty key='messages-search-empty' className='my-6' style={{ backgroundColor: 'transparent' }} text={'Search did not return any chat'} />
                    } else if (chats.length < 1) {
                        return <Empty key='messages-empty' className='my-6' style={{ backgroundColor: 'transparent' }} text={'No chat started yet!'} />
                    } else {
                        return (searchText && searchedChat ? searchedChat : chats).map(m => <MessageListItem key={m.id} chat={m} to={`${links.messages}/${m.id}`} />)
                    }
                }} />
            </div>
        </div>
    )
}

export function MessageDetail({ chat, className }: { chat?: IChatItem, className?: string }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)
    const { addToast } = useToasts()
    const sectionRef = useRef<HTMLElement>(null)

    const sendMessage = useCallback(async () => {
        setSending(true)
        try {
            const message = text.trim()
            if (!message) {
                throw new Error('Cannot send empty message!')
            }
            if (!chat || !ctx.user) {
                throw new Error('No chat thread available!')
            }
            await Message.sendMessage(ctx, chat, {
                text: message,
                type: 'text',
                user: ctx.user,
            })
            setText('')
        } catch (e) {
            console.log(e)
            addToast(e.message || 'Failed to send message', {
                appearance: 'error'
            })
        } finally {
            setSending(false)
        }
    }, [text])

    useEffect(() => {
        if (chat && chat.initialized) {
            const unsubscribe = Message.listenForChatMessages(ctx, chat, (err, messages) => {
                if (err) {
                    console.log(err)
                } else if (messages) {
                    setMessages(messages)
                }
            })
            return () => { unsubscribe() }
        }
    }, [chat?.recipient, chat?.initialized])

    useEffect(() => {
        if (sectionRef.current) {
            const el = sectionRef.current
            if (el.scrollHeight > el.clientHeight && el.scrollTop < (el.scrollHeight - el.clientHeight)) {
                if (sectionRef.current.scroll) {
                    sectionRef.current.scroll(0, el.scrollHeight - el.clientHeight)
                } else {
                    sectionRef.current.scrollTop = el.scrollHeight - el.clientHeight
                }
            }
        }
    }, [chat?.recipient, messages.length])

    if (!chat) {
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
        <div className={`${className} card job-detail is-fullheight is-flex-direction-column`} style={{ zIndex: 1 }}>
            <div className='card-content is-paddingless is-atleast-fullheight'>
                <div className='level py-4 mb-0 is-mobile' style={{ zIndex: 2 }}>
                    <div className='level-item is-size-7'></div>
                    <div className='level-item is-size-5 has-text-weight-bold'>{`${chat.recipient.firstName} ${chat.recipient.lastName}`}</div>
                    <div className='level-item is-size-7 pr-4' style={{ justifyContent: 'flex-end' }}>
                        <button className='button is-rounded is-small'><CgMoreAlt /></button>
                    </div>
                </div>
                <div className='container is-fluid px-0 is-clipped' style={{ position: 'relative', paddingBottom: '6em' }}>
                    <section ref={sectionRef} style={{ overflowY: 'auto' }} className='section is-flex pt-1 pb-0 is-fullheight is-flex-direction-column'>
                        {(chat.initialized === false || messages.length < 1) && (
                            <div className={`is-flex`} style={{ flexDirection: 'column' }}>
                                <div className='card-content is-paddingless is-flex-centered has-text-grey my-6'>
                                    <span className='my-4' ><FaComments fill='#811' style={{ height: "8rem", width: "8rem" }} /></span>
                                    <p className='is-uppercase is-size-6 has-text-weight-bold'>Send your first chat to `{chat.recipient.firstName} {chat.recipient.lastName}`</p>
                                </div>
                            </div>
                        )}
                        {messages.map((message, i) => <MessageItem isCurrentUser={message.user.id === ctx.user?.id} message={message} prevMessage={messages[i - 1]} key={message._id} />)}
                    </section>
                    <div className='columns is-mobile is-fullheight mx-0 my-0' style={{
                        position: 'relative', left: 0, right: 0,
                        bottom: 0, height: '6em',
                        borderTop: 'solid #dadada88 1px',
                    }}>
                        <div className='column is-9 is-mobile'>
                            <div className={`control ${sending && 'is-loading'}`}>
                                <textarea onChange={(e) => setText(e.target.value)} value={text} style={{ border: 0, height: '100%', minHeight: 'unset' }} className='textarea has-fixed-size' placeholder='Type a message...'></textarea>
                            </div>
                        </div>
                        <div className='column columns is-centered mx-0 my-0 is-3 is-mobile is-flex'>
                            <div className='buttons'>
                                <button className='button is-success is-rounded' disabled={!text || sending} onClick={sendMessage}>SEND</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}