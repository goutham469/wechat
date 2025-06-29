import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { API } from '../utils/API'
import { IoPersonCircleSharp } from "react-icons/io5";

function AllUsers() {
  const [users , setUsers] = useState([])

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
          <th style={{border:"1px solid black"}}>Message</th>
          <th style={{border:"1px solid black"}}>profile_pic</th>
          <th style={{border:"1px solid black"}}>name</th>
          <th style={{border:"1px solid black"}}>email</th>
          <th style={{border:"1px solid black"}}>username</th>
          <th style={{border:"1px solid black"}}>password</th>
          <th style={{border:"1px solid black"}}>account_created_on</th>
          <th style={{border:"1px solid black"}}>last_login</th>
          <th style={{border:"1px solid black"}}>dob</th>
          <th style={{border:"1px solid black"}}>online_status</th>
          <th style={{border:"1px solid black"}}>SNS</th>
        </thead>
        <tbody>
          {
            users.map( (user,idx) => <User user={user} idx={idx} /> )
          }
        </tbody>
      </table>
    </div>
  )
}

function User( { user , idx } )
{
  const [ isFormOpen , setIsFormOpen ] = useState(false);
  const [ message , setMessage ] = useState()

   function convert_time(time)
  {
    const ans = new Date(time)
    return ans.toLocaleString()
  }

  async function sendMessage(){
    await API.admin_send_message( message , user.id )
    setIsFormOpen(false)
  }

  return  <tr>
              <td style={{border:"1px solid black"}}>{idx+1}</td>
              <td style={{border:"1px solid black"}}>
                {
                  isFormOpen ?
                  <form>
                    <textarea
                      width="100px"
                      height="100px"
                      onChange={ e => setMessage(e.target.value) }
                      className='bg-cyan-300 p-2 rounded-lg'
                    />
                    <button
                      className='m-1 p-1 bg-cyan-500 rounded-md cursor-pointer'
                      onClick={sendMessage}
                    >Submit</button>
                  </form>
                  :
                  <button
                   className='m-1 p-1 bg-cyan-500 rounded-md cursor-pointer'
                   onClick={ e => setIsFormOpen(true) }
                   >Message</button>
                }
              </td>
              <td style={{border:"1px solid black"}}>{ user.profile_pic ? <img src={user.profile_pic} width="40px" height="40px"/> : <IoPersonCircleSharp /> }</td>
              <td style={{border:"1px solid black"}}>{user.name}</td>
              <td style={{border:"1px solid black"}}>{user.email}</td>
              <td style={{border:"1px solid black"}}>{user.username}</td>
              <td style={{border:"1px solid black"}}>{user.password}</td>
              <td style={{border:"1px solid black"}}>{ convert_time(user.account_created_on) }</td>
              <td style={{border:"1px solid black"}}>{ convert_time(user.last_login) }</td>
              <td style={{border:"1px solid black"}}>{ user.dob ? convert_time(user.dob) : "Not Given" }</td>
              <td style={{border:"1px solid black"}}>{user.online_status}</td>
              <td style={{border:"1px solid black"}}>
                <pre>
                  {
                    JSON.parse( user.sns_subscriptions )?.map( sub => <p>{sub.endpoint}</p> )
                  }
                </pre>
              </td>
            </tr>
}

export default AllUsers