import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { API } from '../utils/API'
import { tools } from '../utils/tools'
import { toast } from 'react-toastify'
import socket from '../utils/socket'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { HiLink } from "react-icons/hi2";

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
    const [form, setForm] = useState({})
    const [mediaUpload, setMediaUpload] = useState(false)

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
            message: newMessage,
            chatId,
            receiver: receiver_id
        })

        setForm({ message_type: 'p', message_value: '' })
    }

    return (
        <form onSubmit={sendMessage} className="flex gap-2">
            <div>
                {
                    mediaUpload ?
                        <PopUpWindowForFileUpload
                            sender_id={sender_id}
                            receiver_id={receiver_id}
                            chatId={chatId}
                            addMessage={addMessage}
                            closeWindow={() => setMediaUpload(false)}
                        />
                        :
                        <HiLink size={30} onClick={() => setMediaUpload(true)} className='cursor-pointer' />
                }
            </div>
            <input
                type="text"
                value={form.message_value || ''}
                onChange={e => setForm({ message_type: 'p', message_value: e.target.value })}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-md border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button type="submit" className="px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                Send
            </button>
        </form>
    )
}


function PopUpWindowForFileUpload({ sender_id, receiver_id, chatId, addMessage, closeWindow }) {
    const [file, setFile] = useState({})

    async function uploadFile(e) {
        e.preventDefault()
        const selectedFile = e.target.files[0]
        if (!selectedFile) return toast.error("No file selected")

        const data = await tools.AWS_upload_file(selectedFile)
        if (!data.success) {
            return toast.error(data.error)
        }

        const fileMessage = {
            message_type: file.type === 'image' ? 'img' : file.type === 'video' ? 'video' : 'file',
            message_value: data.data.file_url,
            sent_time: new Date(),
            sent_by: sender_id,
            id: Date.now()
        }

        addMessage(fileMessage)

        socket.emit("send-message", {
            sender: sender_id,
            message: fileMessage,
            chatId,
            receiver: receiver_id
        })

        toast.success("File sent")
        closeWindow()
    }

    return (
        <form>
            {
                !file.type && (
                    <div className='flex gap-2'>
                        {[
                            { type: 'image', url: '/icons/image.png' },
                            { type: 'video', url: '/icons/video.png' },
                            { type: 'file', url: '/icons/doc.png' }
                        ].map(media => (
                            <img
                                key={media.type}
                                src={media.url}
                                alt={media.type}
                                className='w-8 h-8 rounded cursor-pointer'
                                onClick={() => setFile({ type: media.type })}
                            />
                        ))}
                    </div>
                )
            }

            {
                file.type && (
                    <div className='mt-2'>
                        <input type="file" onChange={uploadFile} className='bg-cyan-500 p-1 m-1 rounded-md w-fit' />
                        <button
                            type="button"
                            onClick={closeWindow}
                            className='ml-2 text-red-500 underline cursor-pointer'
                        >
                            Cancel
                        </button>
                    </div>
                )
            }
        </form>
    )
}


export default Messages