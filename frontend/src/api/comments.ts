import { apiClient } from './client';
import type { Comment, CommentPage } from '../types';

export const commentsApi = {
  getForPost: (postId: string, cursor?: string | null) =>
    apiClient
      .get<CommentPage>(`/posts/${postId}/comments`, { params: { cursor: cursor ?? undefined, limit: 20 } })
      .then((r) => r.data),

  create: (postId: string, content: string, parentCommentId?: string | null) =>
    apiClient
      .post<Comment>(`/posts/${postId}/comments`, { content, parentCommentId: parentCommentId ?? null })
      .then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/comments/${id}`),
};
