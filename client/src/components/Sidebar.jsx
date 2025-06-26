import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUsers } from "react-icons/fa";

function Sidebar( { data } ) {
  const navigate = useNavigate()
  return (
    <div>
        {
            data.map( (key,idx) => 
            <div 
              className='text-bold font-[16px] bg-cyan-500 p-1 m-2 rounded-md flex flex-around cursor-pointer'
              key={idx}
              onClick={()=> navigate(`${key.url}`)}
            >
                  <FaUsers className='m-1'/>
                  <b>{key.name}</b>
            </div>
         )
        }
    </div>
  )
}

export default Sidebar