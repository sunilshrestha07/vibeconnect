'use client';


import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../redux/UserSlice';

export default function page() {
  const router = useRouter();
  const dispatch = useDispatch()
  const handelLogout = async() => {
    try {
      const res = await axios.post('/api/user/logout');
      if (res.status === 200) {
        dispatch(logout())
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
    <div className=" flex items-center justify-center w-full h-full">
      <button className='w-28 px-5 py-2 rounded-lg bg-slate-600 text-white' onClick={handelLogout}>Logout</button>
    </div>
    </>
  )
}
