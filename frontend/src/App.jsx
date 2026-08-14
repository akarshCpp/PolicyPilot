import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm PolicyPilot, your company policy assistant. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          conversation_history: conversationHistory.slice(-5)
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        sources: data.sources 
      }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error connecting to the backend service. Please ensure the backend is running.',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <header style={{
        backgroundColor: 'var(--bankers-green)',
        color: 'var(--lamp-glow)',
        borderBottom: '4px solid var(--mahogany)'
      }} className="px-8 py-6 shadow-sm flex items-center justify-between z-10">
        <h1 className="text-3xl font-black tracking-wide m-0 flex items-center gap-3">
          <Bot className="w-8 h-8" />
          PolicyPilot
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace" }} className="m-0 text-sm opacity-90 hidden sm:block">
          COMPANY POLICY ASSISTANT // v1.0
        </p>
      </header>

      <main className="flex-1 flex justify-center items-center p-4 sm:p-8 overflow-hidden z-10">
        <div style={{
          backgroundColor: 'var(--parchment)',
          border: '2px solid var(--mahogany)',
          boxShadow: '8px 8px 0px var(--mahogany)'
        }} className="w-full max-w-4xl h-[80vh] flex flex-col rounded overflow-hidden">
          
          <div style={{ backgroundColor: '#f8f1e6' }} className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div style={{
                  backgroundColor: 'var(--parchment)',
                  border: '2px solid var(--mahogany)',
                  boxShadow: '4px 4px 0px var(--mahogany)'
                }} className="px-5 py-4 flex gap-2 items-center text-[var(--bankers-green)]">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--bankers-green)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--bankers-green)', animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--bankers-green)', animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            borderTop: '2px solid var(--mahogany)',
            backgroundColor: 'var(--parchment)'
          }} className="p-5 flex gap-4">
            <form onSubmit={handleSubmit} className="w-full relative flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about company policies..."
                disabled={loading}
                style={{
                  backgroundColor: '#fffaf0',
                  border: '2px solid var(--mahogany)',
                  boxShadow: '4px 4px 0px var(--mahogany)',
                  fontFamily: "'Merriweather', serif",
                  color: 'var(--mahogany)'
                }}
                className="w-full px-5 py-4 text-lg focus:outline-none transition-transform focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_var(--mahogany)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  backgroundColor: 'var(--bankers-green)',
                  color: 'var(--lamp-glow)',
                  border: '2px solid var(--mahogany)',
                  boxShadow: '4px 4px 0px var(--mahogany)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
                className="px-8 py-4 font-bold uppercase text-base hover:bg-[#236b38] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:hover:bg-[var(--bankers-green)] hidden sm:block"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div 
        style={{
          backgroundColor: isUser ? 'var(--lamp-glow)' : 'var(--parchment)',
          border: '2px solid var(--mahogany)',
          boxShadow: '4px 4px 0px var(--mahogany)'
        }}
        className="max-w-[85%] px-6 py-4 text-lg leading-relaxed relative"
      >
        <h3 style={{ color: 'var(--bankers-green)' }} className="mt-0 mb-2 text-lg font-bold flex items-center gap-2">
          {isUser ? <User className="w-5 h-5 text-[var(--mahogany)]" /> : <Bot className="w-5 h-5" />}
          {isUser ? 'You' : 'PolicyPilot'}
        </h3>
        <p className="whitespace-pre-wrap m-0">{message.content}</p>
        
        {message.error && (
          <div className="flex items-center gap-1 mt-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to fetch answer</span>
          </div>
        )}
      </div>
      
      {/* Sources Citations */}
      {message.sources && message.sources.length > 0 && (
        <div className="w-full max-w-[85%] mt-2">
          <div className="flex flex-col gap-3">
            {message.sources.map((source, idx) => (
              <SourceCitation key={idx} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SourceCitation({ source }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      style={{
        backgroundColor: '#e8dbbf',
        border: '1px solid var(--mahogany)'
      }}
      className="rounded overflow-hidden"
    >
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[#dfd0b0] transition-colors"
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--cold-tea-blue)' }} className="flex flex-col text-sm">
          <span className="font-bold">> Retrieved from: {source.policy}</span>
          <span className="opacity-80">> Section: {source.section}</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-[var(--mahogany)]" /> : <ChevronDown className="w-5 h-5 text-[var(--mahogany)]" />}
      </button>
      {expanded && (
        <div style={{ borderTop: '1px solid var(--mahogany)', backgroundColor: '#fffaf0' }} className="p-4">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--mahogany)' }} className="text-xs leading-relaxed m-0">
            {source.content}
          </p>
        </div>
      )}
    </div>
  );
}
