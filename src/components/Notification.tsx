'use client';

import {
  setNotificationActive,
  setNotificationNotActive,
} from '@/app/redux/notification';
import { RootState } from '@/app/redux/store';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Notification() {
  const dispatch = useDispatch();
  const isNotificationActive = useSelector(
    (state: RootState) => state.notification.isNotificationActive
  );
  const allnotifications = useSelector(
    (state: RootState) => state.notificationData.notifications
  );
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const notifications = allnotifications.filter(
    (allnotifications) =>
      allnotifications.notificationFor._id === currentUser?._id
  );

  //handel click outside the notification box
  const handelClick = () => {
    if (isNotificationActive) {
      dispatch(setNotificationNotActive());
    } else {
      dispatch(setNotificationActive());
    }
  };

  return (
    <>
      <div className=" w-full sm:w-1/2 h-screen  sm:bg-none  grid sm:grid-cols-3 fixed  ">
        <div className=" flex h-screen flex-col gap-3 col-span-2 w-full bg-gray-200 ">
          <div className="w-full  flex justify-between pt-5 px-3">
            <p className=" text-2xl font-semibold">Notifications</p>
            <div className="">
              <img
                className="w-8 cursor-pointer"
                src="/icons/close.png"
                alt=""
                onClick={handelClick}
              />
            </div>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div className=" border-[1px] border-gray-300  rounded-lg p-2"key={notification._id}>
                <div className="w-full  flex items-center gap-1 ">
                  {/* profile avatar */}
                  <div className="w-10 aspect-square rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        notification.notificationFrom.avatar || '/profile.jpg'
                      }
                      alt=" sender avatar"
                    />
                  </div>
                  <div className="w-full  flex items-center text-center text-sm">
                    {notification.notificationType === 'like' && (
                      <div className="w-full flex gap-2 text-center justify-between items-center">
                        <div className=" w-4/5 flex pl-2 justify-start ">
                          <div className="w-full flex flex-col justify-start items-start">
                            <p>
                              <span className="font-semibold">
                                {notification.notificationFrom.userName}
                              </span>{' '}
                              liked your post
                            </p>
                            <p className="text-xs">
                              {moment(notification.createdAt)
                                .fromNow(true)
                                .replace('minutes', 'min')
                                .replace('a minute', '1min')}
                            </p>
                          </div>
                        </div>
                        <div className=" w-1/5 ">
                          <div className=" w-10 aspect-[9/10] overflow-hidden bg-yellow-500">
                            <img
                              className="w-full h-full object-cover"
                              src={notification.post?.media.url}
                              alt=" post image"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {notification.notificationType === 'comment' && (
                      <div className="w-full flex gap-2 text-center justify-between items-center">
                        <div className=" w-4/5 flex pl-2 justify-start ">
                          <div className="w-full flex flex-col justify-start items-start">
                            <p>
                              <span className="font-semibold">
                                {notification.notificationFrom.userName}
                              </span>{' '}
                              commented on your post
                            </p>
                            <p className="text-xs">
                              {moment(notification.createdAt)
                                .fromNow(true)
                                .replace('minutes', 'min')
                                .replace('a minute', '1min')}
                            </p>
                          </div>
                        </div>
                        <div className=" w-1/5 ">
                          <div className=" w-10 aspect-[9/10] overflow-hidden bg-yellow-500">
                            <img
                              className="w-full h-full object-cover"
                              src={notification.post?.media.url}
                              alt=" post image"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {notification.notificationType === 'follow' && (
                      <div className="w-full flex gap-2 text-center justify-between items-center">
                        <div className=" w-3/5 sm:w-4/5 flex pl-2 justify-start ">
                          <div className="w-full flex flex-col justify-start items-start">
                            <p className='text-start'>
                              <span className="font-semibold">
                                {notification.notificationFrom.userName}
                              </span>{' '}
                              started following you
                            </p>
                            <p className="text-xs">
                              {moment(notification.createdAt)
                                .fromNow(true)
                                .replace('minutes', 'min')
                                .replace('a minute', '1min')}
                            </p>
                          </div>
                        </div>
                        <div className=" w-2/5 sm:w-1/5 ">
                          <p className=" p-2 rounded-lg bg-black text-white  cursor-pointer">
                            Follow Back
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10 text-xl font-semibold">
              No notifications available.
            </p>
          )}
          {/* <div className="  flex">
            <p className=' bg-gray-400  font-normal px-6 py-1 rounded-lg text-center'>Clear all</p>
          </div> */}
        </div>
        <div
          className="col-span-1 w-full bg-transparent"
          onClick={handelClick}
        ></div>
      </div>
    </>
  );
}
