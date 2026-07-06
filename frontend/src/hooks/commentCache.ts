import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { Comment, FeedPage } from '../types';

export function addReplyToTree(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) =>
    c.id === parentId ? { ...c, replies: [...c.replies, reply] } : { ...c, replies: addReplyToTree(c.replies, parentId, reply) },
  );
}

export function bumpFeedCommentCount(queryClient: QueryClient, postId: string) {
  queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: ['feed'] }, (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        items: page.items.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p)),
      })),
    };
  });
}
