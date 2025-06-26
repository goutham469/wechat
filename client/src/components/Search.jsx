import React, { useEffect, useState } from 'react'
import { API } from '../utils/API'
import { FaSearch, FaCircle } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { chat_slice_setChat } from '../redux/slices/chatSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    let result = await API.searchUser(query);
    if (result.success) {
      setUsers(result.data.users);
    } else {
      console.warn(result.error);
      toast.error(result.error || "Failed to search users");
    }
    setLoading(false);
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) getData()
      else setUsers([])
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (loading) {
    return <div className='flex justify-center'>
      <img src='/loading.gif' alt='loading' />
    </div>
  }

  return (
    <div>
      <div className='cursor-pointer m-2 p-2 bg-cyan-500 w-fit rounded-md' onClick={() => window.location.href = "/"}>
        &lt; Back
      </div>

      <b>Search</b>
      <br />

      <div className='flex items-center bg-cyan-50 p-2 m-2 w-[250px] rounded-md'>
        <input
          type='text'
          placeholder='username'
          className='w-full p-1 rounded-md'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className='m-3 flex flex-col gap-2'>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }) {
  const sys_user = useSelector(state => state.user);
  const navigate = useNavigate();

  async function loadChatInstance() {
    if (sys_user.id === user.id) {
      toast.success("It's you!");
      return;
    }

    const result = await API.loadChat({ u1: user.id, u2: sys_user.id });
    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.error || "Could not load chat");
    }
  }

  return (
    <div
      className='flex items-center gap-2 bg-cyan-500 w-[250px] p-2 rounded-md border-2 cursor-pointer hover:bg-cyan-600 transition-all'
      onClick={loadChatInstance}
    >
      {user.profile_pic
        ? <img src={user.profile_pic} className='rounded-full w-[40px] h-[40px]' />
        : <IoIosPerson size={40} className='rounded-full bg-white p-1' />}
      <b className='font-bold text-white'>{user.username}</b>
      {user.online_status === 'YES' && <FaCircle color='green' size={10} />}
    </div>
  );
}

export default Search;
