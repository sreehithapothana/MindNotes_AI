import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader, User, Bot, AlertCircle, MessageSquare } from 'lucide-react';
import api from '../services/api';

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${id}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load chat history.');
      }
    };
    fetchHistory();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/chat/${id}`, { question: userMessage.content });
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Chat request failed.');
      // Remove the optimistic message on fail if desired, keeping simple here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in pb-6">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <div className="w-10 h-10 rounded-xl bg-powder flex items-center justify-center mr-3 shadow-sm">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          Chat with Transcript
        </h1>
        <p className="text-gray-500 mt-2">Ask questions directly about this session's content.</p>
      </div>

      <div className="card-soft flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Bot className="w-8 h-8 text-lavender-light" />
              </div>
              <p className="text-gray-500 max-w-md">I'm ready to answer questions based on the transcript. Ask me about key decisions, definitions, or what happened!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                  msg.role === 'user' ? 'bg-lavender text-white ml-3' : 'bg-powder text-blue-700 mr-3'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`px-5 py-3.5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-lavender text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="w-8 h-8 rounded-full bg-powder text-blue-700 mr-3 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-lavender-light rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-lavender-dark rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="p-3 mx-4 mt-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />{error}
          </div>
        )}

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full pl-6 pr-14 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none text-gray-900"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 p-3 bg-lavender text-white rounded-xl hover:bg-lavender-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
