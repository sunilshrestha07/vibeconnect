'use client';

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { loginSuccess } from '@/app/redux/UserSlice';
import { app } from '@/app/firebase';
import Image from 'next/image';
import { useState } from 'react';

export default function Oauth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleClick = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const { email, displayName, photoURL } = resultFromGoogle.user;

      const userData = {
        email,
        userName: displayName,
        avatar: photoURL,
      };
      const res = await axios.post(`/api/user/googlelogin`, userData);
      if (res.status === 200) {
        dispatch(loginSuccess(res.data.user));
        router.replace('/');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(`Error login with Google: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="w-full border border-gray-400 flex items-center justify-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleGoogleClick}
      >
        <Image src="/icons/google.png" alt="Google" width={20} height={20} />
        <span className="text-sm font-semibold text-blue-900">
          Log in with Google
        </span>
      </button>
    </>
  );
}
