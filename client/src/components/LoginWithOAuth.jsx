import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import React, { useState } from 'react'
import { API } from '../utils/API';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { user_slice_login } from '../redux/slices/userSlice';
import { setLocalState } from '../redux/setLocalState';

const { VITE_GOOGLE_OAUTH_CLIENT_ID } = import.meta.env;

function LoginWithOAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loading , setLoading] = useState(false)

    async function onSuccess(response)
    { 
        const credential = response.credential;
        const { email } = jwtDecode(credential);

        const response2 = await API.login_with_Google_OAUTH(email);
        if(response2.success){
        // update redux data
          console.log(response2)
          setLoading(true)
          // update redux data
          const { data } = response2;
          
          
          if( setLocalState( "user" , JSON.stringify( data.user ) ) != "success" ){
              toast.error("Authentication failed")
              
          }else{
            dispatch( user_slice_login( data.user ) )
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
    <div className='bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg rounded-xl p-6 m-4 max-w-md mx-auto text-cyan-50'>
      <b>Continue to login with Google</b>
      <p>click the button below to proceed...</p>
        <GoogleOAuthProvider clientId={ VITE_GOOGLE_OAUTH_CLIENT_ID } >
            <GoogleLogin
              onSuccess={onSuccess}
            />
          </GoogleOAuthProvider>
    </div>
  )
}

export default LoginWithOAuth