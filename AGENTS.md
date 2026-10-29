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
