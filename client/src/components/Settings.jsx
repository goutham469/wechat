import React, { use, useEffect } from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { MdEdit } from "react-icons/md";
import { useSelector } from 'react-redux'
import { tools } from '../utils/tools';
import { API } from '../utils/API';
import { toast } from 'react-toastify';

function Settings() {
  const user = useSelector( state => state.user )
  const [ form , setForm ] = React.useState({})
  const [ loading , setLoading ] = React.useState(false)

  useEffect(()=>{
    if(!user.id){
      toast.error("Authentication error...")
      window.location.href = "/login";
    }
  },[])


  async function update(){
    setLoading(true);
    const result = await API.update_profile( user.id , form )

    if(result.success){
      toast.success("updated")
    }else{
      toast.error(result.error)
    }
    setLoading(false)
  }

  function handleEdit(e){
    console.log("feature not available yet !");
    e.target.name
  }


  if(loading){
    return <img src='/loading.gif' alt='Loading' />
  }

  return (
    <div className='m-5 p-5 flex flex-around'>
      <div className='cursor-pointer m-2 p-2 bg-cyan-500 w-20 h-10 rounded-md' onClick={()=>window.location.href="/"}>
        &lt;Back
      </div>
      <br/>
      <b>Settings</b>
      <div>
        {
          user.profile_pic ? <img src={user.profile_pic} className='w-40 h-40 rounded-full' /> : <IoPersonCircle size={100} />
        }
        {
          !form.profile_pic_update ? <MdEdit
                                size={30}
                                name='profile_pic'
                                onClick={()=>setForm({ ...form , profile_pic_update:true })}
                                /> 
                                  :
                                  <form>
                                    <input
                                      name='profile_pic url'
                                      type='text'
                                      onChange={ e => setForm({...form , profile_pic:e.target.value }) }
                                    />
                                    <button
                                      onClick={update}
                                    >Update</button>
                                  </form>
        }
      </div>

      <div>
        Name : 
        {
          <p>{user.name}</p>
        }
        <MdEdit
         size={30}
         name='name'
         onClick={handleEdit}
        />
      </div>

      <div>
        Born on : 
        {
          <p>{ user.dob ? user.dob : "Not set by you"}</p>
        }
        <MdEdit
         size={30}
         name='dob'
         onClick={handleEdit}
        />
      </div>

      <div>
        username
        {
          <p>{user.username}</p>
        }
        <MdEdit
         size={30}
         name='name'
         onClick={handleEdit}
        />
      </div>

      <div>
        email :
        {
          <p>{user.email}</p>
        }
        <MdEdit
         size={30}
         name='name'
         onClick={handleEdit}
        />
      </div>

      <div>
        A/c created on :
        {
          <p>{ tools.convertUTCtoLocalTime( user.account_created_on ) }</p>
        }
        <MdEdit
         size={30}
         name='name'
         onClick={handleEdit}
        />
      </div>

      <button 
       onClick={()=>{
        localStorage.clear();
        window.location.reload();
       }}
       className='cursor-pointer m-2 p-2 bg-cyan-500 w-20 h-10 rounded-md'
      >Log Out</button>

    </div> 
  )
}

export default Settings