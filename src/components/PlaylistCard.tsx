'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Playlist } from '@/types';
import styles from './PlaylistCard.module.css';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist.id}`} className={styles.card}>
      <div className={styles.artwork}>
        <Image
          src={playlist.coverUrl || '/placeholder-playlist.jpg'}
          alt={playlist.title}
          width={200}
          height={200}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <button className={styles.playBtn}>
            <Play size={24} fill="currentColor" />
          </button>
        </div>
      </div>
      <h3 className={styles.title}>{playlist.title}</h3>
      <p className={styles.description}>{playlist.description || 'Playlist'}</p>
    </Link>
  );
}
