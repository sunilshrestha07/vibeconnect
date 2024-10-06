'use client';

import { useEffect } from 'react';
import './globals.css';
import SideMenu from '@/components/SideMenu';
import Topbar from '@/components/Topbar';
import Footbar from '@/components/Footbar';
import { useRouter } from 'next/navigation';
import ReduxProvider from './redux/reduxProvider'; // Redux provider component
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <ReduxProvider>
          <RootContent>{children}</RootContent>
        </ReduxProvider>
      </body>
    </html>
  );
}

function RootContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.user.currentUser?.userName);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="">
      <div className="w-full h-screen relative">
        {/* Topbar for small screens, fixed at the top */}
        {isAuthenticated && (
          <div className="w-full fixed top-0 z-50 sm:hidden bg-white">
            <Topbar />
          </div>
        )}

        <div className="w-full h-full grid grid-cols-11 pt-12 sm:pt-0">
          {/* Sidemenu for larger screens */}
          {isAuthenticated && (
            <div className="w-full h-screen overflow-hidden bg-gray-200 hidden sm:flex sm:col-span-1 xl:col-span-2 border-r-[1px] border-gray-300">
              <SideMenu />
            </div>
          )}

          {/* Main content, scrolling only this section */}
          {isAuthenticated && (
            <div className="w-full h-screen bg-gray-200 col-span-11 sm:col-span-10 xl:col-span-9 px-2 sm:px-4  grid grid-cols-8 overflow-auto">
              {isAuthenticated && (
                <div className="w-full h-full col-span-8 xl:col-span-5 sm:pr-5 overflow-y-auto">
                  {children}
                </div>
              )}
              <div className="w-full h-full bg-gray-200 hidden xl:col-span-3 border-2 border-gray-400">
                sdfj
              </div>
            </div>
          )}

          {/* if not isAuthenticated */}
          {!isAuthenticated && <div className="w-screen h-[95%] sm:h-screen ">{children}</div>}
        </div>

        {/* Footbar for small screens, fixed at the bottom */}
        {isAuthenticated && (
          <div className="w-full fixed bottom-0 left-0 z-50 sm:hidden border-t-2 border-gray-300">
            <Footbar />
          </div>
        )}
      </div>
    </div>
  );
}
