import type { Metadata } from 'next';
import './globals.css';
import SideMenu from '@/components/SideMenu';
import Topbar from '@/components/Topbar';
import Footbar from '@/components/Footbar';

export const metadata: Metadata = {
  title: 'VibeConnect',
  description: 'Connect with different people who matches your vibe',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="w-full h-screen relative">
          {/* Topbar for small screens, fixed at the top */}
          <div className="w-full fixed top-0 z-50 sm:hidden">
            <Topbar />
          </div>

          <div className="w-full h-full grid grid-cols-11 pt-12 sm:pt-0">
            {/* Sidemenu for larger screens */}
            <div className="w-full h-screen overflow-hidden bg-white hidden sm:flex sm:col-span-1 xl:col-span-2">
              <SideMenu />
            </div>

            {/* Main content */}
            <div className="w-full h-full bg-green-500 col-span-11 sm:col-span-10 xl:col-span-9">
              {children}
            </div>
          </div>

          {/* Footbar for small screens, fixed at the bottom */}
          <div className="w-full fixed bottom-0 left-0 z-50 sm:hidden">
            <Footbar />
          </div>
        </div>
      </body>
    </html>
  );
}
