export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  premiumStatus: string;
  premiumExpiresAt?: Date;
  createdAt: Date;
}

export interface Artist {
  id: number;
  userId?: number;
  name: string;
  bio?: string;
  imageUrl?: string;
  verified: boolean;
  createdAt: Date;
  albums?: Album[];
  followerCount?: number;
}

export interface Album {
  id: number;
  artistId: number;
  title: string;
  coverUrl?: string;
  releaseYear: number;
  genre?: string;
  artist?: Artist;
  songs?: Song[];
  createdAt: Date;
}

export interface Song {
  id: string | number;
  albumId?: number;
  title: string;
  audioUrl?: string;
  duration: number;
  trackNumber?: number;
  lyrics?: any;
  plays: number;
  album?: Album;
  artist?: Artist;
  isLiked?: boolean;
  coverUrl?: string;
  genre?: string;
  releaseDate?: string;
}

export interface Playlist {
  id: number;
  userId: number;
  title: string;
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  songs?: PlaylistSong[];
  user?: User;
  createdAt: Date;
  songCount?: number;
}

export interface PlaylistSong {
  id: number;
  playlistId: number;
  songId: number;
  position: number;
  song?: Song;
}

export interface Like {
  id: number;
  userId: number;
  songId: number;
  createdAt: Date;
}

export interface Follow {
  id: number;
  userId: number;
  artistId: number;
  createdAt: Date;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export interface QueueItem {
  song: Song;
  addedAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: QueueItem[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isExpanded: boolean;
}

export interface SearchResult {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
