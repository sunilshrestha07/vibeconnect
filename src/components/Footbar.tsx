import Link from 'next/link';
import React from 'react';

export default function Footbar() {
  const menu = [
    { name: 'Home', link: '/', icon: '/icons/home.png' },
    { name: 'Search', link: '/search', icon: '/icons/search.png' },
    { name: 'Create', link: '/create', icon: '/icons/create.png' },
    { name: 'Reels', link: '/reel', icon: '/icons/reel.png' },
    { name: 'Profile', link: '/profile', icon: '/logo.png' },
  ];
  return (
    <>
      <div className="w-full">
        <div className="w-full bg-white shadow-md flex">
          {menu.map((item, index) => (
            <div className=" flex w-full px-5 py-2" key={index}>
              <Link href={item.link}>
                <div className="w-8 aspect-square  overflow-hidden object-cover p-1">
                  <img className='w-full h-full' src={item.icon} alt="" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
