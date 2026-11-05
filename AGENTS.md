<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public course data is loaded through a publishable-key server function and TanStack Query; bundled images are resolved by subject so course storage remains deployment-independent.
- Student profiles use owner-scoped RLS and authenticated server functions; protected pages live under the client-only managed authentication layout.
- A single root account provider owns auth events and cache invalidation; sign-out cancels and clears queries before ending the session.
- Roles live only in public.user_roles and are checked through the security-definer public.has_role(); admin permissions are enforced by RLS and server-side role checks, never by profile fields or client state.
- Course videos are Google Drive file IDs embedded via the /preview player; access is gated by RLS on course_videos (approved enrollment, preview flag, or admin). Signed-in data uses the browser client with RLS.
- Course-stage rules share one browser-safe resolver across cards, catalog, account, and enrollment; database triggers prevent duplicate active requests, and completion is reserved for future verified assessments.
- Instructor photos use CDN asset pointers and achievements live in the shared site configuration so the home and About pages stay consistent.
- Admin quiz reporting reads recorded attempts, quiz labels and student names through the browser client with existing admin RLS; a shared browser-safe grouper preserves individual outcomes and per-quiz attempt numbering without fetching answer keys.
- Student dashboards use owner-scoped authenticated server reads; certificate PDFs recheck approved enrollment and all required quiz passes server-side, preventing client state from authorizing awards. Progress measures assessments, not Google Drive viewing time.
