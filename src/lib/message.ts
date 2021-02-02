import React from "react";

export class Message {
    content
    sender

    isSameUser(message: Message) {
        return message.sender === this.sender
    }


    isSameDay(){
        
    }
}
