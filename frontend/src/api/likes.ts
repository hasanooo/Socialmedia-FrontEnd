import { apiClient } from './client';
import type { LikeableType, LikersPage, ToggleLikeResult } from '../types';

export const likesApi = {
  toggle: (likeableType: LikeableType, likeableId: string) =>
    apiClient.post<ToggleLikeResult>('/likes/toggle', { likeableType, likeableId }).then((r) => r.data),

  getLikers: (likeableType: LikeableType, likeableId: string, cursor?: string | null) =>
    apiClient
      .get<LikersPage>('/likes', { params: { likeableType, likeableId, cursor: cursor ?? undefined, limit: 20 } })
      .then((r) => r.data),
};
