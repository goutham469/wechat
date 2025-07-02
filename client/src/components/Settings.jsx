import React, { useEffect, useState } from 'react'
import UserNotifications from './UserNotifications'
import Profile from './Profile'
import { Outlet, useNavigate } from 'react-router-dom';

function Settings()
{
  const navigate = useNavigate()
  return (
    <div className='m-2 p-2'>
      <div
        className='cursor-pointer m-2 p-2 bg-cyan-500 w-20 h-10 rounded-md'
        onClick={() => navigate('/')}
      >
        &lt; Back
      </div>

      <ProfileHeader />

      <Outlet/>
      
    </div>
  )
}

export default Settings;

function ProfileHeader()
{
  const navigate = useNavigate();

  return <header>
    {
      [
      'Profile',
      'Notifications'
    ]
    .map( key => <b className='bg-cyan-500 m-1 p-1 rounded-md cursor-pointer' onClick={ ()=>navigate(`./${key}`)  }>{key}</b> )
    }
  </header>
}