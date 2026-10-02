import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';
import { useNotifications } from '../../contexts/NotificationContext';

const CURRENT_USER_ID = 'u1';

const MOCK_MOVIES = [
  { id: 'm1', title: 'Dune: Part Two', year: 2024, poster: 'https://image.tmdb.org/t/p/w200/8b8R8l88Qje9dn9OE11VDjT25yM.jpg' },
  { id: 'm2', title: 'Oppenheimer', year: 2023, poster: 'https://image.tmdb.org/t/p/w200/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
  { id: 'm3', title: 'Past Lives', year: 2023, poster: 'https://image.tmdb.org/t/p/w200/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg' },
  { id: 'm4', title: 'Spider-Man: Across the Spider-Verse', year: 2023, poster: 'https://image.tmdb.org/t/p/w200/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'c1',
    participant: { id: 'u2', name: 'Alex Chen', username: 'alexc', avatar: 'https://i.pravatar.cc/150?u=alexc' },
    unread: 2,
    messages: [
      { id: 'msg1', senderId: 'u2', text: 'Hey! Did you watch Dune 2 yet?', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'msg2', senderId: 'u1', text: 'Yes, saw it in IMAX yesterday. Incredible visual experience.', timestamp: new Date(Date.now() - 86400000 * 1.9).toISOString() },
      { id: 'msg3', senderId: 'u2', text: 'Right? The sound design was something else.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 'msg4', senderId: 'u2', text: 'What did you think of the ending?', timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString() },
    ]
  },
  {
    id: 'c2',
    participant: { id: 'u3', name: 'Jordan Smith', username: 'jsmith99', avatar: 'https://i.pravatar.cc/150?u=jsmith' },
    unread: 0,
    messages: [
      { id: 'msg5', senderId: 'u3', text: 'You gotta check out this one!', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 'msg6', senderId: 'u3', text: '', movieId: 'm3', timestamp: new Date(Date.now() - 86400000 * 5 + 30000).toISOString() },
      { id: 'msg7', senderId: 'u1', text: 'Oh I have been meaning to watch that.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
    ]
  },
  {
    id: 'c3',
    participant: { id: 'u4', name: 'Sam Taylor', username: 'samt', avatar: 'https://i.pravatar.cc/150?u=samt' },
    unread: 0,
    messages: [
      { id: 'msg8', senderId: 'u1', text: 'Are we still on for the watch party this weekend?', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
      { id: 'msg9', senderId: 'u4', text: 'Yes! I will bring snacks.', timestamp: new Date(Date.now() - 86400000 * 9).toISOString() },
    ]
  }
];

export default function Messages() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const { addNotification } = useNotifications();
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isMovieShareModalOpen, setIsMovieShareModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  const activeConversation = conversations.find(c => c.id === activeConvId);



  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const filteredConversations = conversations.filter(c => 
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() && !e?.movieId) return;

    const activeConv = conversations.find(c => c.id === activeConvId);

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: e?.movieId ? '' : newMessage.trim(),
      movieId: e?.movieId || null,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, messages: [...c.messages, newMsg] };
      }
      return c;
    }));

    if (activeConv) {
      setTimeout(() => {
        addNotification({
          type: 'message',
          actor: { name: activeConv.participant.name, avatar: activeConv.participant.avatar },
          action: 'sent you a message',
          target: null
        });
      }, 1500);
    }

    setNewMessage('');
    if (e?.movieId) {
      setShowMovieModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const { today, yesterday } = React.useMemo(() => {
    const t = new Date();
    const y = new Date(t);
    y.setDate(y.getDate() - 1);
    return { today: t, yesterday: y };
  }, []);

  const formatMessageDateGroup = (isoString) => {
    const date = new Date(isoString);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const dateStr = formatMessageDateGroup(msg.timestamp);
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(msg);
    });
    return groups;
  };

  const renderMovieCard = (movieId) => {
    const movie = MOCK_MOVIES.find(m => m.id === movieId);
    if (!movie) return null;
    return (
      <div className="message-movie-card">
        <img src={movie.poster} alt={movie.title} />
        <div className="message-movie-info">
          <h4>{movie.title}</h4>
          <span>{movie.year}</span>
        </div>
      </div>
    );
  };

  const goBackToList = () => {
    setActiveConvId(null);
    setIsMobileListVisible(true);
  };

  return (
    <div className="messages-page">
      <div className={`messages-container ${!isMobileListVisible ? 'mobile-show-chat' : ''}`}>
        
        {/* Left Panel - Conversation List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>
          <div className="conversations-search">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="empty-state">No conversations found</div>
            ) : (
              filteredConversations.sort((a, b) => {
                const lastA = new Date(a.messages[a.messages.length - 1].timestamp);
                const lastB = new Date(b.messages[b.messages.length - 1].timestamp);
                return lastB - lastA;
              }).map(conv => {
                const lastMessage = conv.messages[conv.messages.length - 1];
                const isActive = activeConvId === conv.id;
                return (
                  <div 
                    key={conv.id} 
                    className={`conversation-item ${isActive ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setConversations(prev => prev.map(c => 
                        c.id === conv.id ? { ...c, unread: 0 } : c
                      ));
                      setIsMobileListVisible(false);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-selected={isActive}
                  >
                    <img src={conv.participant.avatar} alt={conv.participant.name} className="avatar" />
                    <div className="conversation-details">
                      <div className="conversation-top">
                        <span className="name">{conv.participant.name}</span>
                        <span className="timestamp">{formatDate(lastMessage.timestamp)}</span>
                      </div>
                      <div className="conversation-bottom">
                        <span className="last-message">
                          {lastMessage.movieId ? 'Shared a movie' : lastMessage.text}
                        </span>
                        {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel - Active Chat */}
        <div className="chat-panel">
          {activeConversation ? (
            <>
              <div className="chat-header">
                <button className="back-btn" onClick={goBackToList} aria-label="Back to messages">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <img src={activeConversation.participant.avatar} alt={activeConversation.participant.name} className="avatar" />
                <div className="chat-header-info">
                  <h3>{activeConversation.participant.name}</h3>
                  <span>@{activeConversation.participant.username}</span>
                </div>
              </div>

              <div className="chat-messages">
                {Object.entries(groupMessagesByDate(activeConversation.messages)).map(([date, msgs]) => (
                  <React.Fragment key={date}>
                    <div className="date-divider"><span>{date}</span></div>
                    {msgs.map((msg, index) => {
                      const isMe = msg.senderId === CURRENT_USER_ID;
                      return (
                        <div key={msg.id} className={`message-wrapper ${isMe ? 'message-mine' : 'message-theirs'}`}>
                          {!isMe && (index === 0 || msgs[index - 1].senderId !== msg.senderId) && (
                            <img src={activeConversation.participant.avatar} alt="avatar" className="message-avatar" />
                          )}
                          <div className={`message-bubble ${msg.movieId ? 'movie-share' : ''}`}>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.movieId && renderMovieCard(msg.movieId)}
                            <span className="message-time">{formatDate(msg.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-composer">
                <button 
                  className="attach-btn" 
                  onClick={() => setIsMovieShareModalOpen(true)}
                  aria-label="Share a movie"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  rows={1}
                />
                <button 
                  className="send-btn" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="chat-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>Your Messages</h3>
              <p>Select a conversation or start a new one to chat.</p>
            </div>
          )}
        </div>
      </div>

      {/* Movie Share Modal */}
      {isMovieShareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMovieShareModalOpen(false)}>
          <div className="movie-share-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share a Movie</h3>
              <button className="close-btn" onClick={() => setIsMovieShareModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {MOCK_MOVIES.map(movie => (
                <div 
                  key={movie.id} 
                  className="shareable-movie-item"
                  onClick={() => handleSendMessage({ movieId: movie.id })}
                >
                  <img src={movie.poster} alt={movie.title} />
                  <div>
                    <h4>{movie.title}</h4>
                    <span>{movie.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
