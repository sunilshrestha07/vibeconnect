'use client'

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Page() {
  const stories = useSelector((state: RootState) => state.stories.stories);

  return (
    <div className="w-full h-screen bg-red-400 flex justify-center overflow-hidden">
      <div className="w-1/2 h-full bg-green-500 flex flex-col">
        <div className="w-full h-full bg-blue-400 flex flex-col overflow-y-auto">
          {stories.map((story) => (
            <div className="w-full h-screen flex justify-center items-center" key={story._id}>
              <div className="w-full h-full overflow-hidden">
                <img
                  className='w-full h-full object-cover'
                  src={story.media.url}
                   // Add alt text for accessibility
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
