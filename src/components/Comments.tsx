'use client';

import { removeComments } from '@/app/redux/commentSlice';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import moment from 'moment';
import React, { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Comments({
  selectedPostId,
}: {
  selectedPostId: string;
}) {
  const allComments = useSelector(
    (state: RootState) => state.comments.comments
  );
  const specificComment = allComments.filter(
    (comment) => comment.post === selectedPostId
  );

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  //handel comment delte 
  const handelCommentDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/comment/${id}`);
      dispatch(removeComments(id));
      if(res.status === 200) {
        console.log('Comment deleted successfully');
        dispatch(removeComments(id));
      }
    } catch (error:any) {
      toast.error('Error deleting comment');
      console.log(`Error delting comment: ${error.message}`);
    }
  }
  return (
    <>
      <div className=" w-full   mt-4">
        {specificComment.length > 0 &&
          specificComment.map((comment) => (
            <div
              className=" my-4 border-[1px] border-gray-300 rounded-lg px-1 py-2 drop-shadow-md"
              key={comment._id}
            >
              <div className="w-full flex justify-between items-center ">
                {/* profile section */}
                <div className=" flex gap-2 items-center">
                  <div className="">
                    <img
                      className="w-8 h-8 rounded-full object-center"
                      src={comment.user?.avatar || currentUser?.avatar}
                      alt=" user avatar"
                    />
                  </div>
                  <p className="text-sm font-normal">
                    {comment.user?.userName || currentUser?.userName}
                  </p>
                  <p className=" text-xs font-thin opacity-70">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
                <div className=" pr-3">
                  <img className="w-5 cursor-pointer" src="/icons/bin.png" alt=""  onClick={() => handelCommentDelete(comment._id)}/>
                </div>
              </div>
              {/* //comments section */}
              <div className="w-full mt-1 px-2">
                <p className="w-full break-words overflow-wrap">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
