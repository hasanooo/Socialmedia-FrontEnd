import { useState } from 'react';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import { CommentComposer } from './CommentComposer';
import { LikeButton } from './LikeButton';
import { LikedByModal } from './LikedByModal';
import { addReplyToTree, bumpFeedCommentCount } from '../hooks/commentCache';
import type { Comment, CommentPage } from '../types';

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function CommentItem({ comment, postId, isReply = false }: { comment: Comment; postId: string; isReply?: boolean }) {
  const [replying, setReplying] = useState(false);
  const [showLikers, setShowLikers] = useState(false);
  const queryClient = useQueryClient();

  const createReply = useMutation({
    mutationFn: (content: string) => commentsApi.create(postId, content, comment.id),
    onSuccess: (newReply) => {
      setReplying(false);
      // Insert the created reply straight from this response instead of invalidating
      // ['comments', postId] — that would re-issue a GET for the whole thread on every reply.
      queryClient.setQueryData<InfiniteData<CommentPage>>(['comments', postId], (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map((page) => ({ ...page, items: addReplyToTree(page.items, comment.id, newReply) })) };
      });
      bumpFeedCommentCount(queryClient, postId);
    },
  });

  return (
    <div className={isReply ? '_comment_main ms-5 mt-3' : '_comment_main'}>
      <div className="_comment_image">
        <span className="_comment_image_link">
          <img src="/assets/images/comment_img.png" alt="" className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{comment.author.fullName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <LikeButton
                  variant="comment"
                  likeableType="Comment"
                  likeableId={comment.id}
                  liked={comment.likedByCurrentUser}
                  count={comment.likeCount}
                  onShowLikers={() => setShowLikers(true)}
                />
                {!isReply && (
                  <li>
                    <span role="button" onClick={() => setReplying((r) => !r)} style={{ cursor: 'pointer' }}>
                      Reply.
                    </span>
                  </li>
                )}
                <li>
                  <span className="_time_link">.{timeAgo(comment.createdAt)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {replying && (
          <div className="mt-2">
            <CommentComposer
              placeholder={`Reply to ${comment.author.fullName}...`}
              autoFocus
              submitting={createReply.isPending}
              onSubmit={(content) => createReply.mutate(content)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
        ))}
      </div>

      {showLikers && (
        <LikedByModal likeableType="Comment" likeableId={comment.id} onClose={() => setShowLikers(false)} />
      )}
    </div>
  );
}
