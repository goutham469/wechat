import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { API } from '../utils/API';
import { setLocalState } from '../redux/getInitialState';
import { useDispatch } from 'react-redux';
import { user_slice_login } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

function LoginWithOTP() {
    const [form, setForm] = useState({ stage: 1 });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function getOTP(e) {
        e.preventDefault(); // Prevent form submission
        
        if (!form.email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            const data = await API.getOTP(form.email); // Fixed: added const/let
            // console.log(data);

            if (data.success) { // Fixed: typo from 'succes' to 'success'
                // console.log(data);
                setForm({ ...form, "system-otp": data.data.OTP, stage: 2 }); // Fixed: combined state updates
                toast.success("OTP has been sent to your email.");
            } else {
                toast.error("Failed to send OTP");
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function submitOTP(e) {
        e.preventDefault(); // Prevent form submission
        
        if (!form.OTP) {
            toast.error("Please enter the OTP");
            return;
        }

        setIsLoading(true);
        try {
            if (form.OTP === form['system-otp']) { // Fixed: use === instead of ==
                toast.success("Login successful!");
                // Add your login logic here (redux dispatch, navigation, etc.)
                
                const response2 = await API.login_with_Google_OAUTH( form['email'] );
                if(response2.success){
                // update redux data
                    // console.log(response2)
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
                    console.log(response2.error)
                    API.report_error(response2.error)
                }

            } else {
                toast.error("Invalid OTP. Please try again.");
                API.report_error("Invalid OTP login");
            }
        } catch (error) {
            toast.error("An error occurred during verification");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    function resendOTP() {
        setForm({ ...form, stage: 1 });
        toast.info("You can request a new OTP");
    }

    return (
        <div className='bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg rounded-xl p-6 m-4 max-w-md mx-auto'>
            {/* Stage 1: Email Input */}
            {form && form.stage === 1 && (
                <div className="space-y-4">
                    <h2 className="text-white text-xl font-semibold text-center mb-4">
                        Login with OTP
                    </h2>
                    <form onSubmit={getOTP} className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                placeholder='Enter your email address'
                                type='email'
                                name='email'
                                value={form.email || ''}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className='w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition duration-200 disabled:opacity-50'
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-white text-cyan-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending OTP...
                                </span>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Stage 2: OTP Verification */}
            {form && form.stage === 2 && (
                <div className="space-y-4">
                    <h2 className="text-white text-xl font-semibold text-center mb-2">
                        Verify OTP
                    </h2>
                    <p className="text-white text-sm text-center opacity-90 mb-4">
                        We've sent an 8-character OTP to {form.email}
                    </p>
                    <form onSubmit={submitOTP} className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Enter OTP
                            </label>
                            <input
                                placeholder='Enter 8-character OTP'
                                type='text' // Changed from 'number' to 'text' for alphanumeric
                                name='OTP'
                                value={form.OTP || ''}
                                onChange={handleChange}
                                maxLength={8}
                                required
                                disabled={isLoading}
                                className='w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition duration-200 disabled:opacity-50 text-center text-lg font-mono tracking-widest'
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-white text-cyan-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                        <button 
                            type="button"
                            onClick={resendOTP}
                            className='w-full text-white text-sm underline hover:no-underline transition duration-200'
                        >
                            Didn't receive OTP? Send again
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default LoginWithOTP