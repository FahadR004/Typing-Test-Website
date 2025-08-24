  import { createRef, useEffect, useMemo, useRef, useState } from 'react'
  import { CountdownCircleTimer } from "react-countdown-circle-timer";
  import renderTime from './components/Counter'
  import caretDown from './assets/arrow-down.png'
  import caretDownDark from './assets/arrow-down-dark-mode.png'
  import { generate } from 'random-words'
  import Modal from './components/Modal';
  import ToggleButton from './components/ToggleButton';
  import DurationSelector from './components/DurationSelector';

  const NOT_INPUT_KEYS = ['Shift', 'Alt', 'Enter', 'Control', 'Tab']

  function App() {

  const [darkMode, setDarkMode] = useState<boolean>(() => {
      try {
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
      } catch (error) {
        console.error('Error reading darkMode from localStorage:', error);
        return false;
      }
    });

    const [wordsPerMin, setWordsPerMin] = useState<number>(0);
    const [charsPerMin, setCharsPerMin] = useState<number>(0); 
    const [accuracy, setAccuracy] = useState<number>(0); 
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [wordArray, setWordArray] = useState<string[]>(() => {
      const words = generate(50);
      return Array.isArray(words) ? words : [words];
    });

    const [currWordIndex, setCurrWordIndex] = useState<number>(0);
    const [checkerSpanText, setCheckerSpanText] = useState<string>('');
    const [backupText, setBackupText] = useState<string>('');

    const [errorFlag, setErrorFlag] = useState<boolean>(false);
    const [errorCharCount, setErrorCharCount] = useState<number>(0);

    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [timer, setTimer] = useState<number>(30);
    const [timerKey, setTimerKey] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const checkerRef = useRef<HTMLSpanElement>(null);
    const resultRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wordsRef = useRef<HTMLSpanElement>(null);

    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    const setStateChanges = () => {
      focusInput();
      setIsPlaying(true);
      setIsRemoving(true);
    }

    const reset = () => {
      // Metrics
      setWordsPerMin(0);
      setCharsPerMin(0);
      setAccuracy(0);

      // Others
      setIsPlaying(false);
      setIsRemoving(false);
      setCheckerSpanText('');
      setBackupText('');
      setErrorFlag(false);
      setErrorCharCount(0);
      
      setCurrWordIndex(0);

      // Clear result ref content
      if (resultRef.current) {
        resultRef.current.innerHTML = '';
      }

      // Blur input
      if (inputRef.current) { 
        inputRef.current.blur();
      }

      // Force timer reset
      setTimerKey(prev => prev + 1);

      // Set new word array
      const newWords = generate(50);
      setWordArray(Array.isArray(newWords) ? newWords : [newWords]);
    }

      const wordsSpanRef = useMemo(() => {
      return Array(wordArray.length).fill(0).map(() => createRef<HTMLSpanElement>());
    }, [wordArray]);

    // For generating words when the current word index is less than (total length - 10)
    useEffect(() => {
      if (currWordIndex > wordArray.length - 10) {
        const newWords = generate(50);
        const wordsArray = Array.isArray(newWords) ? newWords : [newWords];
        setWordArray(prevWords => [...prevWords, ...wordsArray]);
      }
    }, [currWordIndex])

    // For setting the background of the body
    useEffect(() => {
      const bodyBg = darkMode ? '#33383F' : '#ededed';
      document.body.style.backgroundColor = bodyBg;
      document.body.style.transition = "all 0.5s ease-in-out";
    }, [darkMode]);

    useEffect(() => {
      const currLength = checkerSpanText.length;
      const wordSpan = wordsSpanRef[currWordIndex]?.current;
      const fullWord = wordSpan?.textContent || ''; 
      
      console.log('useEffect', checkerSpanText, backupText, fullWord, wordSpan);
      
      if (wordArray[currWordIndex] && (wordArray[currWordIndex].slice(0, currLength) !== checkerSpanText.slice(0, currLength) || checkerSpanText + fullWord !== wordArray[currWordIndex])) {
        setErrorFlag(true);
      } else {
        setErrorFlag(false);
      }
    }, [checkerSpanText, currWordIndex, wordArray, wordsSpanRef])

    useEffect(() => {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      } catch (error) {
        console.error('Error saving darkMode to localStorage:', error);
      }
    }, [darkMode]);

    const toggleButton = () => {
      setDarkMode(!darkMode);
    }

    const matchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (NOT_INPUT_KEYS.includes(e.key)) {
        return;
      }
      
      if (!wordsSpanRef[currWordIndex]?.current) {
        return;
      }

      const currWord = wordsSpanRef[currWordIndex].current;
      const allCurrChars = currWord.childNodes;

      if (e.key === 'Backspace') {
        if (checkerSpanText.length > 0) {
          if (checkerSpanText[checkerSpanText.length - 1] === backupText[backupText.length - 1] || 
              checkerSpanText + backupText === wordArray[currWordIndex]) {
            const newCharSpan = document.createElement('span');
            newCharSpan.textContent = checkerSpanText[checkerSpanText.length - 1];
            newCharSpan.className = 'character';
            currWord.insertBefore(newCharSpan, currWord.firstChild);
            setBackupText(backupText.slice(0, -1));
          }
          setCheckerSpanText(checkerSpanText.slice(0, -1));
        }
        return;
      }

      if (e.key === ' ') {
        // Create span for completed word
        const newSpan = document.createElement('span');
        newSpan.textContent = checkerSpanText;
        
        if (checkerSpanText !== wordArray[currWordIndex] || errorFlag) {
          newSpan.className = 'text-gray-400 line-through whitespace-nowrap pr-2';
        } else {
          newSpan.className = 'text-gray-400 whitespace-nowrap pr-2';
        }
        
        if (resultRef.current) {
          resultRef.current.appendChild(newSpan);
        }

        setCharsPerMin(charsPerMin + checkerSpanText.length);
        setAccuracy(Math.round((((charsPerMin - errorCharCount) / charsPerMin ) * 100)) ? Math.round((((charsPerMin - errorCharCount) / charsPerMin ) * 100)) : 0);

        // Move to next word
        setCurrWordIndex(currWordIndex + 1);
        currWord.style.display = 'none';
        setCheckerSpanText('');
        setBackupText('');

        // Update metrics
        if (!errorFlag) {
          setWordsPerMin(wordsPerMin + 1);
        } else if (errorFlag) {
          setErrorCharCount(prev => checkerSpanText.length + prev);
        }
          
        setErrorFlag(false);

        return;
      }

      // Handle character input
      const firstChar = allCurrChars[0] as HTMLElement;
      if (firstChar && e.key === firstChar.innerText) {
        setBackupText(backupText + firstChar.innerText);
        firstChar.remove();
        setCheckerSpanText(checkerSpanText + e.key);
      } else if (e.key !== ' ') {
        setCheckerSpanText(checkerSpanText + e.key);
      }
    }

    useEffect(() => {
      console.log("error", errorCharCount);
    })

    return (
      <>
        <Modal 
            isOpen={modalOpen} 
            onClose={() => {
                reset();
                setModalOpen(false);
            }} 
            wordsPerMin={wordsPerMin} 
            charPerMin={charsPerMin} 
            accuracy={accuracy}
        />
        <DurationSelector 
            darkMode={darkMode} 
            setTimer={setTimer} 
            isPlaying={isPlaying} 
        />
        <ToggleButton darkMode={darkMode} toggleTheme={toggleButton} />
        <main className='font-poppins text-center mt-32 transition-all relative'>    
          <p className={`font-poppins-exlight tracking-wide py-2 text-[1.1em] transition-all  ${darkMode ? 'text-white' : 'text-black'}`}>TYPING SPEED TEST</p>
          <h1 className={`text-6xl font-poppins-exbold ${darkMode ? 'text-white' : 'text-black'} transition-all`}>Test your typing skills</h1>
          <div className='flex flex-wrap justify-center items-center gap-10 mt-10 mb-10'>
            <div id='timer' className='mb-8'>
              <div className='bg-white rounded-full shadow-lg transition-all'>
                <CountdownCircleTimer 
                  key={timerKey}
                  isPlaying={isPlaying}
                  duration={timer}
                  colors={darkMode ? "#0087F2" : "#FACC15"}
                  onComplete={() => { 
                      setTimeout(() => {
                      setModalOpen(true)
                    }, 1000); 
                    if (inputRef.current) {
                      inputRef.current.blur();
                    }
                  }
                }
                  size={150}  
                >
                  {renderTime}
                </CountdownCircleTimer>
              </div>
            </div>
            <div id='metrics' className='flex justify-center items-center gap-3 lg:gap-6'>
              <div id='words/min' className='text-center'>
                <p className='font-poppins-bold text-4xl px-10 py-10 w-30 h-30 bg-white rounded-3xl shadow-lg transition-all'>{wordsPerMin}</p>
                <p className={`text-sm py-3  ${darkMode ? 'text-white' : 'text-black'} transition-all`}>words/min</p>
              </div>
              <div id='chars/min'>
                <p className='font-poppins-bold text-4xl px-8 py-10 w-30 h-30 bg-white rounded-3xl shadow-lg transition-all'>{charsPerMin}</p>
                <p className={`text-sm py-3  ${darkMode ? 'text-white' : 'text-black'} transition-all`}>chars/min</p>
              </div>
              <div id='accuracy'>
                <p className='flex justify-center items-center text-center flex-shrink font-poppins-bold text-4xl px-10 py-10 w-30 h-30 bg-white rounded-3xl shadow-lg transition-all'>{accuracy}</p>
                <p className={`text-sm py-3  ${darkMode ? 'text-white' : 'text-black'} transition-all`}>%accuracy</p>
              </div>
            </div>
          </div>
          <div className='relative mt-20'>
            <div className={`${darkMode ? 'bg-[#0087F2] text-white' : 'bg-[#FACC15] text-black'} w-40 p-3 rounded-md flex justify-center items-center m-auto animate-bounce shadow-md absolute right-0 left-0 bottom-22  duration-700 ${isRemoving ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-0'}`}>
              <p className=''>Start Typing</p>
            {darkMode ?  <img className='absolute mt-14' src={caretDownDark} alt="" /> :  <img className='absolute mt-14' src={caretDown} alt="" />}
            </div>
            <div id='words-box' className='mx-5 md:mx-40 lg:mx-60 mt-10 mb-10' onClick={setStateChanges}>
              <div
                ref={containerRef}
                className='py-6 md:py-12 text-lg md:text-2xl lg:text-3xl rounded-3xl shadow-lg w-full bg-white flex justify-center items-center overflow-hidden'
              >
                <div className='w-1/2 overflow-hidden relative flex items-center justify-end '>
                  <span
                    ref={resultRef}
                    className='text-gray-400 whitespace-nowrap'
                  >
                  </span>
                </div>
                <span 
                    className={`${errorFlag ? 'text-red-500 line-through' : 'text-green-400'}  whitespace-nowrap `} 
                    ref={checkerRef}
                >
                  {checkerSpanText}
                </span>
                <span ref={wordsRef} className='w-1/2 text-left'>
                  {wordArray.map((word, index) => (
                    <span id={word} key={`${word}-${index}`} className={`transition-colors pr-2 pb-8 ${darkMode ? 'text-[#0087F2]' : 'text-yellow-300'}`} ref={wordsSpanRef[index]}>
                      {word.split('').map((char, charIndex) => (
                        <span key={`${char}-${charIndex}`} className='character'>{char}</span>
                      ))}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
          <input
            type="text"
            ref={inputRef}
            className='bg-[#ededed] opacity-0'
            onKeyDown={matchInput}
          />
        </main>
      </>
    )
  }

  export default App