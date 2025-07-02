import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { API } from '../utils/API'
import { useDispatch, useSelector } from 'react-redux'
import { IoPersonCircleOutline } from "react-icons/io5";
import { chat_slice_setChat } from '../redux/slices/chatSlice'
import { setLocalState } from '../redux/setLocalState'
import { FaCircle } from 'react-icons/fa'
import socket from '../utils/socket'
import { message_slice_append_message, message_slice_setMessages } from '../redux/slices/messageSlice'

function ChatList() {
    const [ chats , setChats ] = useState([])
    const [ loading , setLoading ] = useState(false)
    const user = useSelector( state => state.user )
    const chat = useSelector( state => state.chat )
    const dispatch = useDispatch()

    async function getChats(){
        setLoading(true)
        const result = await API.getUserChats()
        setChats(result)

        setLoading(false)
    }


    useEffect(() => {
      const handleUpdate = (data) => {
        console.log("New socket message", data)
        
        // updating last_message in chat list
        setChats(prev =>
          prev.map(chat => {
            if (chat.chat_id === data.chatId) {
              return {
                ...chat,
                last_message: JSON.stringify( data.message ) ,
                new_messages_cnt: chat.new_messages_cnt ? chat.new_messages_cnt + 1 : 1
              };
            }
            return chat;
          })
        );

        // updating messages redux state , if the chat was open its messages will be updated
        if(chat.chat_id == data.chatId){
          // current messages is to be updated
          console.log(data)
          const payload = { 
            chatId:data.chatId , 
            message_type:data.message.message_type , 
            message_value:data.message.message_value , 
            read_by:null , 
            sent_by:data.sender , 
            sent_time:new Date()
           }
          dispatch( message_slice_append_message(payload) )
        }
      };

      socket.on("update", handleUpdate);

      return () => {
        socket.off("update", handleUpdate); // Clean up listener
      };
    }, []);

    useEffect(()=>{
        getChats()
    },[])

    if(loading){
      return <div className='flex flex-around justify-center'>
        <img src='/loading.gif' alt='loading'/>
      </div>
    }

  return (
    <div className='bg-cyan-600'>
      {
        ( chats && Array.isArray( chats )) && chats.map( chat => <ChatListCard chat={chat} key={chat.chat_id} /> )
      }
    </div>
  )
}

function ChatListCard( { chat , key } )
{
  const dispatch = useDispatch()
  async function openChat()
  {
    const params = new URLSearchParams();
    params.set("chat_id" , chat.chat_id)

    const messages = await API.getMessages( chat.chat_id , 0 )
    console.log(messages);

    dispatch( chat_slice_setChat(chat) )
    dispatch( message_slice_setMessages(messages) )

    setLocalState( "chat" , JSON.stringify(chat) )
    setLocalState("messages" , JSON.stringify(messages) )
  }
  return <div
            className="border-t border-black p-1 hover:bg-cyan-400 cursor-pointer bg-cyan-500"
            onClick={openChat}
            key={key}
          >
            
            <div className="flex items-center gap-2 mb-1">
              {
                chat.profile_pic ? (
                  <div className='flex flex-between'>
                    <img
                      src={chat.profile_pic}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {
                      chat.online_status && <FaCircle color='green' size={10} />
                    }
                  </div>
                ) : (
                  <IoPersonCircleOutline size={32} />
                )
              }

              <p className="text-md font-semibold">{chat.username}</p>
              {
                 chat.new_messages_cnt &&
                 <p style={{ backgroundColor:"green" , borderRadius:"50px" , color:"white",width:"20px",height:"20px",paddingLeft:"5px",fontSize:"14px" }} >{chat.new_messages_cnt}</p>
               }
            </div>

            <p className="text-sm truncate text-left pl-5">
              {chat.last_message ? JSON.parse(chat.last_message ).message_value : "No conversation yet."}
            </p>

          </div>
}

export default ChatList;