'use client'

import { RootState } from '@/app/redux/store';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Footbar() {
  const menu = [
    { name: 'Home', link: '/', icon: '/icons/home.png' },
    { name: 'Search', link: '/search', icon: '/icons/search.png' },
    { name: 'Create', link: '/create', icon: '/icons/create.png' },
    { name: 'Reels', link: '/reel', icon: '/icons/reel.png' },
    { name: 'Profile', link: '/profile', icon: '/profile.jpg' },
  ];

  const currentuser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <>
      <div className="w-full">
        <div className="w-full bg-white shadow-md flex items-center">
          {menu.map((item, index) => (
            <div className=" flex w-full px-5 py-2" key={index}>
              <Link href={item.link}>
                <div className={` aspect-square  overflow-hidden object-cover  ${item.name === 'Profile' ? 'rounded-full w-8' : 'p-1 w-9'}`}>
                  <img className='w-full h-full' src={`${item.name === 'Profile' ? currentuser?.avatar : item.icon}`} alt="" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
