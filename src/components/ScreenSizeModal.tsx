import React, { useState, useEffect } from 'react';

interface ScreenSizeModalProps {
    darkMode: boolean;
}

const ScreenSizeModal: React.FC<ScreenSizeModalProps> = ({darkMode}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Show modal if screen width is less than 1024px (tablet and mobile)
      if (window.innerWidth < 1024) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50  bg-opacity-50">
      <div className="max-w-md mx-4 bg-white rounded-lg shadow-xl p-6 text-center">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          {/* Computer Icon */}
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-16 h-16 ${darkMode ? 'text-[#0087F2]' : 'text-[#FACC15]'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hey there! 👋
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            This is a typing test website meant to assess your typing skills on a keyboard! 
            Try using this website on a larger screen like a desktop computer or a laptop!
          </p>
          
          <p className="text-gray-600 mt-4 font-medium">
            Thank You!
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className={`text-white px-6 py-2 rounded-lg transition-colors font-medium cursor-pointer ${darkMode ? 'bg-[#0087F2] hover:bg-[#017ce0]' : 'bg-[#FACC15] hover:bg-[#ddb516]'} transition-colors`}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default ScreenSizeModal;