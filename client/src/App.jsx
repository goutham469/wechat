import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import User from './pages/User'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Docs from './pages/Docs'
import { ToastContainer } from 'react-toastify'
import LoginWithOAuth from './components/LoginWithOAuth'
import LoginWithOTP from './components/LoginWithOTP'
import LoginWithUserName from './components/LoginWithUserName'
import SqlEditor from './pages/SqlEditor'
import AllUsers from './pages/AllUsers'
import Logs from './pages/Logs'
import Search from './components/Search'
import Settings from './components/Settings'
import Profile from './components/Profile'
import UserNotifications from './components/UserNotifications'

function App() {
  const router = createBrowserRouter([
    {
      path:'',
      element:<User/>
    },
    {
      path:"login",
      element:<Login/>,
      children:[
        {
          path:'oauth',
          element:<LoginWithOAuth/>
        },
        {
          path:'otp',
          element:<LoginWithOTP/>
        },
        {
          path:'username',
          element:<LoginWithUserName/>
        },
        {
          path:'',
          element:<LoginWithOAuth/>
        }
      ]
    },
    {
      path:"register",
      element:<Register/>
    },
    {
      path:"settings",
      element:<Settings />,
      children:[
        {
          path:'',
          element:<Profile/>
        },
        {
          path:'profile',
          element:<Profile/>
        },
        {
          path:'notifications',
          element:<UserNotifications/>
        }
      ]
    },
    {
      path:'search',
      element:<Search/>
    },
    {
      path:"admin",
      element:<Admin/>,
      children:[
        {
          path:'sql-editor',
          element:<SqlEditor />
        },
        {
          path:"all-users",
          element:<AllUsers/>
        },
        {
          path:"logs",
          element:<Logs/>
        }
      ]
    },
    {
      path:"docs",
      element:<Docs/>
    }
  ])

  return (
    <div className='text-primary'>
      <RouterProvider router={router} />
      <ToastContainer/>
    </div>
  )
}

export default App
