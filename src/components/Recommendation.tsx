'use client';

import { User } from '@/app/interface/interface.declare';
import { RootState } from '@/app/redux/store';
import { loginSuccess, logout } from '@/app/redux/UserSlice';
import axios from 'axios';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Recommendation() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  // Fisher-Yates (Knuth) Shuffle algorithm to randomize an array
  const shuffleArray = (array: User[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Filter out current user and followed users
  const allUsersList = shuffleArray(
    allUsers.filter(
      (user: any) =>
        user._id !== currentUser?._id &&
        !currentUser?.following?.includes(user._id)
    )
  );

  const fetchAllUser = async () => {
    try {
      const res = await axios.get('/api/user');
      if (res.status === 200) {
        setAllUsers(res.data.user);
      }
    } catch (error) {
      console.log('Error fetching data');
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const handelLogout = async () => {
    try {
      const res = await axios.post('/api/user/logout');
      if (res.status === 200) {
        dispatch(logout());
        router.replace('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //handel follow user
  const handelFollowUser = async (id: string) => {
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
      <div className="w-full h-full flex justify-center">
        <div className="w-8/12 h-full">
          <div>
            <div>
              {/* current user info */}
              <div className="w-full flex justify-between items-center py-6">
                <div className="w-16 aspect-square rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={currentUser?.avatar}
                    alt=""
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{currentUser?.userName}</p>
                  <p>{currentUser?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-500 cursor-pointer" onClick={handelLogout}>Logout</p>
                </div>
              </div>
            </div>

            {/* suggestion users */}
            <div>
              <div>
                <p className="font-semibold text-gray-500">Suggested for you</p>
              </div>
              <div>
                {allUsersList.slice(0, 5).map((user) => (
                  <div className="" key={user._id}>
                    {/* suggested user info */}
                    <div className="w-full flex gap-2 justify-between items-center py-3">
                      <div className="w-10 aspect-square rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={user.avatar || '/avatar.png'}
                          alt=""
                        />
                      </div>
                      <div className="w-full flex gap-1">
                        <div className="text-sm w-4/5">
                          <p className="font-medium">{user?.userName}</p>
                          <p className="text-xs ">{user?.email}</p>
                        </div>
                        <div className="w-1/5">
                          <p className="text-sm font-semibold text-blue-500 cursor-pointer" onClick={()=>handelFollowUser(user._id)}>
                            Follow
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
