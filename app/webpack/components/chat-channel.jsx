import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

/*
const cable = ActionCable.createConsumer('ws://localhost:3000/cable')

export default function ChatRoom (props) {
    return (
        <ActionCableProvider cable={cable}>
        </ActionCableProvider>
    )
}*/


class ChatRoom extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            messages: []
        };
    }


    onReceived (message) {
        this.setState({
            messages: [
                ...this.state.messages,
                message
            ]
        })
    }

    sendMessage = () => {
        const message = this.refs.newMessage.value
        // Call perform or send
        this.refs.roomChannel.perform('sendMessage', {message})
    }

    render () {
        return (
            <div>

                <ul>
                    {this.state.messages.map((message) =>
                        <li key={message.id}>{message.body}</li>
                    )}
                </ul>
                <input ref='newMessage' type='text' />

                <button onClick={this.sendMessage}>Send</button>
            </div>
        )
    }
}

function run() {
    const domNode = document.getElementById('chat_room');
    if(domNode !== undefined){
        ReactDOM.render(
            React.createElement(ChatRoom),
            domNode
        );
    }
}

const loadedStates = [
    'complete',
    'loaded',
    'interactive'
];
if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}