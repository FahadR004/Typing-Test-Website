import type React from "react";
import { useState } from "react";
import Cat0 from "../assets/cat-w0.jpeg"
import Cat1 from "../assets/cat-w20.jpg"
import Cat2 from "../assets/cat-w40.png"
import Cat3 from "../assets/cat-w60.jpg"
import Cat from "../assets/cat.gif"

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    wordsPerMin: number,
    charPerMin: number,
    accuracy: number
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, wordsPerMin, charPerMin, accuracy }) => {

     const [copyText, setCopyText] = useState("Or copy your results");

    const getResultText = (includeUrl = false) => {
        const baseText = `My Typing Speed: ${wordsPerMin} WPM (${charPerMin} CPM) with ${accuracy}% accuracy!`;
        const websiteUrl = "https://your-typing-test-website.com"; // Replace with your actual website URL
        
        let message = "";
        if (wordsPerMin === 0) {
            message = `${baseText} I need to practice more! 😅`;
        } else if (wordsPerMin < 2) {
            message = `${baseText} Time to practice more! 💪`;
        } else if (wordsPerMin < 4) {
            message = `${baseText} Not bad for a typing test! 😮`;
        } else if (wordsPerMin < 5) {
            message = `${baseText} Great typing speed! 🤩`;
        } else {
            message = `${baseText} I'm a typing pro! 🎉`;
        }
        
        return includeUrl ? `${message}\n\nTest your typing speed at: ${websiteUrl}` : message;
    };

    const handleShare = (platform: string) => {
        const text = getResultText(true); 
        const url = "https://your-typing-test-website.com";
        
        let shareUrl = '';
        
        switch (platform) {
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const handleCopyResults = async () => {
        const text = getResultText(true); // Include URL when copying
        
        try {
            await navigator.clipboard.writeText(text);
            setCopyText("Copied!");
            setTimeout(() => setCopyText("Or copy your results"), 2000);
        } catch (err) {
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setCopyText("Copied!");
                setTimeout(() => setCopyText("Or copy your results"), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <>
            {isOpen &&
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 animate-appear transition-all shadow-lg">
                <div className="w-2xl bg-white shadow rounded text-center">
                    <div className="py-4 mt-2 mx-2 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"  
                        className="size-10 absolute top-0 right-0 text-red-500 cursor-pointer hover:text-red-700" onClick={onClose}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="font-poppins-bold text-4xl pt-1 pb-3">Your results!</h1>
                    <hr className="border-black mx-3" />
                    <div id="content" className="flex justify-center items-center gap-10 px-5 mb-10">
                        <div id="img-content" className="pt-6">
                            {wordsPerMin === 0 ? 
                                <img src={Cat0} alt="" className="w-80 h-80 rounded shadow-lg border-2 border-black"/>
                               : wordsPerMin < 20 ?
                                <img src={Cat1} alt="" className="w-80 h-80 rounded shadow-lg border-2 border-black"/>
                              :  wordsPerMin < 40 ? 
                                <img src={Cat2} alt="" className="w-80 h-80 rounded shadow-lg border-2 border-black"/>
                               : wordsPerMin < 60 ?
                                <img src={Cat3} alt="" className="w-80 h-80 rounded shadow-lg border-2 border-black"/>
                                : <img src={Cat} alt="" className="w-80 h-80 rounded shadow-lg border-2 border-black"/> 
                            }
                        </div>
                        <div id="text-content" className="pt-6 text-left w-1/2 font-poppins">
                            {wordsPerMin === 0 ?
                                <>  
                                    <h1 className="font-poppins-bold text-2xl text-left">Ummm...you need to look at the screen!!😫😭</h1>
                                    <p className="">Your Typing Speed is {wordsPerMin} WPM ({charPerMin} CPM). Your accuracy was {accuracy}! Try placing your hands on the keyboard...</p>
                                </>
                                : wordsPerMin < 20 ?
                                <>  
                                    <h1 className="font-poppins-bold text-2xl text-left">Hmmm....you can do better! 😖</h1>
                                    <p className="">Your Typing Speed is {wordsPerMin} WPM ({charPerMin} CPM). Your accuracy was {accuracy}! Try practicing more and you can get even better results! 💪</p>
                                </>
                                : wordsPerMin < 40 ?
                                   <>  
                                    <h1 className="font-poppins-bold text-2xl text-left">Not bad! You scored well! 😮</h1>
                                    <p className="">Your Typing Speed is {wordsPerMin} WPM ({charPerMin} CPM). Your accuracy was {accuracy}! Try practicing more and you can get even better results! 💪</p>
                                </>
                                : wordsPerMin < 60 ?
                                   <>  
                                        <h1 className="font-poppins-bold text-2xl text-left">Now that's what I am talking about! 🤩</h1>
                                        <p className="">Your Typing Speed is {wordsPerMin} WPM ({charPerMin} CPM). Your accuracy was {accuracy}! That's great speed! I am loving it!</p>
                                    </>
                                :  
                                <>  
                                    <h1 className="font-poppins-bold text-2xl text-left">Wow! You are a Total Pro! 🎉</h1>
                                    <p className="">Your Typing Speed is {wordsPerMin} WPM ({charPerMin} CPM). Your accuracy was {accuracy}! That's some amazing speed you got there. You should compete in a competion! 😩</p>
                                </>
                                } <div id="share-content" className="mb-6 text-center">
                            <hr className="mt-4 border-gray-300" />
                            <p className="font-poppins-exlight tracking-wider text-md mt-4 mb-4">Share your results!</p>
                            {/* Social Media Icons */}
                            <div className="flex justify-center gap-4 mb-4">
                                {/* LinkedIn */}
                                <button 
                                    onClick={() => handleShare('linkedin')}
                                    className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </button>
                                
                                {/* Facebook */}
                                <button 
                                    onClick={() => handleShare('facebook')}
                                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                                
                                {/* WhatsApp */}
                                <button 
                                    onClick={() => handleShare('whatsapp')}
                                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Copy Results */}
                            <button 
                                onClick={handleCopyResults}
                                className="text-gray-500 underline hover:text-gray-700 transition-colors text-sm font-poppins-light cursor-pointer"
                            >
                                {copyText}
                            </button>
                            </div>
                        </div>
                    </div>
                                  
                </div>
            </div>
            }
        </>
    );
}
export default Modal;