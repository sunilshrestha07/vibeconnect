import { StoryData } from '@/app/interface/interface.declare';
import React, { useState, useEffect } from 'react';

interface StoryCrouselProps {
  allstory: StoryData[];
  selectedStoryId: number;
  setSelectedStoryId: (id: number | null) => void;
}

export default function StoryCrousel({
  allstory,
  selectedStoryId,
  setSelectedStoryId,
}: StoryCrouselProps) {
  const totalItems = allstory.length;

  const selectedIndex = allstory.findIndex(
    (story) => story.id === selectedStoryId
  );
  const currentStory = allstory[selectedIndex];

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % totalItems;
    setSelectedStoryId(allstory[nextIndex].id);
    setProgress(0); // Reset progress
  };

  const handlePrevious = () => {
    const previousIndex = (selectedIndex - 1 + totalItems) % totalItems;
    setSelectedStoryId(allstory[previousIndex].id);
    setProgress(0); // Reset progress
  };

  const [comment, setComment] = useState<string>('');
  const [progress, setProgress] = useState<number>(0); // Track progress percentage

  const handelCommentSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(comment);
    setComment('');
  };

  // Auto-change story every 5 seconds and show progress
  useEffect(() => {
    const intervalTime = 50; // Update progress every 50ms
    const progressStep = (intervalTime / 5000) * 100; // Calculate step size for 5 seconds (5000ms)

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          handleNext(); // When progress reaches 100%, move to next story
          return 0; // Reset progress for the next story
        }
        return prevProgress + progressStep;
      });
    }, intervalTime);

    return () => clearInterval(timer); // Cleanup on unmount or when selectedStoryId changes
  }, [selectedStoryId]);

  return (
    <div className="w-full h-full overflow-hidden flex justify-center">
      {/* Current Story */}
      <div className="w-full sm:1/2 md:w-2/5 xl:w-1/3 h-full col-span-3 border-[1px] border-gray-600 relative">
        {/* owner info */}
        <div className="">
          <div className="absolute top-2 left-2 flex gap-2 items-center">
            <div className="w-12 aspect-square rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={currentStory.user.avatar}
                alt=""
              />
            </div>
            <p className="font-semibold text-white ">
              {currentStory.user.userName}
            </p>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          className="absolute top-[50%] left-4 bg-gray-200 rounded-full p-1"
          onClick={handlePrevious}
        >
          <img className="w-4" src="/left.png" alt="Previous" />
        </button>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-300 absolute top-0 left-0">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }} // Dynamic width based on progress
          ></div>
        </div>

        {/* story content */}
        <div className="w-full h-screen  ">
          <div className="w-full h-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={currentStory.media.url}
              alt="Story content"
            />
          </div>
        </div>

        {/* Right Arrow */}
        <button
          className="absolute top-[50%] right-4 bg-gray-200 rounded-full p-1"
          onClick={handleNext}
        >
          <img className="w-4" src="/right.png" alt="Next" />
        </button>

        {/* Close Button */}
        <button
          className="absolute rounded-full top-4 right-4 "
          onClick={() => setSelectedStoryId(null)} // Close the carousel
        >
          <div className="w-8 aspect-square overflow-hidden bg-white rounded-full p-1">
            <img
              className="w-full h-full object-cover"
              src="/icons/close.png"
              alt="Close"
            />
          </div>
        </button>
        {/* likestory and comment */}
        <div className="w-full h-24 absolute bottom-20 sm:-bottom-6  left-0 justify-center bg-white  sm:py-0 flex gap-2  z-40">
          <div className="w-[80%] px-4">
            <form onSubmit={handelCommentSend}>
              <div className="w-full flex  gap-2 items-center border-2 border-black h-12 mt-3  rounded-3xl overflow-hidden">
                <input
                  className="w-10/12 h-full px-2 outline-none bg-transparent"
                  type="text"
                  id="comment"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                {comment.length > 0 && <button type="submit">Send</button>}
              </div>
            </form>
          </div>
          <div className="w-[20%] flex justify-center mt-3">
            <div className="">
              <img className="w-9 cursor-pointer" src="/icons/like.png" alt="Like" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
