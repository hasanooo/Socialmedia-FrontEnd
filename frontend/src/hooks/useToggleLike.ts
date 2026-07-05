import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likesApi } from '../api/likes';
import type { Comment, FeedPage, LikeableType, ToggleLikeResult } from '../types';

function patchCommentTree(comments: Comment[], id: string, apply: (c: Comment) => Comment): Comment[] {
  return comments.map((c) => (c.id === id ? apply(c) : { ...c, replies: patchCommentTree(c.replies, id, apply) }));
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ likeableType, likeableId }: { likeableType: LikeableType; likeableId: string }) =>
      likesApi.toggle(likeableType, likeableId),

    onMutate: async ({ likeableType, likeableId }) => {
      if (likeableType === 'Post') {
        queryClient.setQueriesData<FeedPage>({ queryKey: ['feed'] }, (old) =>
          old && {
            ...old,
            items: old.items.map((p) =>
              p.id === likeableId
                ? { ...p, likedByCurrentUser: !p.likedByCurrentUser, likeCount: p.likeCount + (p.likedByCurrentUser ? -1 : 1) }
                : p,
            ),
          },
        );
      } else {
        queryClient.setQueriesData<{ items: Comment[]; nextCursor: string | null }>(
          { queryKey: ['comments'] },
          (old) =>
            old && {
              ...old,
              items: patchCommentTree(old.items, likeableId, (c) => ({
                ...c,
                likedByCurrentUser: !c.likedByCurrentUser,
                likeCount: c.likeCount + (c.likedByCurrentUser ? -1 : 1),
              })),
            },
        );
      }
    },

    onSuccess: (result: ToggleLikeResult, { likeableType, likeableId }) => {
      if (likeableType === 'Post') {
        queryClient.setQueriesData<FeedPage>({ queryKey: ['feed'] }, (old) =>
          old && {
            ...old,
            items: old.items.map((p) =>
              p.id === likeableId ? { ...p, likedByCurrentUser: result.liked, likeCount: result.likeCount } : p,
            ),
          },
        );
      } else {
        queryClient.setQueriesData<{ items: Comment[]; nextCursor: string | null }>(
          { queryKey: ['comments'] },
          (old) =>
            old && {
              ...old,
              items: patchCommentTree(old.items, likeableId, (c) => ({
                ...c,
                likedByCurrentUser: result.liked,
                likeCount: result.likeCount,
              })),
            },
        );
      }
    },

    onError: (_err, { likeableType }) => {
      // Reconciliation on failure: refetch rather than trying to invert the optimistic patch.
      queryClient.invalidateQueries({ queryKey: [likeableType === 'Post' ? 'feed' : 'comments'] });
    },
  });
}
