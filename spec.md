# Specification

## Summary
**Goal:** Fix the "Payment service not ready" error that appears when submitting the payment form before the anonymous actor has finished initializing.

**Planned changes:**
- Gate the `useSubmitPayment` mutation in `useQueries.ts` so it only executes when the actor instance is non-null (`!!actor` guard).
- Disable the submit button and show a loading spinner while the actor is not yet ready, preventing premature form submission.
- Add at least 2 automatic retries with exponential back-off in `useSubmitPayment` to handle transient initialization or network errors.

**User-visible outcome:** Users no longer see the "Payment service not ready" error when submitting the payment form. The submit button is disabled with a loading indicator while the service initializes, and once ready, a valid submission completes successfully and shows the confirmation screen.
