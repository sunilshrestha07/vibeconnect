'use client';

import { removePost } from '@/app/redux/postSlice';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Posts() {
  const allpost = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [deleteModelActive, setDeleteModelActive] = useState(false);

  //handel post delete
  const handlePostDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/post/${id}`);
      if (res.status === 200) {
        dispatch(removePost(id));
      }
    } catch (error) {
      console.log('Error deleting post');
    }
  };

  //handel model show
  const handelDeleteModel = () => {
    setDeleteModelActive(!deleteModelActive);
  };

  return (
    <>
      <div className="w-full h-full ">
        <div className="w-full h-full flex flex-col gap-12 my-4  mb-10">
          {allpost &&
            allpost.length > 0 &&
            allpost.map((item) => (
              <div
                className=" w-full sm:aspect-[9/10]  relative border-[1px] border-gray-300 rounded-md py-2"
                key={item._id}
              >
                {/* top bar with user and delete option */}
                <div className=" flex items-center justify-between gap-3 px-2 py-1 ">
                  {/* user info */}
                  <div className=" flex  gap-3 items-center">
                    <div className=" w-10 aspect-square  overflow-hidden rounded-full">
                      <img
                        className=" w-full h-full object-cover"
                        src={item.user.avatar || '/avatar.png'}
                        alt="user avatar"
                      />
                    </div>
                    <p className=" text-sm font-semibold text-black">
                      {item.user.userName}
                    </p>
                    <p className=" text-xs font-semibold text-black">
                      {moment(item.createdAt).fromNow()}
                    </p>
                  </div>

                  <div className="  w-10 h-10 ">
                    {/* //if user show the delete option */}
                    {item.user._id === currentUser?._id ? (
                      <div className=" flex items-center justify-center w-full h-full ">
                        <img
                          className="w-5 cursor-pointer"
                          src="/icons/dots.png"
                          alt=""
                          onClick={handelDeleteModel}
                        />

                        {/* //delete option */}
                        {deleteModelActive && (
                          <div className="absolute top-0 right-10 ">
                            <p
                              className="font-semibold text-red-500 cursor-pointer"
                              onClick={() => handlePostDelete(item._id)}
                            >
                              Delete
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className=" flex items-center justify-center w-full h-full ">
                        <img
                          className="w-5 cursor-pointer"
                          src="/icons/dots.png"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* post image */}
                <div className="w-full aspect-[9/8]  overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item.media.url}
                    alt="post image"
                  />
                </div>

                {/* comment and like section */}
                <div className="w-full  flex gap-4 p-2">
                  <div className="">
                    <img className="w-6" src="/icons/like.png" alt="" />
                  </div>
                  <div className="">
                    <img className="w-6" src="/icons/comment.png" alt="" />
                  </div>
                </div>

                {/* dicription of the post */}
                {item.discription && (
                  <div className="p-2">
                    <p className=" font-medium text-sm sm:text-base">
                      {item.user.userName} {item.discription}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
