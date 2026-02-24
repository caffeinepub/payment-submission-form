# Specification

## Summary
**Goal:** Fix the AdminPage so that after a successful Internet Identity login, the full payments table is correctly displayed with all payment records.

**Planned changes:**
- Fix the AdminPage to correctly re-evaluate the `isAuthenticated` flag after the login flow completes, replacing the login gate with the payments table.
- Ensure the payments table renders all columns: Full Name, Email, Address, Card Number (masked to last 4 digits), Expiry Date, and Amount.
- Display the authenticated user's principal in the AdminPage header alongside the Logout button.
- Show an empty-state message when no payment records exist.
- Restore the login gate view upon logout.
- Update the `useGetAllPayments` hook to use the authenticated actor from `useActor` instead of an anonymous actor after login.
- Automatically refetch or invalidate the payments query when the actor/identity changes post-login.

**User-visible outcome:** After logging in via Internet Identity on the AdminPage, the user sees the full payments table populated with all payment records instead of a blank, loading, or login-gate state.
