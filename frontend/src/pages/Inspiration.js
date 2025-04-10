import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './styling/Inspiration.css';
import SendIcon from '@mui/icons-material/Send';

function Inspiration() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Begrüßung beim ersten Laden
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        role: 'assistant',
        content: `Hey 👋 Ich bin dein Travel Buddy!  
Schreib mir einfach, was du dir vorstellst – Strand, Abenteuer, Kultur oder ganz was anderes? 🌍✈️`
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Automatisch scrollen, wenn neue Nachrichten da sind
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (!chatBox) return;

    const isScrolledToBottom =
      chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 100;

    if (isScrolledToBottom) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/travelchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        const botMessage = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, botMessage]);
      } catch (jsonError) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Unerwartete Antwort vom Server:\n\n\`${text}\``,
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Netzwerkfehler: ${error.message}`,
      }]);
    }

    setLoading(false);
  };

  return (
    <div className='inspiration-page-container'>
      <div className='chat-box' ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {loading && <div className='message assistant'>⏳ ...</div>}
      </div>

      <div className='chat-input-container'>
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder='Ich will an den Strand, aber ich weiß nicht wohin...'
        />
        <button onClick={handleSend} disabled={loading}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default Inspiration;
