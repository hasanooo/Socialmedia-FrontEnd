import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
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
