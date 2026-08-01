'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Artist } from '@/types';
import styles from './ArtistCard.module.css';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artist/${artist.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={artist.imageUrl || '/placeholder-artist.jpg'}
          alt={artist.name}
          width={200}
          height={200}
          className={styles.image}
        />
        {artist.verified && (
          <div className={styles.verified}>
            <CheckCircle size={16} />
          </div>
        )}
      </div>
      <h3 className={styles.name}>{artist.name}</h3>
      <p className={styles.type}>Artist</p>
    </Link>
  );
}
