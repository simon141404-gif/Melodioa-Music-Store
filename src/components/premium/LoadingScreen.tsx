'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-100 dark:bg-background-900">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1DB954"
              strokeWidth="4"
              fill="none"
              strokeDasharray="200"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        <p className="text-text-100 dark:text-text-900">{message}</p>
      </div>
    </div>
  );
}
