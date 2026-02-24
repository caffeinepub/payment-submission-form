# Specification

## Summary
**Goal:** Fix persistent bugs causing the admin payments table to fail loading and payment submissions to fail in PaymentForm Pro.

**Planned changes:**
- Rewrite the `getAllPayments` backend query in `backend/main.mo` to ensure submitted records are persisted in stable storage, correctly returned, and never lost on canister upgrade; return an empty array when no records exist
- Rewrite `frontend/src/hooks/useActor.ts` and `frontend/src/hooks/useQueries.ts` to expose an `actorReady` boolean, gate queries/mutations on actor readiness, add retry logic with exponential back-off, and auto-invalidate the payments query after login
- Update `frontend/src/pages/AdminPage.tsx` to show a loading spinner during retries, display errors only after all retries are exhausted, and render all payment rows (with masked card numbers) automatically after login
- Update `frontend/src/components/PaymentForm.tsx` to disable the submit button with a spinner while the actor is not ready, prevent the 'Payment service not ready' error, and surface actual backend rejection reasons on failure

**User-visible outcome:** After logging in, the admin payments table loads automatically and displays all submitted records without a manual refresh; payment submissions no longer fail due to actor initialization timing, and meaningful error messages are shown only when all retries are exhausted.
