
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToMentor } from '../services/geminiServices';
import { Message } from '../types';
import { Send, Bot, User, Globe, Mic, Volume2, StopCircle, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUPPORTED_LANGUAGES = {
  'English': 'en',
  'Hindi': 'hi',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Kannada': 'kn',
  'Marathi': 'mr',
  'Bengali': 'bn',
  'Spanish': 'es'
};

const Mentor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! 👋 I am your AI Teaching Assistant. I can help you with:\n\n• **Interview Preparation** - Data Structures, Algorithms, System Design\n• **Company-Specific Questions** - Real placement drive insights\n• **Career Guidance** - Skills, roles, advancement tips\n• **Technical Concepts** - Clear explanations with examples\n\nI support 8 languages! Select your language above and ask anything. 🌍', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToMentor(history, input, language);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        text: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    const langMap: {[key: string]: string} = {
      'English': 'en-US',
      'Hindi': 'hi-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Kannada': 'kn-IN',
      'Marathi': 'mr-IN',
      'Bengali': 'bn-IN',
      'Spanish': 'es-ES'
    };
    
    recognition.lang = langMap[language] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const speak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.text = text.replace(/[*#`\[\]()]/g, '').substring(0, 500);
    
    const langMap: {[key: string]: string} = {
      'English': 'en-US',
      'Hindi': 'hi-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Kannada': 'kn-IN',
      'Marathi': 'mr-IN',
      'Bengali': 'bn-IN',
      'Spanish': 'es-ES'
    };
    utterance.lang = langMap[language] || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col p-4 md:p-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-xl shadow-md border border-indigo-800 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">🤖 AI Teaching Assistant</h2>
            <p className="text-xs text-indigo-100">Interview Prep • Career Guidance • Technical Help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border-none bg-indigo-500 text-white rounded-md focus:ring-0 font-medium cursor-pointer px-2 py-1 hover:bg-indigo-600 transition-colors"
          >
            {Object.keys(SUPPORTED_LANGUAGES).map(lang => (
              <option key={lang} value={lang} className="bg-slate-800">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 p-4 space-y-4 border-x border-slate-300">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md group relative ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown 
                    components={{
                      h3: ({node, ...props}) => <h3 className="font-bold text-slate-800 mt-2 mb-1 text-base" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 my-1 space-y-0.5" {...props} />,
                      li: ({node, ...props}) => <li className="my-0 text-slate-700" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-slate-700" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-indigo-700" {...props} />,
                      code: ({node, ...props}) => <code className="bg-slate-100 px-1 rounded text-slate-800 font-mono text-xs" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => speak(msg.text)}
                      className={`p-2 rounded-full transition-colors ${isSpeaking ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
                      title="Read Aloud"
                    >
                      {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                      title="Copy"
                    >
                      {copiedId === msg.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-slate-200">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-b-xl shadow-md border-x border-b border-slate-300 p-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-50 transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "🎤 Listening..." : "Ask about DSA, system design, companies, interviews..."}
            className="flex-1 bg-slate-50 border-none focus:ring-0 text-slate-900 placeholder-slate-500"
          />
          <button 
            onClick={startListening}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Speak Input"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">💡 Tip: Ask specific questions for better answers. Change language anytime!</p>
      </div>
    </div>
  );
};

export default Mentor;
