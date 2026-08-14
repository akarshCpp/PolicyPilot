import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am PolicyPilot, your internal company assistant. How can I help you today?' }
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
      // Expecting FastAPI to run on localhost:8000
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          conversation_history: conversationHistory.slice(-5) // Send last 5 messages for context
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
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-center">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          PolicyPilot
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2 items-center text-slate-500 shadow-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about company policies..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm
          ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
        <div className={`rounded-2xl px-5 py-3 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : message.error 
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          {message.error && (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to fetch answer</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Sources Citations */}
      {message.sources && message.sources.length > 0 && (
        <div className="pl-12 w-full max-w-[85%] mt-1">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sources</p>
          <div className="flex flex-col gap-2">
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
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">{source.policy}</span>
          <span className="text-xs text-slate-500">{source.section}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {expanded && (
        <div className="p-3 bg-white border-t border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            {source.content}
          </p>
        </div>
      )}
    </div>
  );
}
