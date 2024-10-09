import { RootState } from '@/app/redux/store';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

export default function UserSaved() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const posts = useSelector((state: RootState) => state.posts.posts);

  //filtered posts
  const userSaved = posts.filter((post) => post.user._id === currentUser?._id);
    // const userSaved = 0
  return (
    <>
      <div className="w-full h-full ">
        <div className=" w-full  col-span-1">
          {userSaved.length < 0 ? (
            <div className=" w-full grid grid-cols-3 gap-1">
              {userSaved.map((post) => (
                <div
                  className="w-full aspect-[10/11] overflow-hidden col-span-1 relative group"
                  key={post._id}
                >
                  <Image
                    src={post.media.url}
                    className="w-full h-full object-cover"
                    alt="post image"
                    width={500}
                    height={500}
                    quality={80}
                  />
                  {/* The hidden div that appears on hover */}
                  <div className="absolute top-0 left-0 w-full h-full backdrop-brightness-75 flex justify-center items-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm sm:text-xl">
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center justify-center">
                        <img className=" w-4 sm:w-6" src="/icons/love.png" alt="" />
                        <p>{post.likes.length}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <img className=" w-5 sm:w-7" src="/icons/ccomment.png" alt="" />
                        <p>{post.comments.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className=" w-full flex justify-center text-base sm:text-2xl">
              <p>No Saved</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
