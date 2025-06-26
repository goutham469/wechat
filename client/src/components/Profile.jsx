import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { API } from '../utils/API';

function Profile( { user } ) {
    
  return (
    <div>
        <pre>
            {
                ( user && Object.keys(user).length > 0 ) ? JSON.stringify(user) : "You are not logged in ..."
            }
        </pre>
        <button className='bg-cyan-500 p-3 m-2 rounded-md cursor-pointer'  onClick={API.LogOut}  >Log out</button>
    </div>
  ) 
}

export default Profile;