import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Send, X, Sparkles, Bot } from 'lucide-react';
import { getAIResponse } from '../utils/copilotEngine';
import './AICopilot.css';

// Pure helper defined outside component scope to satisfy React 19 linter rules
const getRandomDelay = () => {
    return 800 + Math.random() * 400;
};

const AICopilot = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    
    // Condition to hide on immersive memory page
    const isMemoryPage = location.pathname === '/memory';
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    const logRef = useRef(null);
    const messageIdCounterRef = useRef(0);

    const getNextMessageId = (sender) => {
        messageIdCounterRef.current += 1;
        return `${sender}-${messageIdCounterRef.current}`;
    };



    // Keep scrolling at the bottom of the log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    if (isMemoryPage) return null;

    const handleSendMessage = (textToSend) => {
        const text = textToSend || inputText;
        if (!text.trim()) return;

        // User message
        const userMsg = {
            id: getNextMessageId('user'),
            sender: 'user',
            text: text
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInputText('');
        setIsTyping(true);

        // Simulate thinking latency
        setTimeout(() => {
            const aiResponseText = getAIResponse(text, i18n.language);
            const aiMsg = {
                id: getNextMessageId('assistant'),
                sender: 'assistant',
                text: aiResponseText
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, getRandomDelay());
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasUnread(false);
        }
    };

    const suggestedQueries = [
        { key: 'certs', text: t('copilot.suggested.certs') },
        { key: 'skills', text: t('copilot.suggested.skills') },
        { key: 'experience', text: t('copilot.suggested.experience') },
        { key: 'ai', text: t('copilot.suggested.ai') }
    ];

    // Helper to render message text with basic markdown styling
    const renderMessageText = (text) => {
        return text.split('\n').map((line, i) => {
            
            // Bold markdown: **text**
            const boldRegex = /\*\*(.*?)\*\*/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            
            while ((match = boldRegex.exec(line)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(line.substring(lastIndex, match.index));
                }
                parts.push(<strong key={match.index}>{match[1]}</strong>);
                lastIndex = boldRegex.lastIndex;
            }
            
            if (lastIndex < line.length) {
                parts.push(line.substring(lastIndex));
            }

            // Check if it's a bullet point line
            if (line.trim().startsWith('•')) {
                return (
                    <div key={i} className="chat-bullet-line">
                        {parts.length > 0 ? parts : line}
                    </div>
                );
            }

            return (
                <p key={i} className="chat-paragraph-line">
                    {parts.length > 0 ? parts : line}
                </p>
            );
        });
    };

    return (
        <div className={`copilot-widget-container ${isOpen ? 'chat-open' : 'chat-closed'}`}>
            {/* Floating toggle button */}
            <button 
                className={`copilot-floating-btn ${hasUnread ? 'pulse-btn' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle AI Copilot"
            >
                {isOpen ? <X size={24} /> : <Bot size={26} />}
                {hasUnread && !isOpen && <span className="unread-dot"></span>}
            </button>

            {/* Chat Pane */}
            <div className="copilot-chat-pane glass-card">
                {/* Header */}
                <div className="copilot-header">
                    <div className="copilot-avatar">
                        <Sparkles size={14} className="sparkle-icon" />
                        <Bot size={22} />
                    </div>
                    <div className="copilot-title-area">
                        <h4>{t('copilot.title')}</h4>
                        <div className="copilot-subtitle-row">
                            <span className="status-dot"></span>
                            <p>{t('copilot.status')}</p>
                        </div>
                    </div>
                    <button type="button" className="copilot-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
                        <X size={18} />
                    </button>
                </div>

                {/* Conversation Log */}
                <div className="copilot-message-log" ref={logRef}>
                    {/* Welcome message rendered dynamically based on active language */}
                    <div className="message-bubble-wrapper assistant-msg">
                        <div className="message-avatar">
                            <Bot size={14} />
                        </div>
                        <div className="message-bubble">
                            {renderMessageText(t('copilot.greet'))}
                        </div>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-bubble-wrapper ${msg.sender}-msg`}>
                            <div className="message-avatar">
                                {msg.sender === 'assistant' ? <Bot size={14} /> : <span className="user-icon-placeholder">U</span>}
                            </div>
                            <div className="message-bubble">
                                {renderMessageText(msg.text)}
                            </div>
                        </div>
                    ))}

                    {/* Typing bubble */}
                    {isTyping && (
                        <div className="message-bubble-wrapper assistant-msg typing-msg">
                            <div className="message-avatar">
                                <Bot size={14} />
                            </div>
                            <div className="message-bubble typing-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Suggestions overlay */}
                <div className="copilot-suggestions">
                    {suggestedQueries.map((item) => (
                        <button 
                            type="button"
                            key={item.key} 
                            className="suggestion-badge"
                            onClick={() => handleSendMessage(item.text)}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>

                {/* Form Input */}
                <form className="copilot-input-area" onSubmit={handleFormSubmit}>
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('copilot.placeholder')}
                        disabled={isTyping}
                    />
                    <button type="submit" disabled={!inputText.trim() || isTyping} aria-label="Send message">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AICopilot;
