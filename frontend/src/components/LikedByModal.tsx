import { useInfiniteQuery } from '@tanstack/react-query';
import { likesApi } from '../api/likes';
import type { LikeableType } from '../types';

interface Props {
  likeableType: LikeableType;
  likeableId: string;
  onClose: () => void;
}

export function LikedByModal({ likeableType, likeableId, onClose }: Props) {
  const query = useInfiniteQuery({
    queryKey: ['likers', likeableType, likeableId],
    queryFn: ({ pageParam }) => likesApi.getLikers(likeableType, likeableId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const likers = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 px-3"
      style={{ zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-4 shadow w-100"
        style={{ maxWidth: 380, maxHeight: '70vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">Liked by</h2>
          <button type="button" onClick={onClose} className="btn-close" aria-label="Close" />
        </div>

        {query.isLoading && <p className="text-muted">Loading...</p>}
        {!query.isLoading && likers.length === 0 && <p className="text-muted">No likes yet.</p>}

        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {likers.map((liker) => (
            <li key={liker.userId} className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold flex-shrink-0"
                style={{ width: 36, height: 36 }}
              >
                {liker.fullName.charAt(0).toUpperCase()}
              </div>
              <span>{liker.fullName}</span>
            </li>
          ))}
        </ul>

        {query.hasNextPage && (
          <button
            type="button"
            onClick={() => query.fetchNextPage()}
            className="btn btn-outline-secondary btn-sm w-100 mt-3"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
