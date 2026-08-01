'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function PremiumCard({ children, className = '', hover = true }: PremiumCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`premium-card rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
