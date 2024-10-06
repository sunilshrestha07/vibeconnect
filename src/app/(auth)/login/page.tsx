'use client';

import { loginSuccess } from '@/app/redux/UserSlice';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  //handel login
  const handelLogin = async () => {
    const formdata = {
      email,
      password,
    };
    try {
      const res = await axios.post('/api/user/login', formdata);
      if (res.status === 200) {
        console.log(res.data.user);
        dispatch(loginSuccess(res.data.user));
      }
    } catch (error :any) {
      console.log(`Error login in ${error.message}`);
    }
  };
  return (
    <div className="flex w-full h-full bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8 font-Italianno">
              Vibeconnect
            </h1>
          </div>
          <form className="space-y-6" onClick={handelLogin}>
            <input
              type="text"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log in
            </button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full border border-gray-400 flex items-center justify-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Image
                  src="/icons/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span className="text-sm font-semibold text-blue-900">
                  Log in with Google
                </span>
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="#"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className=" lg:block hidden ml-8">
        <img className="w-full h-full object-cover" src="/iphone.png" alt="" />
      </div>
    </div>
  );
}
