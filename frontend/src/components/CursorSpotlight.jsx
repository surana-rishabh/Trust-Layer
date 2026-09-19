import React, { useState, useEffect } from 'react';

// Lightweight 60fps cursor spotlight & ambient glowing aura
export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(59, 130, 246, 0.07), rgba(255, 107, 0, 0.04) 40%, transparent 80%)`,
        transition: 'background 0.05s ease-out'
      }}
    />
  );
}
