'use client';

import Footbar from '@/components/Footbar';
import SideMenu from '@/components/SideMenu';
import Topbar from '@/components/Topbar';
import './globals.css';
import ReduxProvider from './redux/reduxProvider';
import { usePathname } from 'next/navigation';
import Recommendation from '@/components/Recommendation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="colored"
          />

          {/* Conditionally render layout based on the current page */}
          {pathname === '/login' ||
          pathname === '/signup' ||
          pathname === '/verify' ? (
            <div className="w-full h-screen overflow-hidden">{children}</div>
          ) : (
            <div className="w-full h-screen relative">
              {/* Topbar for small screens */}
              <div className="w-full fixed top-0 z-50 sm:hidden bg-white">
                <Topbar />
              </div>

              <div className="w-full h-full grid grid-cols-11 pt-12 sm:pt-0">
                {/* Sidemenu for larger screens */}
                <div className="w-full h-screen overflow-hidden bg-gray-200 hidden sm:flex sm:col-span-1 lg:col-span-2 border-r-[1px] border-gray-300">
                  <SideMenu />
                </div>

                {/* Main content */}
                <div className="w-full h-screen bg-gray-200 col-span-11 sm:col-span-10 lg:col-span-9 grid grid-cols-8 overflow-auto">
                  <div
                    className={`${
                      pathname === '/'
                        ? 'w-full h-full col-span-8 xl:col-span-5 sm:pr-5 overflow-y-auto px-2 sm:px-4'
                        : 'w-full h-full col-span-8 '
                    }`}
                  >
                    {children} {/* Page content will be rendered here */}
                  </div>

                  <div
                    className={`${
                      pathname === '/' ? 'w-full h-full col-span-3 hidden xl:block' : 'hidden'
                    }`}
                  >
                    <Recommendation />
                  </div>
                </div>
              </div>

              {/* Footbar for small screens */}
              <div className="w-full fixed bottom-0 left-0 z-50 sm:hidden border-t-2 border-gray-300">
                <Footbar />
              </div>
            </div>
          )}
        </ReduxProvider>
      </body>
    </html>
  );
}
