'use client';

import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import axios from 'axios';
import { setPosts } from '../redux/postSlice';
import { addStory, setStories } from '../redux/storySlice';

export default function Page() {
  const mediaRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [selectedPostType, setSelectedPostType] = useState<string>('post'); // State for selected radio option
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [discription, setDiscription] = useState<string>('');
  const dispatch = useDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );

  // Handle close
  const handleClose = () => {
    router.replace('/');
  };

  // Handle media selection
  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          if (video.duration <= 30) {
            setMedia(file);
            setMediaUrl(URL.createObjectURL(file));
          } else {
            alert('Video length should be less than 30 seconds.');
          }
        };
      } else if (file.type.startsWith('image/')) {
        setMedia(file);
        setMediaUrl(URL.createObjectURL(file)); // Create preview URL for selected media
      } else {
        alert('Unsupported media type.');
      }
    }
  };

  // Handle post type change
  const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPostType(e.target.value);
  };

  // Handle image or video upload to Firebase
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
  const handleMediaUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedMediaUrl = await handleMediaUploadToFirebase();
      if (!uploadedMediaUrl) {
        throw new Error('Media upload failed');
      }

      const updatedFormData = {
        user: currentUserId,
        media: {
          url: uploadedMediaUrl,
          type: media?.type === 'video/mp4' ? 'video' : 'image',
        },
        discription: discription,
      };

      // // POST request to the backend API based on post type (post/reel/story)
      const res = await axios.post(`/api/${selectedPostType}`, updatedFormData);

      if (res.status === 200) {
        router.push('/');
      }
    } catch (error: any) {
      console.error(`Error creating post: ${error.message}`);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleMediaUpload}>
        <div className="w-screen h-screen overflow-hidden fixed top-0 left-0">
          <div className="w-full h-full flex justify-center items-center backdrop-blur-md backdrop-brightness-50 relative">
            <div className="w-full sm:w-1/2 md:w-[45%] xl:w-[35%] h-[80%] sm:h-[75%] bg-gray-100 flex justify-center items-center relative rounded-xl">
              <input
                type="file"
                accept="image/*, video/*"
                ref={mediaRef}
                hidden
                onChange={handleMedia}
              />

              {mediaUrl ? (
                <div>
                  {/* Media Preview */}
                  <div className="flex justify-center items-center">
                    {media && media.type.startsWith('image/') ? (
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-1/2 aspect-[9/12] object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        controls
                        className="w-1/2 aspect-[9/12] object-cover rounded-md"
                      />
                    )}
                  </div>

                  {selectedPostType === 'post' || selectedPostType === 'reel' && (
                    <div className=" w-full px-6">
                      <textarea
                        className="w-full h-16 p-2 rounded-xl mt-3"
                        placeholder="Discription"
                        value={discription}
                        onChange={(e) => setDiscription(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex justify-center mt-2">
                    <button
                      type="submit"
                      className={`${
                        isLoading
                          ? 'bg-blue-500 px-12 py-2 rounded-xl'
                          : 'bg-blue-500 px-6 py-2 rounded-xl'
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="loader"></div>
                      ) : (
                        <p>Upload</p>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-5">
                  <img
                    className="w-20"
                    src="/icons/story.png"
                    alt="story icon"
                  />
                  <div
                    className="text-xl font-semibold text-white cursor-pointer"
                    onClick={() => mediaRef.current?.click()}
                  >
                    <p className="bg-blue-500 px-5 py-2 rounded-xl">
                      Select from Computer
                    </p>
                  </div>
                </div>
              )}

              {/* Radio options for Post, Reel, Story */}
              <div className="w-1/2 h-8 bg-gray-700 top-2 rounded-md left-2 absolute flex items-center justify-around p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="posttype"
                    id="post"
                    value="post"
                    checked={selectedPostType === 'post'}
                    onChange={handlePostTypeChange}
                  />
                  <label htmlFor="post" className="text-white">
                    Post
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="posttype"
                    id="reel"
                    value="reel"
                    checked={selectedPostType === 'reel'}
                    onChange={handlePostTypeChange}
                  />
                  <label htmlFor="reel" className="text-white">
                    Reel
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="posttype"
                    id="story"
                    value="story"
                    checked={selectedPostType === 'story'}
                    onChange={handlePostTypeChange}
                  />
                  <label htmlFor="story" className="text-white">
                    Story
                  </label>
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="absolute top-2 right-4">
              <div
                className="w-10 aspect-square bg-gray-100 rounded-full flex justify-center items-center cursor-pointer"
                onClick={handleClose}
              >
                <img className="w-8" src="/icons/close.png" alt="Close" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
