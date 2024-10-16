'use client';

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserPosts from '@/components/UserPosts';
import UserSaved from '@/components/UserSaved';
import { RootState } from '@/app/redux/store';
import { loginSuccess, logout } from '@/app/redux/UserSlice';
import { SingleUser, User } from '@/app/interface/interface.declare';
import { toast } from 'react-toastify';

export default function page() {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const dispatch = useDispatch();
  const [selectedLink, setSelectedLink] = useState('Posts');
  const posts = useSelector((state: RootState) => state.posts.posts);
  const totalpost = posts.filter((post) => post.user._id === user?._id).length;
  const params = useParams();
  const id = params ? params.id : null;
  const currentUser = useSelector((state: RootState) => state.user.currentUser)as SingleUser;

  //links for post or saved
  const links = [
    { name: 'Posts', link: '/posts', icon: '/icons/grid.png' },
    { name: 'saved', link: '/saved', icon: '/icons/saved.png' },
  ];

  //fetching the user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/user/${id}`);
      if (res.status === 200) {
        setUser(res.data.user);
        console.log(res.data.user);
      }
    } catch (error: any) {
      toast.error('Error fetching user');
      console.log(`Error fetching user: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  //handel follow user
  const handelFollowUser = async () => {
    const notification = {
      notificationType: 'follow',
      notificationFor: id,
      notificationFrom: currentUser?._id,
    };
    const formdata={
      followingUserId:id
    }
    try {
      const res = await axios.put(`/api/user/follow/${currentUser?._id}`,formdata);
      if (res.status === 200) {
        dispatch(loginSuccess(res.data.user));
        console.log(res.data.user)
      }
      
      // // Send the 'like' notification
      const resn = await axios.post('/api/notification', notification);
      if (resn.status === 200) {
        console.log('Notification sent successfully');
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <div className="w-full h-full flex justify-center px-4 sm:px-0">
        {/* profile section */}
        <div className=" w-full  sm:w-10/12 h-full ">
          <div className=" w-full flex  justify-center pb-6 sm:pb-10 border-b-2  border-gray-500">
            <div className="w-full">
              <div className=" flex gap-4 sm:gap-16 md:gap-24 mt-10 text-sm md:text-xl ">
                {/* avatar */}
                <div className="w-28 sm:w-40 aspect-square rounded-full overflow-hidden ">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={user?.avatar || 'avatar.png'}
                    alt="user avatar"
                  />
                </div>
                <div className=" items-center justify-center flex flex-col gap-2 ">
                  <div className=" flex items-center gap-2">
                    <div className="">
                      <p className=" text-xs sm:text-base font-semibold px-1 sm:px-3 py-1 rounded-lg bg-gray-300">
                        {user?.userName}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-1 rounded-lg bg-gray-300">
                        Edit Profile
                      </p>
                    </div>
                    <div className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-1 rounded-lg bg-gray-300 cursor-pointer" onClick={handelFollowUser}>
                     {user && currentUser?.following?.includes(user?._id ) ? 'Unfollow' : 'Follow'}
                    </div>
                  </div>
                  {/* post, followers and following */}
                  <div className="mt-2  w-full flex justify-between font-semibold text-xs sm:text-base">
                    <div className=" flex flex-col justify-center items-center">
                      <p>{totalpost}</p>
                      <p>Posts</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p>{user?.followers?.length || 0}</p>
                      <p>Followers</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p>{user?.following?.length || 0}</p>
                      <p>Following</p>
                    </div>
                  </div>
                  {/* bio */}
                  <div className="w-full flex justify-start ">
                    <p className="text-xs sm:text-base font-semibold py-1 rounded-lg ">
                      This is {user?.userName}'s bio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* posts and saved */}
          <div className="w-full   flex flex-col">
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
              {selectedLink === 'Posts' &&(
                <UserPosts userId={user?._id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
