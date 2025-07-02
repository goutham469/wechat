import React, { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API } from '../utils/API';
import { IoLogOut } from "react-icons/io5";
import { IoPersonCircle } from 'react-icons/io5'
import { MdEdit } from "react-icons/md"
import { tools } from '../utils/tools'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { user_slice_login } from '../redux/slices/userSlice';

function Profile( ) {

  const user = useSelector(state => state.user)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user?.id)
    {
      toast.error("Authentication error...")
      navigate("/login")
    }
    else
    {
      // populate initial form
      setForm({
        name: user.name || '',
        dob: user.dob || '',
        username: user.username || '',
        profile_pic: user.profile_pic || '',
        password:user.password || ''
      })
    }
  }, [ user ])

  async function getUserData(){
    const userDetails = await API.login_with_Google_OAUTH( user.email )
    dispatch( user_slice_login( userDetails.data.user ) )
  }

  useEffect(()=>{
    getUserData()
  },[])

  async function update()
  {
    setLoading(true)
    const result = await API.update_profile(user.id, form)

    if (result.success)
    {
      toast.success("Updated successfully")
    }
    else
    {
      toast.error(result.error)
    }

    setLoading(false)
  }

  async function handleImageUpload(e)
  {
    setLoading(true)

    const file = e.target.files[0]
    if (!file)
    {
      toast.warning("No file chosen")
      setLoading(false)
      return
    }

    const result = await tools.AWS_upload_file(file)
    console.log(result)

    if (!result.success)
    {
      toast.error(result.error)
    }
    else
    {
      setForm(prev =>
      {
        const updatedForm = { ...prev, profile_pic: result.data.file_url }
        update()
        return updatedForm
      })
    }

    setLoading(false)
  }

  function handleFormChange(key, value)
  {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (loading)
  {
    return <img src='/loading.gif' alt='Loading...' className='w-32 h-32 flex flex-between justify-around' />
  }
    
  return (
    <div>

      <div 
          onClick={() =>
          {
            localStorage.clear()
            window.location.reload()
          }}
          className='cursor-pointer m-2 p-2 bg-red-500 w-20 h-10 rounded-md flex flex-around w-30 text-cyan-100'
      >
        <IoLogOut size={30} />
        <button className='cursor-pointer'>
            Log Out
        </button>
      </div>


      <div 
          className='bg-cyan-500 m-1 p-2 rounded-md w-fit' >
        <div>
          {
            form.profile_pic
              ? <img
                  src={form.profile_pic}
                  className='w-40 h-40 rounded-full cursor-pointer'
                  onClick={(e) =>
                  {
                    e.preventDefault()
                    handleFormChange('profile_pic_update', true)
                  }}
                />
              : <IoPersonCircle
                  size={100}
                  onClick={(e) =>
                  {
                    e.preventDefault()
                    handleFormChange('profile_pic_update', true)
                  }}
                />
          }
          {
            form.profile_pic_update &&
            <form className='bg-cyan-500 p-2 m-2'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='bg-cyan-400 rounded-md p-1 m-1 cursor-pointer'
              />
              <button
                type='button'
                onClick={(e) =>
                {
                  e.preventDefault()
                  update()
                }}
                className='bg-cyan-600 text-white rounded-md p-1 m-1'
              >
                Update
              </button>
            </form>
          }
          <p>Click the Image to update</p>
        </div>

        

        <form
          onSubmit={(e) => e.preventDefault()}
        >
          {
            ['name', 'dob', 'username' , 'password' ].map(key => (
              <div key={key} className='m-1'>
                <label>{key}</label>
                <input
                  type={ key == 'dob' ? 'date' : 'text' }
                  placeholder={key}
                  value={form[key] || ''}
                  className='p-1 m-1 bg-cyan-600'
                  onChange={e => handleFormChange(key, e.target.value)}
                />
              </div>
            ))
          }

          {
            (user.name !== form.name || user.dob !== form.dob || user.username !== form.username || user.password !== form.password)
              ? <button
                  type='button'
                  className='bg-cyan-600 rounded-md p-1 m-1 cursor-pointer text-white'
                  onClick={update}
                >
                  Update Changes
                </button>
              : <button type='button' className='p-1 m-1 text-gray-700'>No Update to change</button>
          }
        </form>

        <div>
          A/c created on:
          <p>{tools.convertUTCtoLocalTime(user.account_created_on)}</p>
        </div>
      </div>


    </div>
  )
}

export default Profile;