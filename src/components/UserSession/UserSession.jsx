import React, { useState } from 'react';
import './UserSession.css';

// Importa los archivos de sonido
import sound1 from '../../assets/sounds/mixkit-hard-single-key-press-in-a-laptop-2542.mp3';
import sound2 from '../../assets/sounds/mixkit-single-key-press-in-a-laptop-2541.mp3';
import sound3 from '../../assets/sounds/mixkit-single-key-type-2533.mp3';

const UserSession = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [error, setError] = useState('');

  // Carga los sonidos de teclado
  const typingSounds = [
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
  ];

  // Función para reproducir un sonido de teclado aleatorio
  const playRandomTypingSound = () => {
    const randomIndex = Math.floor(Math.random() * typingSounds.length);
    const selectedSound = typingSounds[randomIndex];
    selectedSound.currentTime = 0; // Reinicia el sonido si se reproduce varias veces
    selectedSound.play();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setError('El nombre de usuario no puede estar vacío.');
    } else {
      onLogin({ username, color });
    }
  };

  return (
    <div className="user-session">
      
      <form onSubmit={handleSubmit}>
        
        <h2>¡Bienvenido!</h2>
        <input
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          value={username}
          onKeyDown={playRandomTypingSound}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="color-picker">
          <label htmlFor="colorInput">Elige el color de tu texto:</label>
          <input
            id="colorInput"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
        
      </form>
      
    </div>
  );
};

export default UserSession;
