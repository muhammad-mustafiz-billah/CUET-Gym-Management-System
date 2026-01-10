import React, { useState, useRef, useEffect } from 'react';

const ChatbotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your GymSys AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('routine') || lowerText.includes('workout')) return "For a balanced routine, try a Push/Pull/Legs split. Aim for 3-4 days a week!";
        if (lowerText.includes('health') || lowerText.includes('pain')) return "If you're in pain, please stop exercising and consult a professional. Recovery is key!";
        if (lowerText.includes('diet') || lowerText.includes('food')) return "Focus on whole foods, lean proteins, and hydration. Fuel your body right!";
        if (lowerText.includes('open') || lowerText.includes('hour')) return "We are open 24/7 for members! Staffed hours: 6 AM - 10 PM.";
        return "I can help with workouts, diet tips, or gym info. Try asking about 'routines'!";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: generateResponse(userMessage.text),
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl bg-gray-900/80 border border-white/10 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-xl">🤖</span>
                            </div>
                            <h3 className="font-bold text-white tracking-wide">GymSys AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">✕</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20'
                                        : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                                    }`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gray-900/50">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full bg-gray-800 border-gray-700 text-white rounded-full pl-5 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="absolute right-2 top-1.5 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 flex items-center justify-center ${isOpen
                        ? 'bg-gray-800 text-white rotate-90'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
                    }`}
            >
                <span className="text-3xl">{isOpen ? '✕' : '💬'}</span>
            </button>
        </div>
    );
};

export default ChatbotIcon;
