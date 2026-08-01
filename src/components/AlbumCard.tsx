'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Album } from '@/types';
import styles from './AlbumCard.module.css';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/album/${album.id}`} className={styles.card}>
      <div className={styles.artwork}>
        <Image
          src={album.coverUrl || '/placeholder-album.jpg'}
          alt={album.title}
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
      <h3 className={styles.title}>{album.title}</h3>
      <p className={styles.artist}>{album.artist?.name}</p>
    </Link>
  );
}
