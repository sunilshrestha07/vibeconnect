'use client';

import { RootState } from '@/app/redux/store';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Posts() {
  const allpost = useSelector((state: RootState) => state.posts.posts);
  return (
    <>
      <div className="w-full h-full ">
        <div className="w-full h-full flex flex-col gap-12  mb-10">
          {allpost &&
            allpost.length > 0 &&
            allpost.map((item) => (
              <div
                className=" w-full sm:aspect-[9/10]  relative"
                key={item._id}
              >
                {/* user info */}
                <div className=" flex items-center gap-3 px-2 py-1">
                  <div className=" w-10 aspect-square  overflow-hidden rounded-full">
                    <img
                      className=" w-full h-full object-cover"
                      src={item.user.avatar}
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
                  <div className="">
                    <p className=" font-medium text-sm sm:text-base">
                      {item.user.userName} {item.discription}
                    </p>
                  </div>
                )}

                {/* //if user show the delete option */}
                <div className="absolute top-2 right-2 ">
                  <img className="w-5" src="/icons/dots.png" alt="" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
