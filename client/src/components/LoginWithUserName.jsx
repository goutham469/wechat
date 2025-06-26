import React, { useState } from 'react'
import { API } from '../utils/API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { user_slice_login } from '../redux/slices/userSlice';
import { setLocalState } from '../redux/setLocalState';

function LoginWithUserName() {
    const [form , setForm] = useState({})
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleChange = (e) => {
         setForm({ ...form , [e.target.name]:e.target.value })
    }

    async function login(e) {
        e.preventDefault();
        
        console.log(form)
        const response = await API.login_with_username(form);
        if(response.success){
            console.log(response)
            // update redux data
            const { data } = response; 
            
            dispatch( user_slice_login( data.user ) )
            if( setLocalState( "user" , JSON.stringify( data.user ) ) != "success" ){
                toast.error("Authentication failed")
            }else{
                navigate("/")
                toast.success("Login success");
            }
        }else{
            toast.error("A problem occured")
            console.log(response.error)
            API.report_error(response.error)
        }
    }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-200">
  <form
    onSubmit={login}
    className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-1"
  >
    <h2 className="text-2xl font-bold text-center text-cyan-700 mb-2">Login</h2>

    <input
      placeholder="Username"
      name="username"
      onChange={handleChange}
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />

    <input
      placeholder="Password"
      type="password"
      name="password"
      onChange={handleChange}
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />

    <button
      type="submit"
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition duration-200"
    >
      Login
    </button>
  </form>
</div>

  )
}

export default LoginWithUserName; 