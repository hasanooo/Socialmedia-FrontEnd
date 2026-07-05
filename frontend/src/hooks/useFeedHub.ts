import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import type { Comment, FeedPage } from '../types';

interface LikeChangedPayload {
  type: 'Post' | 'Comment';
  id: string;
  likeCount: number;
}

interface CommentAddedPayload {
  postId: string;
  comment: Comment;
}

/**
 * Subscribes to the backend's SignalR feed hub (Redis-backed) and patches the TanStack Query
 * cache directly so like/comment counts update live across open tabs without polling.
 */
export function useFeedHub(currentUserId: string | undefined) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/feed')
      .withAutomaticReconnect()
      .build();

    connection.on('LikeChanged', (payload: LikeChangedPayload) => {
      if (payload.type === 'Post') {
        queryClient.setQueriesData<FeedPage>({ queryKey: ['feed'] }, (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((p) => (p.id === payload.id ? { ...p, likeCount: payload.likeCount } : p)),
          };
        });
      } else {
        queryClient.setQueriesData<{ items: Comment[]; nextCursor: string | null }>(
          { queryKey: ['comments'] },
          (old) => {
            if (!old) return old;
            const patch = (comments: Comment[]): Comment[] =>
              comments.map((c) =>
                c.id === payload.id
                  ? { ...c, likeCount: payload.likeCount }
                  : { ...c, replies: patch(c.replies) },
              );
            return { ...old, items: patch(old.items) };
          },
        );
      }
    });

    connection.on('CommentAdded', (payload: CommentAddedPayload) => {
      if (payload.comment.author.id === currentUserId) return; // already applied optimistically
      queryClient.invalidateQueries({ queryKey: ['comments', payload.postId] });
      queryClient.setQueriesData<FeedPage>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((p) =>
            p.id === payload.postId ? { ...p, commentCount: p.commentCount + 1 } : p,
          ),
        };
      });
    });

    connection.start().catch(() => {
      // best-effort: live updates are a progressive enhancement, not required for correctness
    });
    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [queryClient, currentUserId]);
}
