import firebase from 'firebase';
import moment from 'moment';
import { Application } from ".";
import { firestore } from "./firebase";
import { User } from "./user";

export interface IChatItem {
    last_message?: {
        text: string
        createdAt: Date
        read: false
        /**
         * userID of the user who sent the last message to this chat thread
         */
        user: string
    }
    initialized: boolean
    users: User[]
    id: string

    recipient: User

}


export interface IMessage {
    type: 'text' | 'image' | 'attachment'
    _id: string | number
    text: string
    createdAt: any
    user: User
    image?: string
    video?: string
    audio?: string
    system?: boolean
    sent?: boolean
    received?: boolean
    pending?: boolean
}

const db = firestore.collection('chats')

export class Message {
    content
    sender

    isSameUser(message: Message) {
        return message.sender === this.sender
    }


    static isDifferentDay(message: IMessage, old?: IMessage) {
        if (!old) {
            return moment(message.createdAt)
        }
        const time1 = moment(message.createdAt)
        const time2 = moment(old.createdAt)

        if (time1.day() === time2.day()) {
            return false
        }

        return time1
    }

    static generateID(a: string, b: string) {
        return a > b ? a + b : b + a
    }

    static serialize(data: Partial<IMessage>) {
        return {
            ...data, user: {
                _id: data?.user?.id || null,
                avatar: data?.user?.profilePhoto || null,
                name: `${data.user?.firstName} ${data.user?.lastName}`
            }
        }
    }

    static async sendMessage(app: Application, chat: IChatItem, message: Partial<IMessage>) {
        if (!message) {
            throw new Error('Cannot send empty message!')
        }
        let chatItem: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
        if (!chat.initialized) {
            // initialize chat
            const id = Message.generateID(app.user?.id, chat.recipient.id)
            chatItem = db.doc(id)
        } else {
            chatItem = db.doc(chat.id)
        }
        const newMessage = chatItem.collection('messages').doc()
        message._id = newMessage.id
        message.createdAt = firebase.firestore.FieldValue.serverTimestamp()
        await firestore.runTransaction(async (txn) => {
            await txn.set(chatItem, { id: chatItem.id, users: [app.user!.id, chat.recipient.id], initialized: true, last_message: { text: message.text, createdAt: message.createdAt, read: false, user: app.user?.id } }, { merge: true })
            await txn.set(newMessage, Message.serialize(message))
        })
    }

    static listenForChats(app: Application, callback: (err?: Error | null, data?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] | null) => any) {
        let query = db
        .where("users", 'array-contains', app.user!.id)
        .where('initialized', '==', true)
        .orderBy("last_message.createdAt", 'desc')
        const unsubscribe = query.onSnapshot(async snap => {
            const chats: any[] = [];
            snap.forEach(doc => {
                chats.push(doc)
            })
            callback(null, chats)
        }, err => callback(err, null))

        return unsubscribe
    }

    static listenForChatMessages(app: Application, chat: IChatItem, callback, limit = 50) {
        let query = db.doc(chat.id)
            .collection('messages')
            .orderBy("createdAt", 'desc')
        const unsubscribe = query.limit(limit).onSnapshot(async snap => {
            const messages: IMessage[] = [];
            snap.forEach(doc => {
                const item: any = doc.data()
                item.id = doc.id
                if (item.user._id === app.user?.id) {
                    item.user = app.user
                } else {
                    item.user = chat.recipient
                }
                item.createdAt = item.createdAt.toDate()
                messages.unshift(item)
            })
            callback(null, messages)
        }, err => callback(err, null))

        return unsubscribe
    }
}
