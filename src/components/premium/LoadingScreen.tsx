'use client';

import React, { useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  if (isComplete) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.iconWrapper}>
            <Music className={styles.icon} />
          </div>
          <h1 className={styles.title}>Melodia</h1>
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
