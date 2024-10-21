'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { useRouter } from 'next/navigation';

export default function Page() {
  const stories = useSelector((state: RootState) => state.stories.stories);
  const router = useRouter();

  const handleSlideChange = (swiper: any) => {
    console.log(`Current slide index: ${swiper.activeIndex}`);
  };

  // Handle close
  const handleClose = () => {
    router.back();
  };

  return (
    <div className="w-full h-screen-minus-2rem sm:h-screen flex justify-center overflow-hidden bg-black relative">
      <div className="sm:w-2/5 h-full flex flex-col">
        <div className="w-full h-full flex flex-col overflow-hidden sm:p-6">
          <Swiper
            loop={true}
            direction="vertical"
            spaceBetween={10}
            slidesPerView={1}
            mousewheel={true}
            speed={800}
            cssMode={false}
            onSlideChange={handleSlideChange}
            modules={[Mousewheel]}
            className="h-full w-full"
            initialSlide={0}
          >
            {stories.map((item, index) => (
              <SwiperSlide key={item._id} className="w-full h-full relative">
                {item.media.type === 'image' ? (
                  <img
                  className="w-full h-full object-cover object-center rounded-xl"
                  src={item.media.url}
                  alt={`Slide ${index + 1}`}
                />
                ):(
                  <video
                    className="w-full h-full object-cover object-center rounded-xl"
                    src={item.media.url}
                    autoPlay
                    loop
                    muted
                  />
                )}

                {/* User information */}
                <div className="absolute bottom-0 left-0 flex gap-2 w-full z-50 px-3 py-5 backdrop-brightness-75 backdrop-blur-sm">
                  <div className="w-full flex items-center gap-2">
                    <div className="w-12 aspect-square rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={item.user.avatar}
                        alt={item.user.userName}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-semibold">{item.user.userName}</p>
                      <p className=' text-white'>This is discription</p>
                    </div>
                  </div>
                </div>

                {/* //info about the rels like and comments */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Close button */}
      <div className="absolute top-4 right-4 z-50">
        <div
          className="w-8 sm:w-10 aspect-square bg-white rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleClose}
        >
          <img className="w-6 sm:w-8" src="/icons/close.png" alt="Close" />
        </div>
      </div>

      {/* Reels title */}
      <div className="absolute top-4 left-4 z-50">
        <p className="text-2xl font-semibold text-white">Reels</p>
      </div>
    </div>
  );
}
