'use client';

import Story from '@/components/Story';
import React, { useEffect } from 'react';
import Posts from '@/components/Posts';
import axios from 'axios';
import { setStories } from './redux/storySlice';
import { setPosts } from './redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setComments } from './redux/commentSlice';
import Notification from '@/components/Notification';
import { RootState } from './redux/store';
import { setnotifications } from './redux/notificaitionDataSlice';
import { toast } from 'react-toastify';

export default function page() {
  //pre fetching story and posts
  const dispatch = useDispatch();
  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/story');
      if (res.status === 200) {
        dispatch(setStories(res.data.allstory));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/post');
      if (res.status === 200) {
        dispatch(setPosts(res.data.allpost));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment');
      if (res.status === 200) {
        dispatch(setComments(res.data.allcomments));
        // console.log(res.data.allcomments);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notification');
      if (res.status === 200) {
        dispatch(setnotifications(res.data.notification));
      }
    } catch (error: any) {
      toast.error(`Error fetching notifications ${error.message}`);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchPosts();
    fetchComments();
    fetchNotifications()
  });

  const isNotificationActive = useSelector((state: RootState) => state.notification.isNotificationActive)
  return (
    <>
      <div className="w-full relative ">
        <div className=" z-30">
          <Story />
        </div>
        <div className=" w-full h-full flex justify-center items-center ">
          <div className=" w-full sm:w-8/12 h-full ">
            <Posts />
          </div>
        </div>
        {isNotificationActive && (
          <div className=" absolute top-0 right-0 w-full ">
            <Notification />
          </div>
        )}
      </div>
    </>
  );
}
