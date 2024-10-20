'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import axios from 'axios';
import { RootState } from '@/app/redux/store';
import { storage } from '@/app/firebase';
import ReactPlayer from 'react-player';
import Comments from '@/components/Comments';
import AddComment from '@/components/AddComment';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const allpost = useSelector((state: RootState) => state.posts.posts);
  const selectedPost = allpost.find((post) => post._id === id);
  const [isMuted, setIsMuted] = useState(true);
  const comments = useSelector((state: RootState) => state.comments.comments);
  const relatedComments = comments.filter(
    (comment) => comment._id === selectedPost?._id
  );

  // Handle close
  const handleClose = () => {
    router.back();
  };

  //toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <div className="w-screen h-screen overflow-y-scroll fixed top-0 left-0">
        <div className="w-full h-full flex justify-center items-center backdrop-blur-md backdrop-brightness-50 relative bg-white sm:bg-transparent">
          <div className=" sm:w-9/12 sm:aspect-video bg-gray-100  justify-center items-center relative rounded-xl grid grid-rows-5 sm:grid-rows-none sm:grid-cols-5">
            <div className=" w-full h-full row-span-3  sm:col-span-3 overflow-hidden p-2 ">
              {selectedPost?.media.type === 'image' ? (
                <img
                  className="w-full h-full object-cover"
                  src={selectedPost?.media.url}
                  alt="post image"
                />
              ) : (
                <div className="w-full h-full relative" onClick={toggleMute}>
                  <ReactPlayer
                    url={selectedPost?.media.url}
                    playing
                    loop={true} // Loop the video
                    controls={false}
                    muted={isMuted}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload', // disable download button
                        },
                      },
                    }}
                    width="100%"
                    height="100%"
                  />
                  <div className="absolute top-5 right-5 bg-white p-1 rounded-full">
                    {isMuted ? (
                      <img className="w-5" src="/icons/mute.png" alt="" />
                    ) : (
                      <img className="w-5" src="/icons/unmute.png" alt="" />
                    )}
                  </div>
                </div>
              )}
              {/* <p>{selectedPost?._id}</p> */}
            </div>
            <div className=" w-full h-full row-span-2  sm:col-span-2">
              <div className="">
                {/* //userinfo */}
                <div className="w-full p-2 flex justify-between items-center border-b-2 border-gray-300">
                  <div className="w-full flex gap-2 items-center ">
                    <div className=" w-12 aspect-square rounded-full overflow-hidden">
                      {selectedPost?.user.avatar ? (
                        <img
                          className="w-full h-full object-cover"
                          src={selectedPost?.user.avatar}
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">
                          <p>{selectedPost?.user.userName.slice(0, 2)}</p>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <p className="font-semibold">
                        {selectedPost?.user.userName}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <img className="w-6" src="/icons/dots.png" alt="" />
                  </div>
                </div>

                {/* //caption */}
                <div className="w-full flex items-center p-2">
                  <div className="w-2/12 flex items-center ">
                    <div className=" w-12 aspect-square rounded-full overflow-hidden">
                      {selectedPost?.user.avatar ? (
                        <img
                          className="w-full h-full object-cover"
                          src={selectedPost?.user.avatar}
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">
                          <p>{selectedPost?.user.userName.slice(0, 2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-10/12  flex gap-2">
                    <p className="font-semibold">
                      {selectedPost?.user.userName}
                    </p>
                    <p className="font-normal">{selectedPost?.discription}</p>
                  </div>
                </div>

                <div className="w-full flex-col justify-between">
                  {/* //comments */}
                  <div className="">
                    {selectedPost && (
                      <Comments selectedPostId={selectedPost?._id} />
                    )}
                  </div>

                  {/* //add comment */}
                  <div className="">
                    {selectedPost && (
                      <AddComment
                        selectedPostId={selectedPost._id}
                        selectedPostUser={selectedPost.user._id}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="absolute top-2 right-4">
            <div
              className="w-10 aspect-square bg-gray-100 rounded-full flex justify-center items-center cursor-pointer"
              onClick={handleClose}
            >
              <img className="w-8" src="/icons/close.png" alt="Close" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
