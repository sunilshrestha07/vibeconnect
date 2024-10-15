'use client';

import { setNotificationActive, setNotificationNotActive } from '@/app/redux/notification';
import { RootState } from '@/app/redux/store';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Topbar() {
  const dispatch = useDispatch();
  const isNotificationActive = useSelector((state: RootState) => state.notification.isNotificationActive)

  const handelClick = () => {
      if (isNotificationActive) {
        dispatch(setNotificationNotActive());
      } else {
        dispatch(setNotificationActive());
      }
  };
  return (
    <>
      <div className="w-full flex justify-between sm:hidden px-5 py-2 ">
        <div className="">
          <Link href="/">
            <p className=" font-Italianno font-bold text-2xl">VibeConnect</p>
          </Link>
        </div>
        <div className=" flex gap-5">
          <div className=" w-8 aspect-square  overflow-hidden object-cover p-1">
              <img
                className="w-full h-full"
                src="/icons/notification.png"
                alt="notification icon"
                onClick={handelClick}
              />
          </div>
          <div className=" w-8 aspect-square  overflow-hidden object-cover p-1">
            <Link href="/message">
              <img
                className="w-full h-full"
                src="/icons/chat.png"
                alt="message icon"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
