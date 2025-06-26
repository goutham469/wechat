import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AI } from '../utils/AI';

const { VITE_GOOGLE_OAUTH_CLIENT_ID, VITE_SERVER_URL } = import.meta.env;

// Enhanced JSON parser utility
const parseJsonContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content provided');
  }

  let cleanContent = content.trim();
  
  // Remove markdown code block syntax
  cleanContent = cleanContent.replace(/^```(?:json)?\s*/, '');
  cleanContent = cleanContent.replace(/```+\s*$/, '');
  cleanContent = cleanContent.trim();
  
  try {
    const parsedData = JSON.parse(cleanContent);
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Expected an array but got ' + typeof parsedData);
    }
    
    // Validate array contains only strings
    const isValidArray = parsedData.every(item => 
      typeof item === 'string' && item.trim().length > 0
    );
    
    if (!isValidArray) {
      throw new Error('Array must contain only non-empty strings');
    }
    
    return parsedData;
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error(`Failed to parse usernames: ${error.message}`);
  }
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

// Status message component
const StatusMessage = ({ status, message, type = 'info' }) => {
  const baseClasses = "text-center py-3 px-4 rounded-lg font-medium";
  const typeClasses = {
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200"
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  );
};

function Register() {
  const [form, setForm] = useState({ 
    status: 'user-registering',
    email: '',
    name: '',
    username: '',
    usernameOptions: [],
    error: null
  });
  
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      setForm(prev => ({ ...prev, status: 'pending', error: null }));

      const token = response.credential;
      if (!token) {
        throw new Error('No credential token received');
      }

      const credential = jwtDecode(token);
      const { email, name, picture } = credential;

      if (!email || !name) {
        throw new Error('Invalid user data received from Google');
      }

      setForm(prev => ({
        ...prev,
        email,
        name,
        picture,
        status: 'generating-usernames',
      }));

      const usernames = await AI.generate_username(email, name);
      
      if (!usernames) {
        throw new Error('No usernames generated');
      }

      const parsedUsernames = parseJsonContent(usernames);
      
      if (parsedUsernames.length === 0) {
        throw new Error('No valid usernames generated');
      }

      setForm(prev => ({
        ...prev,
        usernameOptions: parsedUsernames,
        status: 'user-name-selection',
      }));

    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Something went wrong during login');
      setForm(prev => ({ 
        ...prev, 
        status: 'error',
        error: error.message 
      }));
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google OAuth error:', error);
    toast.error('Google login failed. Please try again.');
    setForm(prev => ({ 
      ...prev, 
      status: 'error',
      error: 'Google authentication failed' 
    }));
  };

  const handleUsernameSelection = async (selectedUsername) => {
    if (!selectedUsername) return;

    setForm(prev => ({ ...prev, username: selectedUsername, status: 'loading' }));
    
    try {
      await registerUser(selectedUsername);
    } catch (error) {
      console.error('Registration error:', error);
      setForm(prev => ({ 
        ...prev, 
        status: 'user-name-selection',
        error: error.message 
      }));
    }
  };

  const registerUser = async (username) => {
    const { email, name } = form;

    if (!email || !name || !username) {
      throw new Error('Missing required registration data');
    }

    try {
      const response = await fetch(`${VITE_SERVER_URL}/user/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, name, username }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Registration successful! Welcome aboard!');
        setForm(prev => ({ ...prev, status: 'success' }));
        
        // Navigate after a short delay to show success message
        setTimeout(() => navigate('/user'), 1500);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const resetForm = () => {
    setForm({ 
      status: 'user-registering',
      email: '',
      name: '',
      username: '',
      usernameOptions: [],
      error: null
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/person.png" 
              alt="Person Icon" 
              className="w-16 h-16 rounded-full border-4 border-indigo-100 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome!
            </h1>
            <p className="text-gray-600">
              Create your account with Google
            </p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-4">
          {form.status === 'pending' && (
            <>
              <LoadingSpinner />
              <StatusMessage 
                message="Verifying your credentials..." 
                type="info" 
              />
            </>
          )}

          {form.status === 'generating-usernames' && (
            <>
              <LoadingSpinner />
              <StatusMessage 
                message="Creating personalized username options..." 
                type="info" 
              />
            </>
          )}

          {form.status === 'loading' && (
            <>
              <LoadingSpinner />
              <StatusMessage 
                message="Setting up your account..." 
                type="info" 
              />
            </>
          )}

          {form.status === 'error' && (
            <div className="space-y-3">
              <StatusMessage 
                message={form.error || "Something went wrong. Please try again!"} 
                type="error" 
              />
              <button
                onClick={resetForm}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {form.status === 'success' && (
            <StatusMessage 
              message="Account created successfully! Redirecting..." 
              type="success" 
            />
          )}
        </div>

        {/* Google Login */}
        {form.status === 'user-registering' && (
          <div className="space-y-4">
            <GoogleOAuthProvider clientId={VITE_GOOGLE_OAUTH_CLIENT_ID}>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                />
              </div>
            </GoogleOAuthProvider>
            
            <div className="text-center text-sm text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        )}

        {/* Username Selection */}
        {form.status === 'user-name-selection' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Choose Your Username
              </h2>
              <p className="text-sm text-gray-600">
                Pick a username that represents you
              </p>
            </div>
            
            <div className="space-y-3">
              {form.usernameOptions.map((username, index) => (
                <button
                  key={`${username}-${index}`}
                  onClick={() => handleUsernameSelection(username)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-indigo-600">
                        {username}
                      </span>
                    </div>
                    <div className="text-gray-400 group-hover:text-indigo-500">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setForm(prev => ({ ...prev, status: 'generating-usernames' }))}
              className="w-full text-center py-3 px-4 text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 hover:border-indigo-300 rounded-lg transition-colors duration-200"
            >
              Generate New Options
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Contact our support team</p>
      </div>
    </div>
  );
}

export default Register;