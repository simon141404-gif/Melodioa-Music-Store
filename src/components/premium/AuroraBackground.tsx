'use client';

import React, { useEffect, useRef } from 'react';
import styles from './AuroraBackground.module.css';

interface AuroraBackgroundProps {
  children: React.ReactNode;
}

export default function AuroraBackground({ children }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.003;
      
      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.sin(time * 0.5) * 0.2),
        canvas.height * (0.3 + Math.cos(time * 0.3) * 0.2),
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient1.addColorStop(0, 'rgba(29, 185, 84, 0.15)');
      gradient1.addColorStop(0.5, 'rgba(29, 185, 84, 0.05)');
      gradient1.addColorStop(1, 'transparent');

      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.cos(time * 0.4) * 0.2),
        canvas.height * (0.6 + Math.sin(time * 0.6) * 0.2),
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.6
      );
      gradient2.addColorStop(0, 'rgba(129, 71, 230, 0.12)');
      gradient2.addColorStop(0.5, 'rgba(129, 71, 230, 0.04)');
      gradient2.addColorStop(1, 'transparent');

      const gradient3 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time * 0.7) * 0.3),
        canvas.height * (0.8 + Math.cos(time * 0.2) * 0.1),
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      );
      gradient3.addColorStop(0, 'rgba(255, 107, 107, 0.08)');
      gradient3.addColorStop(0.5, 'rgba(255, 107, 107, 0.02)');
      gradient3.addColorStop(1, 'transparent');

      ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
