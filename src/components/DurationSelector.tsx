import React from "react";

interface DurationSelectorProps {
    darkMode: boolean,
    setTimer: (arg0: number) => void,
    isPlaying: boolean,
    selectedDuration: number,
    setSelectedDuration: (arg0: number) => void,
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ darkMode, setTimer, isPlaying, selectedDuration, setSelectedDuration }) => {
  
  const durations = [30, 60, 90];

  return (
    <>
        <div className="absolute top-0 left-0 mx-8 mt-5.5 flex items-center justify-center p-4">
      {/* Duration Selector */}
      <div className="relative rounded-full p-1">
        <div className="flex relative">
          {/* Animated Background */}
          <div 
            className={`absolute top-1 bottom-1 rounded transition-all duration-300 ease-out shadow-lg ${
              darkMode ? 'bg-[#0087F2]' : 'bg-[#FACC15]'
            }`}
            style={{
              width: '33.333%',
              left: `${durations.findIndex(d => d === selectedDuration) * 33.333}%`,
            }}
          />
          
          {/* Duration Options */}
          {durations.map((duration) => (
            <button
              key={duration}
              onClick={() => { 
                if (!isPlaying) {
                    setSelectedDuration(duration); 
                    setTimer(duration);   
                }
             }
            }
              className={`relative px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                selectedDuration === duration
                  ? `${darkMode ? 'text-white' : 'text-black'} transition-colors cursor-auto`
                  : `${darkMode ? 'text-gray-300 hover:text-gray-500' : 'text-gray-500 hover:text-gray-800'} transition-colors cursor-pointer`
              }`}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default DurationSelector;