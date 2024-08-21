import React, { useState } from 'react';
import ChatBox from './components/ChatBox/ChatBox.jsx';
import UserSession from './components/UserSession/UserSession.jsx';
import MusicControl from './components/musiccontrol/MusicControl';
import backgroundMusic from './assets/music/We Can Do This.mp3';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleLogin = async ({ username, color }) => {
    setUser({ username, color });
    await loadInitialMessages(); // Cargar los mensajes cuando el usuario inicie sesión
  };

  const loadInitialMessages = async () => {
    try {
      const response = await axios.get('https://chat-back-unique2024.rj.r.appspot.com/chats?limit=100');
      setMessages(response.data);
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
    }
  };

  return (
    <div className="App">
      <MusicControl musicFile={backgroundMusic} />
      {!user ? (
        <UserSession onLogin={handleLogin} />
      ) : (
        <ChatBox username={user.username} color={user.color} messages={messages} />
      )}
    </div>
  );
};

export default App;
