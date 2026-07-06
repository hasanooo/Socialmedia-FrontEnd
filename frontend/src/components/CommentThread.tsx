import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';
import { bumpFeedCommentCount } from '../hooks/commentCache';
import type { CommentPage } from '../types';

export function CommentThread({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => commentsApi.getForPost(postId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const createComment = useMutation({
    mutationFn: (content: string) => commentsApi.create(postId, content, null),
    onSuccess: (newComment) => {
      // Insert the created comment straight from this response instead of invalidating
      // ['comments', postId] — that would re-issue a GET for the whole thread on every comment.
      queryClient.setQueryData<InfiniteData<CommentPage>>(['comments', postId], (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return { ...old, pages: [{ ...firstPage, items: [...firstPage.items, newComment] }, ...rest] };
      });
      bumpFeedCommentCount(queryClient, postId);
    },
  });

  const comments = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentComposer submitting={createComment.isPending} onSubmit={(content) => createComment.mutate(content)} />
      </div>

      <div className="_timline_comment_main">
        {query.isLoading && <p className="px-3">Loading comments...</p>}

        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}

        {query.hasNextPage && (
          <div className="_previous_comment">
            <button type="button" onClick={() => query.fetchNextPage()} className="_previous_comment_txt">
              {query.isFetchingNextPage ? 'Loading...' : 'View more comments'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
