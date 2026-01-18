import React, { useState, useRef, useEffect } from 'react';
import { Message, UserRole } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface ChatInterfaceProps {
  caseContext: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ caseContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: UserRole.AI_ASSISTANT,
      content: "I have analyzed the case files. Please select your role (Plaintiff, Defendant, or Judge) and I will assist you accordingly.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PLAINTIFF);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: selectedRole,
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Convert internal messages to API history format with role context
    const history = messages.map(m => ({
      role: m.role === UserRole.AI_ASSISTANT ? 'model' : 'user',
      parts: [{ text: m.role === UserRole.AI_ASSISTANT ? m.content : `[Role: ${m.role}] ${m.content}` }]
    }));

    const messageWithRole = `[Role: ${selectedRole}] ${userMsg.content}`;
    const responseText = await sendChatMessage(history, messageWithRole, caseContext);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: UserRole.AI_ASSISTANT,
      content: responseText || "Sorry, I couldn't generate a response.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case UserRole.JUDGE: return 'bg-red-800';
      case UserRole.PLAINTIFF: return 'bg-blue-600';
      case UserRole.DEFENDANT: return 'bg-green-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      {/* Header with Role Selection */}
      <div className="bg-slate-800 text-white p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 font-semibold">
            <Bot className="w-5 h-5" />
            <span>Case Assistant</span>
          </div>
          <span className="text-[10px] bg-slate-600 px-2 py-1 rounded text-slate-200">Gemini 2.5</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-700 p-1.5 rounded-md">
          <User className="w-4 h-4 text-slate-300" />
          <span className="text-xs text-slate-300 whitespace-nowrap">Speaking as:</span>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="flex-1 bg-slate-600 text-white text-xs border-none rounded py-1 px-2 focus:ring-1 focus:ring-blue-400 cursor-pointer outline-none"
          >
            <option value={UserRole.PLAINTIFF}>Plaintiff (Counsel)</option>
            <option value={UserRole.DEFENDANT}>Defendant (Counsel)</option>
            <option value={UserRole.JUDGE}>Judge</option>
          </select>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isUser = msg.role !== UserRole.AI_ASSISTANT;
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  isUser
                    ? `${getRoleColor(msg.role as string)} text-white rounded-br-none`
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className={`font-bold text-[10px] mb-1 uppercase tracking-wider ${isUser ? 'text-white/80' : 'text-blue-600'}`}>
                  {msg.role}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-2 items-center">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs text-gray-500">Analyzing case data...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message as ${selectedRole}...`}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`${getRoleColor(selectedRole)} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium flex items-center justify-center min-w-[60px]`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;