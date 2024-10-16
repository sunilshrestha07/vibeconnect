'use client'

import { setSearchActive, setSearchNotActive } from '@/app/redux/notification';
import { RootState } from '@/app/redux/store';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Footbar() {
  const menu = [
    { name: 'Home', link: '/', icon: '/icons/home.png' },
    { name: 'Search', link: '/', icon: '/icons/search.png' },
    { name: 'Create', link: '/create', icon: '/icons/create.png' },
    { name: 'Reels', link: '/', icon: '/icons/reel.png' },
    { name: 'Profile', link: '/profile', icon: '/profile.jpg' },
  ];

  const currentuser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const isSearchActive = useSelector(
    (state: RootState) => state.notification.isSearchActive
  );

  const handelSearchToggle = (name:string) => {
    if (name === 'Search') {
      isSearchActive
        ? dispatch(setSearchNotActive())
        : dispatch(setSearchActive());
    }

    if(name === 'Message' || name === 'Reels') {
      toast.info(`${name} option not implemented yet`);
    }
  }
  return (
    <>
      <div className="w-full">
        <div className="w-full bg-white shadow-md flex items-center">
          {menu.map((item, index) => (
            <div className=" flex w-full px-5 py-2" key={index}>
              <Link href={item.link}>
                <div className={` aspect-square  overflow-hidden object-cover  ${item.name === 'Profile' ? 'rounded-full w-8' : 'p-1 w-9'}`}>
                  <img className='w-full h-full' src={`${item.name === 'Profile' ? currentuser?.avatar : item.icon}`} alt="" onClick={()=>handelSearchToggle(item.name)} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
