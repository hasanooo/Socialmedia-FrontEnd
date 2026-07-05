export type Visibility = 'Public' | 'Private';
export type LikeableType = 'Post' | 'Comment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  fullName: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  visibility: Visibility;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  createdAt: string;
}

export interface FeedPage {
  items: Post[];
  nextCursor: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  author: PostAuthor;
  parentCommentId: string | null;
  content: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  replies: Comment[];
}

export interface CommentPage {
  items: Comment[];
  nextCursor: string | null;
}

export interface ToggleLikeResult {
  liked: boolean;
  likeCount: number;
}

export interface Liker {
  userId: string;
  fullName: string;
  likedAt: string;
}

export interface LikersPage {
  items: Liker[];
  nextCursor: string | null;
}
