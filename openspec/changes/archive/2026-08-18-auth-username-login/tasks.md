## 1. Database & Schema Updates

- [x] 1.1 Create migration `src/lib/supabase/schema/011_username_auth.sql` adding `username TEXT UNIQUE` to `public.profiles` with index on `LOWER(username)` [NEW]
- [x] 1.2 Update `src/lib/types.ts` to include optional/required `username?: string` in the `Profile` interface [MODIFY]
- [x] 1.3 Update `src/lib/supabase/schema/009_seed.sql` to populate default usernames for all seed profiles [MODIFY]

## 2. Server Actions Refactoring

- [x] 2.1 Refactor `loginAction` in `src/app/(auth)/login/actions.ts` to accept `username` instead of `email`, resolve the associated email via profile lookup, and authenticate [MODIFY]
- [x] 2.2 Refactor `signupAction` in `src/app/(auth)/login/actions.ts` to require and store `username` when creating profiles [MODIFY]

## 3. Auth UI & Demo Mode Updates

- [x] 3.1 Update `src/components/auth/LoginForm.tsx` replacing the email input with username input (icon `User`, `name="username"`, placeholder `usuario`) [MODIFY]
- [x] 3.2 Update `src/lib/demo.ts` setting demo profile username to `admin` [MODIFY]

## 4. Verification & Validation

- [x] 4.1 Run Next.js production build (`npm run build`) and lint verification to ensure zero errors
- [x] 4.2 Verify username prefill in demo mode and test login form submission
