export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  authorName: string;
  published: boolean;
  summary?: string | null;
  tags?: string[];
  likes?: number;
  likedBy?: string[]; // Array of user IDs who have liked this post
}

export interface Comment {
  id: string;
  blogId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date | string;
} 