'use client';

import React, { useEffect, useState } from 'react';
import StoryCrousel from './StoryCrousel';
import { StoryData } from '@/app/interface/interface.declare';
import axios from 'axios';

export default function Story() {
  const [allstory, setAllstory] = useState<StoryData[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null); // Changed to string | null
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const visibleItems = 7;
  const totalItems = allstory.length;
  const canGoNext = startIndex + visibleItems < totalItems;
  const canGoPrevious = startIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setStartIndex((prevIndex) => prevIndex + visibleItems);
    } else {
      const remainingItems = totalItems - startIndex;
      if (remainingItems < visibleItems) {
        setStartIndex(totalItems - visibleItems);
      }
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setStartIndex((prevIndex) => Math.max(prevIndex - visibleItems, 0));
    }
  };

  let displayedItems = allstory.slice(startIndex, startIndex + visibleItems);
  const remainingItems = visibleItems - displayedItems.length;

  if (remainingItems > 0 && startIndex + visibleItems >= totalItems) {
    displayedItems = [...displayedItems, ...allstory.slice(0, remainingItems)];
  }

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/story');
      setAllstory(res.data.allstory);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full py-4 sm:py-6">
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
                    onClick={() => setSelectedStoryId(item._id)} // Use item.id which is a string
                  >
                    <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 cursor-pointer">
                      <img
                        className="w-full h-full object-cover"
                        src={item.user?.avatar || '/path-to-fallback-image.png'}
                        alt="Story image"
                      />
                    </div>
                    <p className="text-center text-xs mt-1">
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
        <div className="w-screen h-screen-[70vh] sm:h-screen  top-12 sm:top-0 left-0 bg-black backdrop-blur-sm bg-opacity-75 flex items-center justify-center overflow-hidden fixed">
          <StoryCrousel
            allstory={allstory}
            selectedStoryId={selectedStoryId} // Pass selectedStoryId instead of selectedStoryIndex
            setSelectedStoryId={setSelectedStoryId} // pass the state setter to close the carousel
          />
        </div>
      )}
    </div>
  );
}
