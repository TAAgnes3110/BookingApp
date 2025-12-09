import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn, mình có thể giúp gì cho bạn?", sender: "bot", timestamp: "10:00" },
    { id: 2, text: "Mình muốn hỏi về dịch vụ đưa đón sân bay ạ.", sender: "user", timestamp: "10:02" },
    { id: 3, text: "Dạ bên mình có dịch vụ đưa đón miễn phí cho khách đặt trên 3 đêm nhé ^^", sender: "bot", timestamp: "10:03" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Mock bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Cảm ơn bạn đã quan tâm. Bạn cần hỗ trợ gì thêm không ạ?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-6 h-screen flex flex-col">
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Chat Sidebar / List */}
        <div className="w-full md:w-1/3 hidden md:flex flex-col">
          <GlassCard className="h-full flex flex-col !p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Tin nhắn</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                    <img
                      src={`https://images.unsplash.com/photo-1571896349842-6e53ce41be03?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=100&amp;q=80`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">Resort Ven Biển</h4>
                    <p className="text-white/60 text-sm truncate">Cảm ơn bạn đã đặt phòng...</p>
                  </div>
                  <span className="text-white/40 text-xs text-nowrap">2m</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <GlassCard className="h-full flex flex-col !p-0 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-6e53ce41be03?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold">Resort Ven Biển</h3>
                  <span className="flex items-center gap-1 text-green-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400 block" /> Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-white/70">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Phone size={20} /></button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Video size={20} /></button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[80%] px-4 py-2 text-white shadow-lg
                    ${msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rounded-tr-none'
                      : 'bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-none border border-white/20'}
                  `}>
                    {msg.text}
                    <div className={`text-[10px] opacity-60 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-all"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Chat;
