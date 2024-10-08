'use client'

import Story from '@/components/Story'
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setStories } from './redux/storySlice';

export default function page() {
  const dispatch = useDispatch();
  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/story');
      if(res.status === 200) {
        dispatch(setStories(res.data.allstory))
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  },[])
  return (
    <>
    <div className="w-full">
      <Story/>
    </div>
    </>
  )
}
