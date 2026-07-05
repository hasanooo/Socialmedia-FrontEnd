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
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
            <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
            <path
              fill="#664500"
              d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
            />
            <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
            <path
              fill="#664500"
              d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
            />
          </svg>
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
