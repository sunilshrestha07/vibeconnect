'use client';

import { storage } from '@/app/firebase';
import { setIsEditNotActive } from '@/app/redux/editSlice';
import { RootState } from '@/app/redux/store';
import { loginSuccess } from '@/app/redux/UserSlice';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';

export interface userProfile {
  userName?: string;
  email?: string;
  avatar?: string;
  password?: string;
  bio?: string;
}
export default function EditProfile() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [profileData, setProfileData] = useState<userProfile>({});
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle media selection
  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  //oninput change
  const handelChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
 };

  // Handle image  upload to Firebase
  const handleMediaUploadToFirebase = async (): Promise<string | null> => {
    if (media) {
      const mediaRef = ref(storage, `media/${media.name + v4()}`);
      await uploadBytes(mediaRef, media);
      const firebaseUrl = await getDownloadURL(mediaRef);
      return firebaseUrl;
    }
    return null;
  };

  // Handle form submission
  const handelProfielEditSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      if(mediaUrl){
        const uploadedMediaUrl = await handleMediaUploadToFirebase();
        const updatedFormData={...profileData, avatar: uploadedMediaUrl}
        console.log(updatedFormData);

        const res = await axios.put(`/api/user/${currentUser?._id}`, updatedFormData);

        if (res.status === 200) {
          toast.success('Profile updated successfully');
          dispatch(loginSuccess(res.data.user));
          console.log(res.data.user);
          dispatch(setIsEditNotActive());
        }
      }else{
        const res = await axios.put(`/api/user/${currentUser?._id}`, profileData);

        if (res.status === 200) {
          toast.success('Profile updated successfully');
          dispatch(loginSuccess(res.data.user));
          console.log(res.data.user);
          dispatch(setIsEditNotActive());
        }
      }
    } catch (error: any) {
      console.error(`Error creating post: ${error.message}`);
      toast.error('Error updaitng profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen backdrop-brightness-50 flex justify-center items-center px-4 sm:px-10 ">
        <form
          className="w-full h-full flex justify-center items-center"
          onSubmit={handelProfielEditSubmit}
        >
          <div className="w-full sm:w-1/2  bg-white p-2 py-6 sm:py-6 sm:px-4 rounded-2xl">
            <div className="w-full h-full flex flex-col gap-4">
              <p className=" text-2xl sm:text-3xl font-semibold ">
                Edit Profile
              </p>
              {/* //profile section */}
              <div className=" flex justify-between items-center bg-gray-300 p-2 rounded-2xl ">
                <div className="flex gap-3 sm:gap-4 items-center  w-8/12 sm:w-9/12">
                  <div className=" w-16 sm:w-24 aspect-square bg-blue-400 rounded-full overflow-hidden flex items-center justify-center">
                    {mediaUrl ? (
                      <div className="w-full h-full">
                        <img
                          className="w-full h-full object-cover"
                          src={mediaUrl}
                          alt=""
                        />
                      </div>
                    ) : (
                      <div className="">
                        {currentUser?.avatar ? (
                          <img
                            className="w-full h-full object-cover"
                            src={currentUser?.avatar}
                            alt=""
                          />
                        ) : (
                          <p className=" text-3xl text-center font-semibold uppercase ">
                            {currentUser?.userName.slice(0, 2)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <p className=" text-sm sm:text-base font-semibold">
                      {currentUser?.userName}
                    </p>
                    <p className=" text-xs sm:text-base">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                <div className="">
                  <input
                    type="file"
                    accept="image/*"
                    name=""
                    id="avatar"
                    hidden
                    ref={mediaRef}
                    onChange={handleMedia}
                  />
                  <p
                    className=" text-start p-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg cursor-pointer"
                    onClick={() => mediaRef?.current?.click()}
                  >
                    Change photo
                  </p>
                </div>
              </div>

              {/* userName passowrd and email */}
              <div className="flex flex-col gap-2">
                <p className="  sm:text-xl font-semibold">
                  Personal Information
                </p>
                <div className=" grid grid-cols-2 gap-2">
                  <div className=" flex flex-col gap-1 col-span-1">
                    <label htmlFor="email">Username</label>
                    <input
                      className="w-full bg-gray-300 p-3 rounded-lg text-sm placeholder:text-black"
                      type="text"
                      name=""
                      id="userName"
                      placeholder={currentUser?.userName}
                      onChange={handelChanges}
                    />
                  </div>
                  <div className=" flex flex-col gap-1 col-span-1">
                    <label htmlFor="email">Password</label>
                    <input
                      className="w-full bg-gray-300 p-3 rounded-lg text-sm placeholder:text-black"
                      type="password"
                      name=""
                      id="password"
                      placeholder="**********"
                      onChange={handelChanges}
                    />
                  </div>
                </div>
                <div className="">
                  <div className=" flex flex-col gap-1 col-span-1">
                    <label htmlFor="email">Email</label>
                    <input
                      className="w-full bg-gray-300 p-3 rounded-lg text-sm placeholder:text-black"
                      type="email"
                      name=""
                      id="email"
                      placeholder={currentUser?.email}
                      onChange={ handelChanges}
                    />
                  </div>
                </div>
              </div>

              {/* //bio */}
              <div className=" flex flex-col gap-2">
                <p className="  sm:text-xl font-semibold ">Bio</p>
                <div className="w-full ">
                  <input
                    className="w-full bg-gray-300 p-3 rounded-lg placeholder:text-black"
                    type="text"
                    name=""
                    id="bio"
                    placeholder={
                      currentUser?.bio || `This is ${currentUser?.userName} bio`
                    }
                    onChange={handelChanges}
                  />
                </div>
              </div>

              {/* submit */}
              <div className="">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg text-xl font-semibold"
                >
                  {isLoading ? (
                    <div className="loader"></div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* //close button */}
        <div
          className=" absolute top-5 right-5 p-1 bg-white rounded-full"
          onClick={() => dispatch(setIsEditNotActive())}
        >
          <img className="w-6 sm:w-8" src="/icons/close.png" alt="" />
        </div>
      </div>
    </>
  );
}
