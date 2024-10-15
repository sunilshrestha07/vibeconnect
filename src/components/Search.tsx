'use client';

import { User } from '@/app/interface/interface.declare';
import { RootState } from '@/app/redux/store';
import { loginSuccess } from '@/app/redux/UserSlice';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Search() {
  const [allUsersData, setAllUsersData] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const allUsers = allUsersData.filter((user) =>
    user.userName.toLowerCase().startsWith(searchInput.toLowerCase())
  );

  //fetching all the users
  const fetchAllUser = async () => {
    try {
      const res = await axios.get('/api/user');
      if (res.status === 200) {
        setAllUsersData(res.data.user);
      }
    } catch (error) {
      console.log('Error fetching data');
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  //handel follow user
  const handelFollowUser = async (id: string) => {
    const notification = {
      notificationType: 'follow',
      notificationFor: id,
      notificationFrom: currentUser?._id,
    };
    const formdata = {
      followingUserId: id,
    };
    try {
      const res = await axios.put(
        `/api/user/follow/${currentUser?._id}`,
        formdata
      );
      if (res.status === 200) {
        dispatch(loginSuccess(res.data.user));
        console.log(res.data.user);
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
      <div className="w-full h-screen ">
        <div className="w-full  sm:w-11/12 md:w-2/3 xl:w-1/2 h-screen sm:bg-none grid sm:grid-cols-3 fixed">
          <div className="col-span-2 w-full h-screen bg-gray-300">
            <div className="pt-5 px-3">
              <p className="text-2xl font-semibold">Search</p>
            </div>
            <div className="w-full flex justify-start px-3 items-center py-5 border-b-[1px] border-gray-400">
              <div className="w-11/12">
                <input
                  className="w-full p-[10px] rounded-xl bg-gray-100 outline-none"
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            {/* Showing the search results */}
            <div className="px-3">
              <div>
                {searchInput &&
                  allUsers.map((user) => (
                    <div key={user._id}>
                      <div className="w-full flex gap-2 justify-between items-center py-3 cursor-pointer">
                        <div className="w-10 aspect-square rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={user.avatar || '/avatar.png'}
                            alt={user.userName}
                          />
                        </div>
                        <div className="w-full flex gap-1">
                          <div className="text-sm w-4/5">
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-xs">{user.email}</p>
                          </div>
                          {/* <div className="w-1/5">
                            <p
                              className="cursor-pointer font-normal"
                              onClick={() => handelFollowUser(user._id)}
                            >
                              {currentUser?.following?.includes(user._id)
                                ? 'Following'
                                : 'Follow'}
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="col-span-1 bg-transparent"></div>
        </div>
      </div>
    </>
  );
}
