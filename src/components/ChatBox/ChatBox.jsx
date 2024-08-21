import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBox.css';
// Importa los archivos de sonido
import sound1 from '../../assets/sounds/mixkit-hard-single-key-press-in-a-laptop-2542.mp3';
import sound2 from '../../assets/sounds/mixkit-single-key-press-in-a-laptop-2541.mp3';
import sound3 from '../../assets/sounds/mixkit-single-key-type-2533.mp3';

const ChatBox = ({ username, color: initialColor }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState(initialColor);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref para el final del contenedor de mensajes
  const [lastTimestamp, setLastTimestamp] = useState(null);

  const [lastMessageId, setLastMessageId] = useState(null);

  useEffect(() => {
    // Función para obtener los últimos 100 mensajes al iniciar
    axios.get('https://chat-back-unique2024.rj.r.appspot.com/chats')
      .then(response => {
        setMessages(response.data);
        if (response.data.length > 0) {
          setLastMessageId(response.data[response.data.length - 1].id);
        }
      })
      .catch(error => console.error('Error fetching messages:', error));
   
    // Intervalo para verificar nuevos mensajes
    const intervalId = setInterval(() => {
      if (lastMessageId) {
        axios.get('https://chat-back-unique2024.rj.r.appspot.com/chats/new', {
          params: { lastReadId: lastMessageId }
        })
        .then(response => {
          if (response.data.length > 0) {
            setMessages(prevMessages => [...prevMessages, ...response.data]);
            setLastMessageId(response.data[response.data.length - 1].id);
          }
        })
        .catch(error => console.error('Error fetching new messages:', error));
      }
    }, 1000); // Ejecutar cada segundo

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [lastMessageId]);
  
  // Carga los sonidos de teclado
  const typingSounds = [
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
  ];

  useEffect(() => {
    // Enfocar automáticamente el cuadro de texto cuando el componente se monta
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // Desplazar hacia el final cuando se agrega un nuevo mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Ejecutar este efecto cada vez que cambien los mensajes

  
  const handleSendMessage = () => {
    if (text.trim() !== '') {
      const newMessage = {
        username,
        message: text,
        color,
      };
      axios.post('https://chat-back-unique2024.rj.r.appspot.com/chats', newMessage)
        .then(response => {
          setMessages([...messages, response.data]);
          setLastTimestamp(response.data.timestamp);
          setText(''); // Limpiar el input después de enviar el mensaje
        })
        .catch(error => console.error('Error sending message:', error));
    }
  };

  const handleKeyDown = (event) => {
    const randomIndex = Math.floor(Math.random() * typingSounds.length);
    const selectedSound = typingSounds[randomIndex];
    selectedSound.currentTime = 0; // Reinicia el sonido si se reproduce varias veces
    selectedSound.play();
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} style={{ color: message.color }}>
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Este es el ref para el scroll automático */}
      </div>
      <div className="input-bar">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje y presiona Enter"
        />
        <div className="color-picker-container">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Cambiar color del texto"
          />
          <p className="color-text">Cambiar color</p>
        </div>
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
      
    </div>
  );
};

export default ChatBox;
