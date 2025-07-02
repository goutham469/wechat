import React, { useEffect, useState } from 'react'
import { API } from '../utils/API'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { tools } from '../utils/tools'

function UserNotifications()
{
  const [notifications, setNotifications] = useState([])
  const [filters, setFilters] = useState([])
  const [filter, setFilter] = useState('All')
  const user = useSelector(state => state.user)

  async function getData(userId)
  {
    const data = await API.get_notifications(userId)

    if (data.success)
    {
      setNotifications(data.data.notifications)
      const temp = [ 'All' ]
      const temp2 = { 'All':data.data.cnt }

      data.data.notifications.forEach(n =>
      {
        try
        {
          const payload = JSON.parse(n.payload)
          if (!temp.includes(payload.type))
          {
            temp.push(payload.type)
            temp2[payload.type] = 1;
          }
          else{
            temp2[ payload.type ] += 1;
          }

        }
        catch (err)
        {
          console.error("Invalid JSON in payload:", n.payload)
        }
      })

      setFilters(temp2)
    }
    else
    {
      toast.error(data.error)
    }
  }

  useEffect(() =>
  {
    if (user?.id)
    {
      getData(user.id)
    }
  }, [user])

  const filteredNotifications = notifications.filter(n =>
  {
    if (filter === 'All') return true
    try
    {
      const payload = JSON.parse(n.payload)
      return payload.type === filter
    }
    catch (err)
    {
      return false
    }
  })

  return (
    <div className='m-3'>
      <b className='text-lg'>User Notifications</b>
      <div className='m-2 p-2 flex flex-wrap gap-2'>
        {
          Object.keys(filters).map(ele => (
            <b
              key={ele}
              className={`cursor-pointer bg-cyan-${ele === filter ? '600' : '400'} text-white rounded-md px-3 py-1`}
              onClick={() => setFilter(ele)}
            >
              {ele}({filters[ele]})
            </b>
          ))
        }
      </div>

      {
        filteredNotifications.length === 0
          ? <p className='text-sm text-gray-600 m-2'>No notifications</p>
          : <PaginationSetup notifications={filteredNotifications} />
      }
    </div>
  )
}

function PaginationSetup( { notifications=[] } )
{
    const [page , setPage] = useState(0);
    const limit = 5;

    return <div>
        <Controls page={page} pageControl={setPage} />
        <div>
            {
                notifications.slice(page*limit,(page+1)*limit).map(data => (
                    <NotificationCard key={data.id} data={data} />
                    ))
            }
        </div>
        <Controls page={page} pageControl={setPage} />
    </div>
}

function Controls( { page , pageControl })
{
    return <div>
                <button 
                    onClick={ ()=> pageControl( page >= 0 ? 0 : page-1 ) }
                    className='bg-cyan-500 p-1 m-1 rounded-md cursor-pointer'
                >&lt;</button>

                <b>{page+1}</b>

                <button
                    onClick={ ()=> pageControl( page+1 ) }
                    className='bg-cyan-500 p-1 m-1 rounded-md cursor-pointer'
                >&gt;</button>
            </div>
}

function NotificationCard({ data })
{
  let parsedPayload = {}
  try {
    parsedPayload = JSON.parse(data.payload)
  } catch (e) {
    console.error("Error parsing payload:", e)
  }

  return (
    <div className='bg-cyan-500 m-2 p-3 rounded-md text-sm w-fit'>
      <p><b>Message:</b> {data.message}</p>
      <p><b>Time:</b> {tools.convertUTCtoLocalTime(data.time)}</p>
      <p><b>Type:</b> {parsedPayload?.type || "N/A"}</p>
    </div>
  )
}

export default UserNotifications
