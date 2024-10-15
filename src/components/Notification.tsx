'use client';

import { NotificationInterface } from '@/app/interface/interface.declare';
import { setNotificationActive, setNotificationNotActive } from '@/app/redux/notification';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const dispatch = useDispatch();
  const isNotificationActive = useSelector((state: RootState) => state.notification.isNotificationActive)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notification');
      if (res.status === 200) {
        // console.log(res.data.notification); // Logs the data fetched from API
        setNotifications(res.data.notification);
      }
    } catch (error: any) {
      toast.error(`Error fetching notifications ${error.message}`);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  //handel click outside the notification box
  const handelClick=()=>{
    if (isNotificationActive) {
      dispatch(setNotificationNotActive());
    } else {
      dispatch(setNotificationActive());
    }
  }

  return (
    <>
      <div className="w-full h-screen  sm:bg-none  grid sm:grid-cols-3 ">
        <div className=" flex h-screen flex-col gap-3 col-span-2 w-full bg-gray-200 ">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                className=" border-[1px] border-gray-300 rounded-lg  py-2 sm:p-2"
                key={notification._id}
              >
                <div className="w-full  flex items-center gap-1">
                  {/* profile avatar */}
                  <div className="w-8 sm:w-10 aspect-square rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        notification.notificationFrom.avatar || '/profile.jpg'
                      }
                      alt=" sender avatar"
                    />
                  </div>
                  <div className=" flex items-center text-center text-xs sm:text-sm">
                    {notification.notificationType === 'like' && (
                      <div className=" flex  gap-2 text-center items-center">
                        <p>
                          <span className="font-semibold">
                            {notification.notificationFrom.userName}
                          </span>{' '}
                          liked your post
                        </p>
                        <div className=" w-10 aspect-[9/10] overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={notification.post?.media.url}
                            alt=" post image"
                          />
                        </div>
                        <p className="text-xs">
                          {moment(notification.createdAt)
                            .fromNow(true)
                            .replace('minutes', 'min')
                            .replace('a minute', '1min')}
                        </p>
                      </div>
                    )}

                    {notification.notificationType === 'comment' && (
                      <div className=" flex  gap-2 text-center items-center">
                        <p>
                          {' '}
                          <span className="font-semibold">
                            {notification.notificationFrom.userName}
                          </span>{' '}
                          commented your post
                        </p>
                        <div className=" w-10 aspect-[9/10] overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={notification.post?.media.url}
                            alt=" post image"
                          />
                        </div>
                        <p className="text-xs">
                          {moment(notification.createdAt)
                            .fromNow(true)
                            .replace('minutes', 'min')
                            .replace('a minute', '1min')}
                        </p>
                      </div>
                    )}

                    {notification.notificationType === 'follow' && (
                      <div className=" flex gap-2 items-center">
                        <p>
                          <span className="font-semibold">
                            {notification.notificationFrom.userName}
                          </span>{' '}
                          started following you
                        </p>
                        <p className=" p-2 rounded-lg bg-black text-white ">
                          Follow Back
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-center mt-10 text-xl font-semibold'>No notifications available.</p>
          )}
        </div>
        <div className="col-span-1 w-full bg-transparent" onClick={handelClick}></div>
      </div>
    </>
  );
}
