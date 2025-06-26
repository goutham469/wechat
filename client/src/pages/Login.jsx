import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (user && user.id) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-200">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-4">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Choose a login method</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("./oauth")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login with Google
          </button>
          <button
            onClick={() => navigate("./otp")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login with OTP
          </button>
          <button
            onClick={() => navigate("./username")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login with Username
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-cyan-700 hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 w-full px-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Login;
