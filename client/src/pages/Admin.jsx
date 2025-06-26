import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const sidebar = [ 
  {
    "id": 1,
    "name": "All Users",
    "icon": "FaUsers",
    "url": "./all-users",
  },
  {
    "id": 2,
    "name": "SQL EDITOR",
    "icon": "",
    "url": "./sql-editor",
  },
  {
    "id":3,
    "name":"logs",
    "icon":"",
    "url":"./logs"
  }
 ]

function Admin() {
  return (
    <div className='flex flex-between'>
      <Sidebar  data={sidebar} />
      <Outlet/>
    </div>
  )
}

export default Admin