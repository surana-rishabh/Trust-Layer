import React, { useRef, useEffect } from 'react';

// Interactive 3D Canvas Wireframe Polygon Gem reacting to cursor rotation
export default function ThreeDTrustGem({ width = 160, height = 160 }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef({ rx: 0.2, ry: 0.4, speedX: 0.008, speedY: 0.012 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // 3D Octahedron / Polygon Gem Vertices (X, Y, Z)
    const vertices = [
      [0, -1.2, 0],   // Top apex
      [1, 0, 0],      // Right
      [0, 0, 1],      // Front
      [-1, 0, 0],     // Left
      [0, 0, -1],     // Back
      [0, 1.2, 0]     // Bottom apex
    ];

    // Edges connecting vertices
    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], // Top pyramid
      [1, 2], [2, 3], [3, 4], [4, 1], // Middle ring
      [5, 1], [5, 2], [5, 3], [5, 4]  // Bottom pyramid
    ];

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotationRef.current.speedX = y * 0.05;
      rotationRef.current.speedY = x * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationRef.current.rx += rotationRef.current.speedX || 0.008;
      rotationRef.current.ry += rotationRef.current.speedY || 0.012;

      // Friction back to gentle rotation
      rotationRef.current.speedX *= 0.96;
      rotationRef.current.speedY *= 0.96;

      const cosX = Math.cos(rotationRef.current.rx);
      const sinX = Math.sin(rotationRef.current.rx);
      const cosY = Math.cos(rotationRef.current.ry);
      const sinY = Math.sin(rotationRef.current.ry);

      const projected = vertices.map(([vx, vy, vz]) => {
        // Rotate Y
        const x1 = vx * cosY - vz * sinY;
        const z1 = vx * sinY + vz * cosY;

        // Rotate X
        const y2 = vy * cosX - z1 * sinX;
        const z2 = vy * sinX + z1 * cosX;

        // Perspective projection
        const scale = 50 / (z2 + 3);
        const px = width / 2 + x1 * scale;
        const py = height / 2 + y2 * scale;
        return [px, py, z2];
      });

      // Draw Edges with glowing gradient
      ctx.lineWidth = 1.8;

      edges.forEach(([i, j]) => {
        const [x1, y1, z1] = projected[i];
        const [x2, y2, z2] = projected[j];

        const alpha = Math.max(0.2, (z1 + z2 + 4) / 6);
        ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#a855f7';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw Nodes
      projected.forEach(([px, py, z]) => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        cursor: 'grab'
      }}
    />
  );
}
