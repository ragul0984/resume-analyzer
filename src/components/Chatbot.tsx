import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your AI career assistant. Ask me anything about your resume, interview tips, or career paths!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ChatIcon />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '350px',
          maxWidth: 'calc(100vw - 2rem)',
          height: '500px',
          maxHeight: 'calc(100vh - 8rem)',
          backgroundColor: '#1e293b',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out',
          backdropFilter: 'blur(20px)',
          position: 'absolute',
          bottom: '70px',
          right: '0'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '1rem', 
            background: 'linear-gradient(to right, rgba(255,255,255,0.05), transparent)', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary-color)' }}>✦</span> AI Assistant
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div className="scrollable" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.2)'}`,
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                {msg.role === 'assistant' ? (
                  <div className="markdown-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic', padding: '0 10px' }}>
                AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a career question..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                style={{
                  background: input.trim() ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                  paddingLeft: '3px' // visual optical alignment for send icon
                }}
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .markdown-body p { margin: 0; line-height: 1.6; }
        .markdown-body ul, .markdown-body ol { margin: 0; padding-left: 1.5rem; }
        .markdown-body strong { color: var(--primary-color); }
      `}</style>
    </div>
  );
}
