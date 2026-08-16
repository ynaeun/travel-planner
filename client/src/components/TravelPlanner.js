import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './TravelPlanner.css';

const TravelPlanner = () => {
  const location = useLocation();
  const festival = location.state?.festival;

  const [messages, setMessages] = useState([
    { type: 'ai', content: '안녕하세요! 여행 계획을 도와드릴게요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendPrompt = useCallback(async (promptText) => {
    setMessages(prev => [...prev, { type: 'user', content: promptText }]);
    setIsLoading(true);
    try {
      const response = await fetch('https://travelplanner-i4kw.onrender.com/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  }, []);

  useEffect(() => {
    if (festival) {
      setMessages([
        { type: 'ai', content: '안녕하세요! 여행 계획을 도와드릴게요.' }
      ]);
      const prompt = `
"${festival.title}" 축제에 맞는 여행 계획을 추천해줘.
축제 정보:
- 기간: ${festival.eventstartdate} ~ ${festival.eventenddate}
- 위치: ${festival.addr1}
${festival.overview ? '- 설명: ' + festival.overview : ''}
      `;
      sendPrompt(prompt);
    }
  }, [festival, sendPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendPrompt(input);
  };

  return (
    <div className="planner-container">
      <h2 className="planner-title">AI 여행 플래너</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.type}`}>
            <div className="chat-bubble">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && <div className="chat-message ai"><div className="chat-bubble">AI가 답변 중...</div></div>}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="여행 계획에 대해 물어보세요..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>전송</button>
      </form>
    </div>
  );
};

export default TravelPlanner;
