'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { useRouter } from 'next/navigation';
import { updateReel } from '../redux/postSlice';
import axios from 'axios';
import ReactPlayer from 'react-player';

export default function Page() {
  const reels = useSelector((state: RootState) => state.posts.reels);
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [isMuted, setIsMuted] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState<string[]>([]);

  const handleSlideChange = (swiper: any) => {
    console.log(`Current slide index: ${swiper.activeIndex}`);
  };

  // Handle close
  const handleClose = () => {
    router.back();
  };

  //handel reel like
  const handelReelLikeAndUnlike = async (reelId: string, userId: string) => {
    if (!currentUser) return;

    const notification = {
      notificationType: 'like',
      notificationFor: userId,
      notificationFrom: currentUser._id,
      reel: reelId,
    };

    // Optimistically update the UI
    const updatedReel = reels.find((reel) => reel._id === reelId);
    if (updatedReel) {
      const isLiked = updatedReel.likes.includes(currentUser._id);

      // If already liked, remove like and delete notification
      if (isLiked) {
        try {
          // Optimistically update likes in UI
          const newLikes = updatedReel.likes.filter(
            (id) => id !== currentUser._id
          );
          dispatch(updateReel({ ...updatedReel, likes: newLikes }));

          // Sync with the server to unlike the post
          await axios.put(`/api/reel/${reelId}`, { userId: currentUser._id });

          // Delete the 'like' notification
          await axios.delete('/api/notification', { data: notification });
          console.log('Notification deleted successfully');
        } catch (error) {
          console.log('Error deleting notification or unliking post', error);

          // Revert optimistic update if an error occurs
          dispatch(updateReel(updatedReel));
        }
      } else {
        // If not liked, add like and send notification
        try {
          // Optimistically update likes in UI
          const newLikes = [...updatedReel.likes, currentUser._id];
          dispatch(updateReel({ ...updatedReel, likes: newLikes }));

          // Sync with the server to like the post
          await axios.put(`/api/reel/${reelId}`, { userId: currentUser._id });

          // Send the 'like' notification
          const res = await axios.post('/api/notification', notification);
          if (res.status === 200) {
            console.log('Notification sent successfully');
          }
        } catch (error) {
          console.log('Error sending notification or liking post', error);

          // Revert optimistic update if an error occurs
          dispatch(updateReel(updatedReel));
        }
      }
    }
  };
  const videoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    //toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Function to observe when video comes into view
  const observeVideo = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePostIds: string[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visiblePostIds.push(entry.target.id);
          }
        });
        setVisiblePosts(visiblePostIds);
      },
      { threshold: 0.5 } // Trigger when 50% of the video is in view
    );

    // Attach observer to each video container
    Object.values(videoRefs.current).forEach((videoRef) => {
      if (videoRef) {
        observer.observe(videoRef);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    observeVideo();
  }, [observeVideo]);

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
            speed={500}
            cssMode={false}
            onSlideChange={handleSlideChange}
            modules={[Mousewheel]}
            className="h-full w-full"
            initialSlide={0}
          >
            {reels.map((item, index) => (
              <SwiperSlide
                key={item._id}
                className="w-full h-full relative"
                onDoubleClick={() =>
                  handelReelLikeAndUnlike(item._id, item.user._id)
                }
                onClick={toggleMute}
              >
                {item.media.type === 'image' ? (
                  <img
                    className="w-full h-full object-cover object-center rounded-xl"
                    src={item.media.url}
                    alt={`Slide ${index + 1}`}
                  />
                ) : (
                  <div
                      className="w-full h-full object-cover relative"
                      onClick={toggleMute}
                      ref={(el) => {
                        videoRefs.current[item._id] = el; // Store the element in the ref
                      }}
                      id={item._id}
                    >
                      <ReactPlayer
                        url={item.media.url}
                        playing={visiblePosts.includes(item._id)}
                        // playing={true} // Auto play
                        loop={true} // Loop the video
                        controls={false}
                        muted={isMuted}
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload', // disable download button
                            },
                          },
                        }}
                        width="100%"
                        height="100%"
                        onDoubleClick={() =>
                          handelReelLikeAndUnlike(item._id, item.user._id)
                        }
                      />
                    </div>
                )}

                {/* //toggle mute */}
                <div className="absolute top-5 right-5 bg-white p-1 rounded-full">
                  {isMuted ? (
                    <img className="w-5" src="/icons/mute.png" alt="" />
                  ) : (
                    <img className="w-5" src="/icons/unmute.png" alt="" />
                  )}
                </div>

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
                      <p className="text-white font-semibold">
                        {item.user.userName}
                      </p>
                      <p className=" text-white">{item.discription}</p>
                    </div>
                  </div>
                </div>

                {/* //info about the rels like and comments */}
                <div className=" absolute top-[60%] translate-y-[-50%] right-3 z-50">
                  <div className=" flex flex-col gap-6">
                    {/* likes */}
                    <div
                      className=" flex flex-col justify-center items-center cursor-pointer"
                      onClick={() =>
                        handelReelLikeAndUnlike(item._id, item.user._id)
                      }
                    >
                      {currentUser && item.likes.includes(currentUser._id) ? (
                        <img
                          className="w-8 cursor-pointer"
                          src="/icons/love.png"
                          alt=""
                          onClick={() =>
                            handelReelLikeAndUnlike(item._id, item.user._id)
                          }
                        />
                      ) : (
                        <img
                          className="w-8 cursor-pointer "
                          src="/icons/wlike.png"
                          alt=""
                          onClick={() =>
                            handelReelLikeAndUnlike(item._id, item.user._id)
                          }
                        />
                      )}
                      <p className=" text-white">{item.likes.length}</p>
                    </div>
                    {/* likes */}
                    <div className="flex flex-col justify-center items-center">
                      <img className="w-8" src="/icons/ccomment.png" alt="" />
                      <p className=" text-white">{item.comments.length}</p>
                    </div>
                    {/* likes */}
                    <div className="flex flex-col justify-center items-center">
                      <img className="w-7" src="/icons/wsaved.png" alt="" />
                    </div>
                    {/* likes */}
                    <div className="flex flex-col justify-center items-center">
                      <img className="w-7" src="/icons/wdots.png" alt="" />
                    </div>
                  </div>
                </div>
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
