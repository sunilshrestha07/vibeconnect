import Link from 'next/link';
import React from 'react';

export default function SideMenu() {
  return (
    <>
      <div className=" w-full h-screen m-4 xl:m-6 overflow-hidden">
        <div className="w-full h-full">
          {/* logo */}
          <div className=" w-full flex justify-start ">
            <p className=" font-Italianno font-semibold text-2xl  ">
              Vibeconnect
            </p>
            <div className="w-full justify-center flex xl:hidden">
              <div className=" w-10 sm:w-12 md:w-14 aspect-square  overflow-hidden object-cover">
                <img
                  className="w-full h-full rounded-full"
                  src="/logo.png"
                  alt="logo image"
                />
              </div>
            </div>
          </div>

          {/* menu options */}
          <div className="w-full h-full bg-green-300"></div>
        </div>
      </div>
    </>
  );
}
