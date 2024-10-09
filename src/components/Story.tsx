'use client';

import React, { useEffect, useState } from 'react';
import StoryCrousel from './StoryCrousel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import axios from 'axios';
import { StoryData } from '@/app/interface/interface.declare';
import { setStories } from '@/app/redux/storySlice';

export default function Story() {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const visibleItems = 7;
  const allstory = useSelector((state: RootState) => state.stories.stories);
  // const [allstory, setAllstory] = useState<StoryData[]>([]);
  const totalItems = allstory.length;
  const canGoNext = startIndex + visibleItems < totalItems;
  const canGoPrevious = startIndex > 0;
  const dispatch = useDispatch();

  const handleNext = () => {
    if (canGoNext) {
      setStartIndex((prevIndex) => prevIndex + visibleItems);
    } else {
      setStartIndex(0); // Reset to the start if there are no more items
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setStartIndex((prevIndex) => Math.max(prevIndex - visibleItems, 0));
    } else {
      setStartIndex(totalItems - visibleItems); // Go to the last items
    }
  };

  // Get displayed items based on current startIndex
  let displayedItems = allstory.slice(startIndex, startIndex + visibleItems);

  // Check if we need to add more items to fill visibleItems slots
  if (displayedItems.length < visibleItems) {
    const remainingItems = visibleItems - displayedItems.length;
    const additionalItems = allstory
      .slice(0, remainingItems)
      .filter((item) => !displayedItems.includes(item)); // Avoid duplicates
    displayedItems = [...displayedItems, ...additionalItems];
  }

  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/story');
      if (res.status === 200) {
        dispatch(setStories(res.data.allstory));
        // setAllstory(res.data.allstory);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);
  return (
    <div className="w-full h-full">
      <div className="w-full h-full pt-4 sm:pt-6 border-b-[1px] border-gray-300">
        {isLoading ? (
          <div className="w-full h-24 flex justify-between items-center">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"
              />
            ))}
          </div>
        ) : (
          <div className="relative w-full h-24 flex items-center justify-center">
            {canGoPrevious && (
              <button
                className="absolute top-[20%] left-0 bg-gray-400 rounded-full p-2 hidden sm:block"
                onClick={handlePrevious}
              >
                <img className="w-4" src="/left.png" alt="Previous" />
              </button>
            )}

            <div className="w-full h-full overflow-hidden">
              <div className="flex h-full justify-between items-center overflow-x-scroll sm:overflow-clip gap-3 sm:gap-0">
                {displayedItems.map((item) => (
                  <div
                    className="w-16 h-full"
                    key={item._id}
                    onClick={() => setSelectedStoryId(item._id)}
                  >
                    <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 cursor-pointer">
                      <img
                        className="w-full h-full object-cover object-center"
                        src={item.user?.avatar || '/avatar.png'}
                        alt="Story image"
                      />
                    </div>
                    <p className="text-center text-xs mt-1 truncate">
                      {item.user?.userName || 'Unknown User'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {canGoNext && (
              <button
                className="absolute top-[20%] right-0 bg-gray-400 rounded-full p-2 hidden sm:block"
                onClick={handleNext}
              >
                <img className="w-4" src="/right.png" alt="Next" />
              </button>
            )}
          </div>
        )}
      </div>

      {selectedStoryId !== null && (
        <div className="w-screen h-screen-[70vh] sm:h-screen top-12 sm:top-0 left-0 bg-black backdrop-blur-sm bg-opacity-75 flex items-center justify-center overflow-hidden fixed z-50">
          <StoryCrousel
            selectedStoryId={selectedStoryId}
            setSelectedStoryId={setSelectedStoryId}
          />
        </div>
      )}
    </div>
  );
}
