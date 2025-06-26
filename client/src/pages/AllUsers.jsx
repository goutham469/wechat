import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { API } from '../utils/API'
import { IoPersonCircleSharp } from "react-icons/io5";

function AllUsers() {
  const [users , setUsers] = useState([])

  function convert_time(time)
  {
    const ans = new Date(time)
    return ans.toLocaleString()
  }

  useEffect(()=>{
    async function load_users() {
      const result = await API.getAllUsers()
      setUsers(result.data.users)
    }
    load_users()
  },[])
  return (
    <div>
      <b>All Users</b>
      <table style={{border:"2px solid black",borderCollapse:"collapse"}}>
        <thead>
          <th style={{border:"1px solid black"}}>s.no</th>
          <th style={{border:"1px solid black"}}>profile_pic</th>
          <th style={{border:"1px solid black"}}>name</th>
          <th style={{border:"1px solid black"}}>email</th>
          <th style={{border:"1px solid black"}}>username</th>
          <th style={{border:"1px solid black"}}>password</th>
          <th style={{border:"1px solid black"}}>account_created_on</th>
          <th style={{border:"1px solid black"}}>last_login</th>
          <th style={{border:"1px solid black"}}>dob</th>
          <th style={{border:"1px solid black"}}>online_status</th>
        </thead>
        <tbody>
          {
            users.map( (user,idx) => <tr>
              <td style={{border:"1px solid black"}}>{idx+1}</td>
              <td style={{border:"1px solid black"}}>{ user.profile_pic ? <img src={user.profile_pic} width="40px" height="40px"/> : <IoPersonCircleSharp /> }</td>
              <td style={{border:"1px solid black"}}>{user.name}</td>
              <td style={{border:"1px solid black"}}>{user.email}</td>
              <td style={{border:"1px solid black"}}>{user.username}</td>
              <td style={{border:"1px solid black"}}>{user.password}</td>
              <td style={{border:"1px solid black"}}>{ convert_time(user.account_created_on) }</td>
              <td style={{border:"1px solid black"}}>{ convert_time(user.last_login) }</td>
              <td style={{border:"1px solid black"}}>{ user.dob ? convert_time(user.dob) : "Not Given" }</td>
              <td style={{border:"1px solid black"}}>{user.online_status}</td>
            </tr> )
          }
        </tbody>
      </table>
    </div>
  )
}

export default AllUsers