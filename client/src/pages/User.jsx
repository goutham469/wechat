import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Search from '../components/Search'
import ChatList from '../components/ChatList'
import Messages from '../components/Messages'
import socket from '../utils/socket'
import { IoIosSettings } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import { registerServiceWorker, requestNotificationPermission, subscribeToPush } from '../utils/pushNotification'

function User() {
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
  if (user?.id) {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("add-user", user.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection failed:", err.message);
    });
  }

  return () => {
    socket.disconnect();
  };
}, [user?.id]);


  useEffect(() => {
    if (!isLoading) {
      if (!user.id) {
        toast.warning("You are not logged in...")
        navigate("/login")
      }
    }
  }, [user, isLoading, navigate])

  useEffect(()=>{
    const setupPushNotifications = async () => {
      await registerServiceWorker();

      const permissionGranted = await requestNotificationPermission();

      try{
        if(permissionGranted){
          await subscribeToPush( user.id )
        }
      }catch(err){
        console.log(`Error registering notifications => error : ${err.message}`)
      }
    }

    setupPushNotifications()
  },[])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <img src='/loading.gif' alt='loading' className="w-16 h-16" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col">

      <div className="flex items-center justify-between bg-cyan-500 h-[5vh] px-4 text-white">
        <IoIosSettings size={24} className="cursor-pointer" onClick={() => navigate("/settings")} />
        <p className="text-lg font-semibold">We Chat</p>
        <FaSearch size={20} className="cursor-pointer" onClick={() => navigate("/search")} />
      </div>

     
      <div className="flex flex-1 bg-cyan-400 overflow-hidden">
        <div className="w-1/3 border-r border-cyan-600 overflow-y-auto">
          <ChatList />
        </div>
        <div className="flex-1 overflow-hidden">
          <Messages />
        </div>
      </div>

    </div>
  )
}

export default User