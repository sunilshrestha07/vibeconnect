'use cli'


import { RootState } from '@/app/redux/store';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export default function SideMenu() {
  const menu = [
    { name: 'Home', link: '/', icon: '/icons/home.png' },
    { name: 'Search', link: '/search', icon: '/icons/search.png' },
    { name: 'Create', link: '/create', icon: '/icons/create.png' },
    { name: 'Reels', link: '/reel', icon: '/icons/reel.png' },
    {
      name: 'Notification',
      link: '/notification',
      icon: '/icons/notification.png',
    },
    { name: 'Message', link: '/message', icon: '/icons/chat.png' },
    { name: 'Profile', link: '/profile', icon: '/profile.jpg' },
  ];

  const currentuser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <>
      <div className=" w-full h-screen m-4 xl:m-6 ">
        <div className="w-full h-full ">
          {/* logo */}
          <div className=" w-full justify-start ">
            <p className=" font-Italianno font-semibold text-2xl hidden xl:block  ">
              Vibeconnect
            </p>
            <div className="w-full justify-center xl:justify-start  flex xl:hidden my-3">
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
                  className=" my-6 flex justify-center xl:justify-start items-center "
                  key={index}
                >
                  <Link href={item.link}>
                    <div className=" flex justify-start items-center">
                      <div
                        className={`  rounded-full overflow-hidden object-cover  ${
                          item.name === 'Profile'
                            ? 'rounded-full w-8 aspect-square'
                            : 'p-1 w-9 aspect-square'
                        } `}
                      >
                        <img className={`${item.name === 'Profile' ? 'w-full h-full object-cover' : 'w-full h-full'}`} src={`${item.name === 'Profile' ? currentuser?.avatar ||  '/avatar.png' : item.icon}`} alt="" />
                      </div>
                      <div className=" hidden xl:flex">
                        <p className="ml-2 font-medium">{item.name}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="w-10 aspect-square  overflow-hidden object-cover p-1">
              <Link href="/">
              <img className='w-full h-full' src="/icons/more.png" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
