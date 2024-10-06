'use client';

import React, { useEffect, useState } from 'react';
import StoryCrousel from './StoryCrousel';
import { StoryData } from '@/app/interface/interface.declare';
import axios from 'axios';

export default function Story() {
  // const allstory: StoryData[] = [
  //   { id: 1, owner: '/profile.jpg', ownerName: 'Suneel', mediaContent: '/one.jpg' },
  //   { id: 2, owner: '/two.jpg', ownerName: 'samir', mediaContent: '/two.jpg' },
  //   { id: 3, owner: '/three.jpg', ownerName: 'lama', mediaContent: '/three.jpg' },
  //   { id: 4, owner: '/four.jpg', ownerName: 'sdfjskhdjfh', mediaContent: '/four.jpg' },
  //   { id: 5, owner: '/profile.jpg', ownerName: 'sdjfhksjd', mediaContent: '/one.jpg' },
  //   { id: 6, owner: '/two.jpg', ownerName: 'suruya', mediaContent: '/two.jpg' },
  //   { id: 7, owner: '/profile.jpg', ownerName: 'Suneel', mediaContent: '/one.jpg' },
  //   { id: 8, owner: '/two.jpg', ownerName: 'dmani', mediaContent: '/two.jpg' },
  //   { id: 9, owner: '/three.jpg', ownerName: 'damin', mediaContent: '/three.jpg' },
  //   { id: 10, owner: '/four.jpg', ownerName: 'flahgks', mediaContent: '/four.jpg' },
  //   { id: 11, owner: '/profile.jpg', ownerName: 'signs', mediaContent: '/one.jpg' },
  //   { id: 12, owner: '/two.jpg', ownerName: 'Suneel', mediaContent: '/two.jpg' },
  // ];
  const [allstory, setAllstory] = useState<StoryData[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null); // Use id for selection
  const visibleItems = 7;
  const totalItems = allstory.length;
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  //fetching all the stories
  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/story');
      setAllstory(res.data.allstory);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStories();
  }, []);


  return (
    <div className="w-full h-full  ">
      <div className="w-full h-full py-4 sm:py-6">
        { isLoading ? (
          <div className="">
            {/* if the story is loading then shwo the animaton Story */}
            <div className="w-full  h-24 flex justify-between items-center">
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
              <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 animate-pulse bg-gray-400"></div>
            </div>
          </div>
        ) : (
          <div className="relative w-full  h-24 flex items-center justify-center ">
            {/* Left Arrow */}
            {canGoPrevious && (
              <button
                className="absolute top-[20%]  left-0 bg-gray-400 rounded-full p-2 hidden sm:block"
                onClick={handlePrevious}
              >
                <img className="w-4" src="/left.png" alt="Previous" />
              </button>
            )}

            {/* Story items */}
            <div className="w-full h-full overflow-hidden">
              <div className="flex h-full justify-between items-center overflow-x-scroll sm:overflow-clip gap-3 sm:gap-0">
                {displayedItems.map((item) => (
                  <div
                    className="w-16 h-full"
                    key={item.id}
                    onClick={() => setSelectedStoryId(item.id)} // Use item.id instead of index
                  >
                    <div className="w-16 aspect-square overflow-hidden rounded-full object-center flex-shrink-0 border-[3px] border-gray-600 cursor-pointer">
                      <img
                        className="w-full h-full object-cover"
                        src={item.media.url}
                        alt="Story image"
                      />
                    </div>
                    <p className="text-center text-xs mt-1">
                      {item.user.userName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            {canGoNext && (
              <button
                className="absolute top-[20%]  right-0 bg-gray-400 rounded-full p-2 hidden sm:block"
                onClick={handleNext}
              >
                <img className="w-4" src="/right.png" alt="Next" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Show the StoryCrousel when a story is clicked */}
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
