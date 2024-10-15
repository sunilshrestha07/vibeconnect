'use client';

import { addComments, updateComments } from '@/app/redux/commentSlice';
import { RootState } from '@/app/redux/store';
import axios, { all } from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function AddComment({selectedPostId,selectedPostUser}: {selectedPostId: string,selectedPostUser:string}) {
  const [comment, setComment] = useState<string>('');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  //handel commet submit
  const handelCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const notification = {
        notificationType: 'comment',
        notificationFor: selectedPostUser,
        notificationFrom: currentUser?._id,
        post: selectedPostId,
      };
      const formdata = {
        user:currentUser?._id,
        post:selectedPostId,
        comment
      }
      console.log(formdata);
      try {
        const res = await axios.post('/api/comment', formdata);
        if(res.status === 200) {
          setComment('');
          dispatch(addComments(res.data.comment));
        }
        // Send the 'like' notification
        const resn = await axios.post('/api/notification', notification);
        if (resn.status === 200) {
          console.log('Notification sent successfully');
        }
      } catch (error:any) {
        toast.error(error.message);
        console.log('Error adding comment:', error);
      }
  }
  return (
    <>
      <div className=" mt-1 w-full ">
        <form className='flex w-full justify-between' onSubmit={handelCommentSubmit}>
          <input
            className=" bg-transparent p-1 outline-none w-10/12 "
            type="text"
            name=""
            id="comment"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {comment.length > 0 && (
              <button type='submit' className='text-blue-500 pr-2 cursor-pointer'>Post</button>
          )}
        </form>
      </div>
    </>
  );
}
