import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import { LikeButton } from './LikeButton';
import { LikedByModal } from './LikedByModal';
import { CommentThread } from './CommentThread';
import type { Post } from '../types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function PostCard({ post, currentUserId }: { post: Post; currentUserId?: string }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showLikers, setShowLikers] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const deletePost = useMutation({
    mutationFn: () => postsApi.remove(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  });

  const isOwner = currentUserId === post.author.id;

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.author.fullName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatDate(post.createdAt)} . <span>{post.visibility === 'Private' ? 'Only me' : 'Public'}</span>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="_feed_timeline_post_dropdown_link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            <div className={`_feed_timeline_dropdown _timeline_dropdown ${menuOpen ? 'show' : ''}`}>
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <span className="_feed_timeline_dropdown_link">Save Post</span>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <span className="_feed_timeline_dropdown_link">Turn On Notification</span>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <span className="_feed_timeline_dropdown_link">Hide</span>
                </li>
                {isOwner && (
                  <li className="_feed_timeline_dropdown_item">
                    <span
                      role="button"
                      onClick={() => deletePost.mutate()}
                      className="_feed_timeline_dropdown_link"
                    >
                      Delete Post
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            <img src={post.thumbnailUrl ?? post.imageUrl} alt="" className="_time_img" />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span
              role="button"
              onClick={() => setCommentsOpen((v) => !v)}
              style={{ cursor: 'pointer' }}
            >
              <span>{post.commentCount}</span> {post.commentCount === 1 ? 'Comment' : 'Comments'}
            </span>
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <LikeButton
          likeableType="Post"
          likeableId={post.id}
          liked={post.likedByCurrentUser}
          count={post.likeCount}
          onShowLikers={() => setShowLikers(true)}
        />
        <button type="button" onClick={() => setCommentsOpen((v) => !v)} className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction" title="Sharing isn't available yet">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {commentsOpen && <CommentThread postId={post.id} />}

      {showLikers && <LikedByModal likeableType="Post" likeableId={post.id} onClose={() => setShowLikers(false)} />}
    </div>
  );
}
