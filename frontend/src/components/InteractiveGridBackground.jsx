import React, { useEffect, useRef } from 'react';

// 60fps Interactive Grid Canvas Component spanning full background
export default function InteractiveGridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const gridSize = 40;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark canvas fill
      ctx.fillStyle = '#010102';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid lines with cursor glow reaction
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 220;

          let alpha = 0.04;
          if (dist < maxDist) {
            alpha = 0.04 + (1 - dist / maxDist) * 0.15;
          }

          ctx.strokeStyle = `rgba(94, 106, 210, ${alpha})`;
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }

      // Radial spotlight around cursor
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
      gradient.addColorStop(0, 'rgba(94, 106, 210, 0.08)');
      gradient.addColorStop(1, 'rgba(1, 1, 2, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Background Loop Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: 0.45,
          pointerEvents: 'none',
          zIndex: 0
        }}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* 60fps Interactive Grid Canvas Component in full background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
    </>
  );
}
