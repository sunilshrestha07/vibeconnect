'use client';

import {
  setNotificationActive,
  setNotificationNotActive,
  setSearchActive,
  setSearchNotActive,
} from '@/app/redux/notification';
import { RootState } from '@/app/redux/store';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function SideMenu() {
  const menu = [
    { name: 'Home', link: '/', icon: '/icons/home.png' },
    { name: 'Search', link: '/', icon: '/icons/search.png' },
    { name: 'Create', link: '/create', icon: '/icons/create.png' },
    { name: 'Reels', link: '/', icon: '/icons/reel.png' },
    {
      name: 'Notification',
      link: '/',
      icon: '/icons/notification.png',
    },
    { name: 'Message', link: '/message', icon: '/icons/chat.png' },
    { name: 'Profile', link: '/profile', icon: '/profile.jpg' },
  ];

  const currentuser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const isNotificationActive = useSelector(
    (state: RootState) => state.notification.isNotificationActive
  );
  const isSearchActive = useSelector(
    (state: RootState) => state.notification.isSearchActive
  );

  const handelClick = (name: string) => {
    if (name === "Notification") {
      if (isNotificationActive) {
        dispatch(setNotificationNotActive());
      } else {
        dispatch(setNotificationActive());
      }
    }

    if (name === 'Search') {
      isSearchActive
        ? dispatch(setSearchNotActive())
        : dispatch(setSearchActive());
    }

    if (name === 'Message' || name === 'Reels') {
      toast.info(`${name} option not implemented yet`);
    }
  };

  return (
    <>
      <div className=" w-full h-screen m-4 xl:m-6 ">
        <div className="w-full h-full ">
          {/* logo */}
          <div className=" w-full justify-start ">
            <p className=" font-Italianno font-semibold text-2xl hidden lg:block  ">
              Vibeconnect
            </p>
            <div className="w-full justify-center xl:justify-start  flex lg:hidden my-3">
              <div className=" w-10 rounded-full aspect-square  overflow-hidden object-cover">
                <img
                  className="w-full h-full "
                  src="/logo.png"
                  alt="logo image"
                />
              </div>
            </div>
          </div>

          {/* menu options */}
          <div className="w-full h-[90%]  flex flex-col   ">
            <div className="w-full h-full ">
              {menu.map((item, index) => (
                <div
                  className=" my-6 flex justify-center lg:justify-start items-center "
                  key={index}
                >
                  <Link href={item.link}>
                    <div
                      className=" flex justify-start items-center relative"
                      onClick={() => handelClick(item.name)}
                    >
                      <div
                        className={`  rounded-full overflow-hidden object-cover  ${
                          item.name === 'Profile'
                            ? 'rounded-full w-8 aspect-square'
                            : 'p-1 w-9 aspect-square'
                        } `}
                      >
                        <img
                          className={`${
                            item.name === 'Profile'
                              ? 'w-full h-full object-cover'
                              : 'w-full h-full'
                          }`}
                          src={`${
                            item.name === 'Profile'
                              ? currentuser?.avatar || '/avatar.png'
                              : item.icon
                          }`}
                          alt=""
                        />
                      </div>
                      {item.name === 'Notification' && (
                        <p className="absolute top-0 left-7 bg-red-500 w-2 aspect-square rounded-full"></p>
                      )}
                      <div className=" hidden lg:flex">
                        <p className="ml-2 font-medium">{item.name}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="w-10 aspect-square  overflow-hidden object-cover p-1">
              <Link href="/">
                <img className="w-full h-full" src="/icons/more.png" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
