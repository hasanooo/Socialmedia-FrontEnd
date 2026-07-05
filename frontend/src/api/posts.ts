import { apiClient } from './client';
import type { FeedPage, Post, Visibility } from '../types';

export interface CreatePostPayload {
  content: string;
  visibility: Visibility;
  image?: File | null;
}

export const postsApi = {
  getFeed: (cursor?: string | null) =>
    apiClient.get<FeedPage>('/posts', { params: { cursor: cursor ?? undefined, limit: 10 } }).then((r) => r.data),

  getById: (id: string) => apiClient.get<Post>(`/posts/${id}`).then((r) => r.data),

  create: (payload: CreatePostPayload) => {
    const form = new FormData();
    form.append('Content', payload.content);
    form.append('Visibility', payload.visibility);
    if (payload.image) form.append('Image', payload.image);
    return apiClient.post<Post>('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
  },

  remove: (id: string) => apiClient.delete(`/posts/${id}`),
};
