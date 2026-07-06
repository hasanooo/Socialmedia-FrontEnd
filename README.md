## Feed, Posts & Comments Behavior

### Authentication

- The backend (hosted on Render's free tier) cold-starts after ~15 minutes of
  inactivity, which can take 30–60+ seconds to respond to the first request.
- The API client (`src/api/client.ts`) enforces a 60s request timeout so a
  slow/cold backend fails predictably instead of hanging indefinitely.
- Login and register show a "the server may be waking up from idle" hint if
  the request takes longer than ~5 seconds, and surface a friendly message
  instead of a generic error on timeout/network failure.

### Post creation

- Creating a post (`PostComposer.tsx`) does **not** trigger a full feed
  refetch. The newly created post (returned directly from the
  `POST /api/posts` response) is inserted straight into the local feed cache.
- The author sees their new post immediately with no additional API call.
- Other users — or the same user on reload — see the new post the next time
  their feed query naturally runs (page load, manual refresh). There is no
  live push of new posts to other open sessions.

### Comments & replies

- Posting a comment or reply (`CommentThread.tsx`, `CommentItem.tsx`) does
  **not** invalidate/refetch the whole comment thread. The created
  comment/reply is inserted directly into the cached comment tree from the
  API response.
- The commenter sees their comment immediately with no extra `GET` request.
- The post's comment count updates locally for the commenter, and is pushed
  to other connected users via SignalR (`useFeedHub.ts`, `CommentAdded`
  event) so open feeds reflect the new count live; the full comment list
  itself is only refetched when a user opens/reloads the thread.

### Likes

- Liking a post or comment (`useToggleLike.ts`) uses an optimistic update
  against the local cache, then reconciles with the server response
  (`POST /api/likes/toggle`).
- Like counts also update live across sessions via SignalR (`LikeChanged`
  event in `useFeedHub.ts`).

### Post visibility

- Posts can be `Public` or `Private` ("Only me"), set at creation time via
  `PostComposer.tsx` and enforced server-side — the feed endpoint
  (`GET /api/posts`) returns only the posts each requesting user is allowed
  to see; the frontend does not do any client-side visibility filtering.

### Caching notes

- The feed and comment lists are paginated with `useInfiniteQuery`, cached
  as `{ pages, pageParams }`. Any code that patches these caches directly
  (likes, new posts/comments, SignalR events) must map over `pages`, not a
  flat `items` array.
