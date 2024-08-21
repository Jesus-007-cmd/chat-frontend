import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './MusicControl.css';

const MusicControl = forwardRef(({ musicFile }, ref) => {
  const [music] = useState(new Audio(musicFile));
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    music.loop = true;
    music.volume = volume;
    const playPromise = music.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('La reproducción automática fue bloqueada:', error);
      });
    }
  }, [music, volume]);

  useImperativeHandle(ref, () => ({
    pauseMusic() {
      music.pause();
      setIsPlaying(false);
    }
  }));

  const togglePlayPause = () => {
    if (isPlaying) {
      music.pause();
    } else {
      music.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    music.volume = newVolume;
  };

  return (
    <div className="music-control-container">
      <div className="music-control">
        <span>Music:</span>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />} {/* Iconos de "Play" y "Pause" */}
          
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
});

export default MusicControl;
