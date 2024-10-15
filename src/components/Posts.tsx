'use client';

import { removePost, updatePost } from '@/app/redux/postSlice';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './Comments';
import { set } from 'mongoose';
import AddComment from './AddComment';

export default function Posts() {
  const allpost = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [deleteModelActive, setDeleteModelActive] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>('');
  const allcomments = useSelector(
    (state: RootState) => state.comments.comments
  );
  const [commentIsActive, setCommentIsActive] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

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

  const handelPostLikeAndUnlike = async (postId: string, userId: string) => {
    if (!currentUser) return;
  
    const notification = {
      notificationType: 'like',
      notificationFor: userId,
      notificationFrom: currentUser._id,
      post: postId,
    };
  
    // Optimistically update the UI
    const updatedPost = allpost.find((post) => post._id === postId);
    if (updatedPost) {
      const isLiked = updatedPost.likes.includes(currentUser._id);
  
      // If already liked, remove like and delete notification
      if (isLiked) {
        try {
          // Optimistically update likes in UI
          const newLikes = updatedPost.likes.filter((id) => id !== currentUser._id);
          dispatch(updatePost({ ...updatedPost, likes: newLikes }));
  
          // Sync with the server to unlike the post
          await axios.put(`/api/post/${postId}`, { userId: currentUser._id });
  
          // Delete the 'like' notification
          await axios.delete('/api/notification', { data: notification });
          console.log('Notification deleted successfully');
        } catch (error) {
          console.log('Error deleting notification or unliking post', error);
  
          // Revert optimistic update if an error occurs
          dispatch(updatePost(updatedPost));
        }
      } else {
        // If not liked, add like and send notification
        try {
          // Optimistically update likes in UI
          const newLikes = [...updatedPost.likes, currentUser._id];
          dispatch(updatePost({ ...updatedPost, likes: newLikes }));
  
          // Sync with the server to like the post
          await axios.put(`/api/post/${postId}`, { userId: currentUser._id });
  
          // Send the 'like' notification
          const res = await axios.post('/api/notification', notification);
          if (res.status === 200) {
            console.log('Notification sent successfully');
          }
        } catch (error) {
          console.log('Error sending notification or liking post', error);
  
          // Revert optimistic update if an error occurs
          dispatch(updatePost(updatedPost));
        }
      }
    }
  };
  

  //handel comment shwo and hide
  const handelCommentShowAndHide = (id: string) => {
    setCommentIsActive(!commentIsActive || selectedPostId !== id);
    setSelectedPostId(id);
  };

  return (
    <>
      <div className="w-full h-full ">
        <div className="w-full h-full flex flex-col gap-5 my-3  mb-10">
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
                          onClick={() => handelDeleteModel(item._id)}
                        />

                        {/* //delete option */}
                        {deleteModelActive && idToDelete === item._id && (
                          <div className="absolute top-5 right-16 ">
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
                    onDoubleClick={() =>
                      handelPostLikeAndUnlike(item._id, item.user._id)
                    }
                  />
                </div>

                {/* comment and like section */}
                <div className="w-full  flex gap-4 p-2">
                  <div className="">
                    {currentUser && item.likes.includes(currentUser._id) ? (
                      <img
                        className="w-6 cursor-pointer"
                        src="/icons/love.png"
                        alt=""
                        onClick={() =>
                          handelPostLikeAndUnlike(item._id, item.user._id)
                        }
                      />
                    ) : (
                      <img
                        className="w-6 cursor-pointer "
                        src="/icons/like.png"
                        alt=""
                        onClick={() =>
                          handelPostLikeAndUnlike(item._id, item.user._id)
                        }
                      />
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
                    <p className=" ">
                      <div className=" flex gap-3 text-start ">
                        <p className=' text-sm sm:text-base'><span className='font-medium '>{item.user.userName}</span> { ' '} {item.discription}</p>
                      </div>
                    </p>
                  </div>
                )}

                {/* comments section */}
                <div className="w-full px-2">
                  <p className=" font-normal text-sm sm:text-base">
                    {allcomments && allcomments.length > 0 && (
                      <div className="">
                        {
                          allcomments.filter(
                            (comment) => comment.post === item._id
                          ).length
                        }{' '}
                        comments
                      </div>
                    )}
                  </p>

                  {/* //all comments */}
                  <div className="">
                    <p
                      className="text-sm sm:text-base opacity-70 cursor-pointer"
                      onClick={() => handelCommentShowAndHide(item._id)}
                    >
                      View all comments
                    </p>
                    {commentIsActive && selectedPostId === item._id && (
                      <div className="">
                        <Comments selectedPostId={selectedPostId} />
                      </div>
                    )}
                  </div>

                  {/* add comment */}
                  <div className="w-full">
                    <AddComment selectedPostId={item._id} selectedPostUser={item.user._id} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
