import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { API } from '../utils/API'
import { tools } from '../utils/tools'
import { toast } from 'react-toastify'
import socket from '../utils/socket'
import { IoPersonCircleOutline } from 'react-icons/io5'

function Messages() {
    const chat = useSelector(state => state.chat)
    const user = useSelector(state => state.user)
    const reduxMessages = useSelector(state => state.message)

    const [messages, setMessages] = useState([])
    const [page, setPage] = useState(0)

    const messagesEndRef = useRef(null)

    // Sync with Redux state
    useEffect(() => {
        if (reduxMessages && Array.isArray(reduxMessages)) {
            setMessages(reduxMessages)
        }
    }, [reduxMessages, chat])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Socket listeners
    useEffect(() => {
        socket.on('new-message', (newMessage) => {
            setMessages(prev => [...prev, newMessage])
        })

        socket.on('message-sent', (sentMessage) => {
            console.log('Message sent confirmation:', sentMessage)
        })

        return () => {
            socket.off('new-message')
            socket.off('message-sent')
        }
    }, [])

    function addMessage(form) {
        setMessages(prev => [...prev, form])
    }

    return (
        <div className="w-full h-[95vh] mx-auto bg-cyan-100 flex flex-col shadow-md overflow-hidden border-t-1 border-l-1">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 bg-cyan-500 text-white shadow">
                {
                    chat.profile_pic ?
                        <img src={chat.profile_pic} alt="profile" className="w-10 h-10 rounded-full" />
                        :
                        <IoPersonCircleOutline size={40} />
                }
                <p className="font-semibold">{chat.username || 'No Chat Selected'}</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-cyan-50">
                {
                    messages?.length === 0
                        ? <p className="text-center text-gray-600">Welcome</p>
                        : messages.map((message, index) =>
                            <Message
                                key={message.id || message.sent_time || index}
                                message={message}
                                user_id={user.id}
                            />
                        )
                }
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 bg-cyan-200">
                <Input
                    chatId={chat.chat_id}
                    sender_id={user.id}
                    addMessage={addMessage}
                    receiver_id={chat.receiver}
                />
            </div>
        </div>
    )
}

function Message({ message, user_id }) {
    const isOwn = message.sent_by === user_id

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xs bg-cyan-300 p-2 rounded-lg shadow-sm">
                {
                    message.message_type === 'p' ? (
                        <p className="text-sm">{message.message_value}</p>
                    ) : message.message_type === 'img' ? (
                        <img src={message.message_value} alt="img" className="max-w-full rounded" />
                    ) : message.message_type === 'video' ? (
                        <video src={message.message_value} controls muted className="w-full rounded" />
                    ) : (
                        <a href={message.message_value} className="text-blue-700 underline">FILE</a>
                    )
                }
                <p className="text-[10px] text-right text-cyan-800 mt-1">
                    {tools.convertUTCtoLocalTime(message.sent_time).substring(11)}
                </p>
            </div>
        </div>
    )
}

function Input({ chatId, sender_id, addMessage, receiver_id }) {
    const [form, setForm] = useState({ message_type: 'p', message_value: '' })

    async function sendMessage(e) {
        e.preventDefault()
        if (!form.message_value?.trim()) return

        const newMessage = {
            ...form,
            sent_time: new Date(),
            sent_by: sender_id,
            id: Date.now()
        }

        addMessage(newMessage)

        socket.emit("send-message", {
            sender: sender_id,
            message: form,
            chatId,
            receiver: receiver_id
        })

        setForm({ message_type: 'p', message_value: '' })
    }

    return (
        <form onSubmit={sendMessage} className="flex gap-2">
            
            <input
                type="text"
                value={form.message_value}
                onChange={e => setForm({ ...form, message_value: e.target.value })}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-md border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button type="submit" className="px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                Send
            </button>
        </form>
    )
}

export default Messages