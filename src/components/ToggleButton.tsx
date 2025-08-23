import { Sun, Moon } from 'lucide-react';
import type React from 'react';

interface ToggleButtonProps {
    darkMode: boolean,
    toggleTheme: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({darkMode, toggleTheme}) => {
    return ( 
    <>
    <div className='absolute top-0 right-0 m-10'>
        <button
            onClick={toggleTheme}
            className={`cursor-pointer relative inline-flex h-10 w-22 items-center rounded-full transition-all duration-700 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 ${
              darkMode
                ? 'bg-[#0087F2] focus:ring-blue-300'
                : 'bg-[#FACC15] focus:ring-yellow-300'
            } shadow-lg hover:shadow-xl`}
          >
            {/* Toggle Circle */}
            <span
              className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-700 ease-in-out ${
                darkMode ? 'translate-x-13' : 'translate-x-2'
              }`}
            >
              {/* Icons */}
              <div className="flex h-full w-full items-center justify-center">
                <Sun
                  className={`h-5 w-5 text-[#FACC15] transition-all duration-700  ${
                    darkMode
                      ? 'opacity-0 rotate-180 scale-0'
                      : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <Moon
                  className={`absolute h-5 w-5 text-[#0087F2] transition-all duration-700 ${
                    darkMode
                      ? 'opacity-100 rotate-0 scale-100'
                      : 'opacity-0 -rotate-180 scale-0'
                  }`}
                />
              </div>
            </span>
             <div className="absolute inset-0 flex items-center justify-between px-3">
              <Sun className={`h-6 w-6 text-white/70 transition-all duration-700  ${
                darkMode ? 'opacity-70 scale-75' : 'opacity-0'
              }`} />
              <Moon className={`h-6 w-6 text-white/70 transition-all duration-700 ${
                darkMode ? 'opacity-0' : 'opacity-70 scale-75'
              }`} />
            </div>
          </button>
    </div>
    </> );
}
 
export default ToggleButton;