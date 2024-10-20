'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/UserSlice';
import { RootState } from '../redux/store';
import UserPosts from '@/components/UserPosts';
import UserSaved from '@/components/UserSaved';
import EditProfile from '@/components/EditProfile';
import { setIsEditActive } from '../redux/editSlice';

export default function page() {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  console.log(currentUser);
  const dispatch = useDispatch();
  const [selectedLink, setSelectedLink] = useState('Posts');
  const posts = useSelector((state: RootState) => state.posts.posts);

  const totalpost = posts.filter(
    (post) => post.user._id === currentUser?._id
  ).length;

  //links for post or saved
  const links = [
    { name: 'Posts', link: '/posts', icon: '/icons/grid.png' },
    { name: 'saved', link: '/saved', icon: '/icons/saved.png' },
  ];

  const handelLogout = async () => {
    try {
      const res = await axios.post('/api/user/logout');
      if (res.status === 200) {
        dispatch(logout());
        localStorage.clear();
        router.replace('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isEditActive = useSelector((state: RootState) => state.edit.isEditActive);
  return (
    <>
      <div className="w-full h-full flex justify-center px-4 sm:px-0 relative">
        {/* profile section */}
        <div className=" w-full  sm:w-10/12 h-full ">
          <div className=" w-full flex  justify-center pb-6 sm:pb-10 border-b-2  border-gray-500">
            <div className="w-full">
              <div className=" flex gap-2 sm:gap-16 md:gap-24 mt-10 text-sm md:text-xl ">
                {/* avatar */}
                <div className="w-28 sm:w-40 aspect-square rounded-full overflow-hidden ">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={currentUser?.avatar || 'avatar.png'}
                    alt="user avatar"
                  />
                </div>
                <div className=" items-center justify-center flex flex-col gap-2 ">
                  <div className=" flex items-center gap-2">
                    <div className="">
                      <p className=" text-xs sm:text-base font-semibold px-1 sm:px-3 py-1 rounded-lg bg-gray-300">
                        {currentUser?.userName}
                      </p>
                    </div>
                    <div className="">
                      <p
                        className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-1 rounded-lg bg-gray-300 cursor-pointer"
                        onClick={() => dispatch(setIsEditActive())}
                      >
                        Edit Profile
                      </p>
                    </div>
                    <div className=" ml-2 cursor-pointer">
                      <img
                        className="w-5 sm:w-6"
                        src="/icons/logout.png"
                        alt=""
                        onClick={handelLogout}
                      />
                    </div>
                  </div>
                  {/* post, followers and following */}
                  <div className="mt-2  w-full flex justify-between font-semibold text-xs sm:text-base">
                    <div className=" flex flex-col justify-center items-center">
                      <p>{totalpost}</p>
                      <p>Posts</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p>{currentUser?.followers?.length || 0}</p>
                      <p>Followers</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p>{currentUser?.following?.length || 0}</p>
                      <p>Following</p>
                    </div>
                  </div>
                  {/* bio */}
                  <div className="w-full flex justify-start ">
                    <p className="text-xs sm:text-base font-semibold py-1 rounded-lg ">
                      {currentUser?.bio ? currentUser?.bio : `This is ${currentUser?.userName}'s bio.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* posts and saved */}
          <div className="w-full  flex flex-col">
            <div className=" w-full flex justify-center ">
              <div className="  flex gap-24">
                {links.map((link, index) => (
                  <div
                    className={`flex gap-2 text-sm sm:text-base  items-center cursor-pointer  py-3  ${
                      selectedLink === link.name
                        ? 'border-t-[3px] border-white font-semibold z-20'
                        : ''
                    }`}
                    key={index}
                    onClick={() => setSelectedLink(link.name)}
                  >
                    <div className="">
                      <img className=" w-5 " src={link.icon} alt="" />
                    </div>
                    <p className="">{link.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full ">
              {selectedLink === 'Posts' ? (
                <UserPosts userId={currentUser?._id} />
              ) : (
                <UserSaved userId={currentUser?._id} />
              )}
            </div>
          </div>
        </div>

        {/* //edit profile popup */}
        {isEditActive && (
          <div className="w-full h-screen absolute top-0 left-0 z-50 ">
            <EditProfile />
          </div>
        )}
      </div>
    </>
  );
}
