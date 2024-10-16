'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/app/redux/UserSlice';
import { loginFail } from '@/app/redux/UserSlice';
import { LoginInterface } from '@/app/interface/interface.declare';
import { setStories } from '@/app/redux/storySlice';
import { setPosts } from '@/app/redux/postSlice';
import Oauth from '@/components/Oauth';
import { setnotifications } from '@/app/redux/notificaitionDataSlice';
import { setComments } from '@/app/redux/commentSlice';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handelLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handelLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/user/login', formData);
      if (res.status === 200) {
        router.push('/');
        setIsLoading(false);
        dispatch(loginSuccess(res.data.user));
      }
    } catch (error: any) {
      setIsLoading(false);
      dispatch(loginFail(error));
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            'An unknown error occurred during login'
        );
      } else {
        toast.error('An unknown error occurred during login');
      }
    }
  };

  //pre fetching story and posts
  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/story');
      if (res.status === 200) {
        dispatch(setStories(res.data.allstory));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/post');
      if (res.status === 200) {
        dispatch(setPosts(res.data.allpost));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment');
      if (res.status === 200) {
        dispatch(setComments(res.data.allcomments));
        // console.log(res.data.allcomments);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notification');
      if (res.status === 200) {
        dispatch(setnotifications(res.data.notification));
      }
    } catch (error: any) {
      console.log('Error while fetching notifications', error.message);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchPosts();
    fetchComments();
    fetchNotifications();
  });

  

  
  return (
    <>
      <div className="">
        <div className=" relative w-full h-screen overflow-hidden">
          <div className=" w-full h-screen overflow-hidden object-cover ">
            <Image
              className="w-full h-full object-cover object-top  brightness-50"
              src="/bg2.png"
              alt="logo"
              width={1000}
              height={1000}
              quality={100}
            />
          </div>
          <div className="lg:w-1/2 xl:w-2/6 aspect-square md:aspect-[9/10] xl:aspect-[9/12] absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-3xl ">
            <div className=" flex flex-col font-medium text-xl sm:text-2xl md:text-3xl text-center py-5 sm:py-7 lg:py-10">
              Welcome back.
              <span className=" text-sm md:text-base">
                Log in and start connecting with people who matches your vibe.
              </span>
            </div>
            <div className=" px-10 ">
              <form
                className="flex flex-col gap-6"
                onSubmit={handelLoginSubmit}
              >
                <div className=" flex flex-col">
                  <label className="font-medium" htmlFor="">
                    Email
                  </label>
                  <input
                    className=" outline-1 outline outline-gray-500 px-5 py-2 font-medium text-xl rounded-lg"
                    type="email"
                    name=""
                    id="email"
                    onChange={handelLoginChange}
                  />
                </div>
                <div className=" flex flex-col">
                  <label className="font-medium" htmlFor="">
                    Password
                  </label>
                  <input
                    className=" outline-1 outline outline-gray-500 px-5 py-2 font-medium text-xl rounded-lg"
                    type="password"
                    name=""
                    id="password"
                    onChange={handelLoginChange}
                  />
                </div>
                <div className=" flex justify-center mt-5">
                  <button
                    type="submit"
                    className={`font-semibold text-xl  px-10 py-2 rounded-lg bg-black  text-white ${
                      isLoading ? 'cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className=" flex justify-center items-center px-3 py-">
                        <span className="loader"></span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
              <div className=" flex justify-center">
                <div className=" w-8/12 sm:w-1/2 mt-4">
                  <Oauth />
                </div>
              </div>
              <div className="">
                <p className="text-center mt-2">
                  <span className=" text-sm opacity-60">
                    <Link href="/login">Forgot your password?</Link>
                  </span>
                </p>
              </div>
              <div className="">
                <p className="text-center mt-5">
                  Don&apos;t have an account?{' '}
                  <span className=" font-semibold">
                    <Link href="/signup">Sign up</Link>
                  </span>
                </p>
              </div>
              <div className="  sm:pb-0">
                <p className="text-center mt-5">
                  By continuing to use Vibeconnect, you agree to our all{' '}
                  <span className=" font-semibold">Terms and Conditions</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
