import { useToggleLike } from '../hooks/useToggleLike';
import type { LikeableType } from '../types';

interface Props {
  likeableType: LikeableType;
  likeableId: string;
  liked: boolean;
  count: number;
  onShowLikers: () => void;
  variant?: 'post' | 'comment';
}

export function LikeButton({ likeableType, likeableId, liked, count, onShowLikers, variant = 'post' }: Props) {
  const toggle = useToggleLike();

  if (variant === 'comment') {
    return (
      <>
        <li>
          <span
            role="button"
            onClick={() => toggle.mutate({ likeableType, likeableId })}
            style={{ fontWeight: liked ? 700 : undefined, cursor: 'pointer' }}
          >
            {liked ? 'Liked.' : 'Like.'}
          </span>
        </li>
        {count > 0 && (
          <li>
            <span role="button" onClick={onShowLikers} style={{ cursor: 'pointer' }}>
              {count} {count === 1 ? 'like' : 'likes'}
            </span>
          </li>
        )}
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle.mutate({ likeableType, likeableId })}
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? '_feed_reaction_active' : ''}`}
    >
      <span className="_feed_inner_timeline_reaction_link">
        <span>
          {liked ? 'Liked' : 'Like'}
          {count > 0 && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowLikers();
              }}
              style={{ marginLeft: 4, textDecoration: 'underline' }}
            >
              ({count})
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
