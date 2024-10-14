'use client';

import { removePost, updatePost } from '@/app/redux/postSlice';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Posts() {
  const allpost = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [deleteModelActive, setDeleteModelActive] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>('');

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

  const handelDeleteModel = (id: string) => {
    setIdToDelete(id);
    setDeleteModelActive(!deleteModelActive || setIdToDelete === null);
  };

  const handelPostLikeAndUnlike = async (postId: string) => {
    if (!currentUser) return;

    // Optimistically update the UI
    const updatedPost = allpost.find(post => post._id === postId);
    if (updatedPost) {
      const isLiked = updatedPost.likes.includes(currentUser._id);
      const newLikes = isLiked
        ? updatedPost.likes.filter(id => id !== currentUser._id)
        : [...updatedPost.likes, currentUser._id];

      dispatch(updatePost({ ...updatedPost, likes: newLikes }));
    }

    // Sync with the server
    try {
      await axios.put(`/api/post/${postId}`, {
        userId: currentUser._id
      });
    } catch (error) {
      console.log('Error liking/unliking post');
      // Revert the optimistic update if the server request fails
      if (updatedPost) {
        dispatch(updatePost(updatedPost));
      }
    }
  }

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
                {/* ... (previous code for user info and delete option remains the same) ... */}

                {/* post image */}
                <div className="w-full aspect-[9/8]  overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item.media.url}
                    alt="post image"
                    onDoubleClick={() => handelPostLikeAndUnlike(item._id)}
                  />
                </div>

                {/* comment and like section */}
                <div className="w-full  flex gap-4 p-2">
                  <div className="">
                    {currentUser && item.likes.includes(currentUser._id) ? (
                      <img className="w-6 cursor-pointer" src="/icons/love.png" alt="" onClick={() => handelPostLikeAndUnlike(item._id)} />
                    ) : (
                      <img className="w-6 cursor-pointer " src="/icons/like.png" alt="" onClick={() => handelPostLikeAndUnlike(item._id)} />
                    )}
                  </div>
                  <div className="">
                    <img className="w-6" src="/icons/comment.png" alt="" />
                  </div>
                </div>

                {/* show the count of the likes */}
                <div className="px-2">
                  <p className=" font-medium text-sm sm:text-base">
                    {item.likes.length} likes
                  </p>
                </div>

                {/* description of the post */}
                {item.discription && (
                  <div className="p-2">
                    <p className=" font-medium text-sm sm:text-base">
                      {item.user.userName} {item.discription}
                    </p>
                  </div>
                )}

                {/* //show the count of the comments */}
                <div className="px-2">
                  <p className=" font-medium text-sm sm:text-base">
                    {item.comments.length} comments
                  </p>
                </div>

              </div>
            ))}
        </div>
      </div>
    </>
  );
}