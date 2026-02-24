# Specification

## Summary
**Goal:** Add an admin view to PaySecure that allows reviewing all submitted payment records in a styled table.

**Planned changes:**
- Add an `AdminPage` component that displays all submitted payment records in a table with columns: Full Name, Email, Address, masked Card Number (last 4 digits only), Expiry Date, and Amount
- Style the admin table consistently with the existing light theme (white/off-white card surface, amber/gold accents, neutral typography)
- Show a loading state while data is fetching and an empty state message when no records exist
- Add a `useGetAllPayments` React Query hook in `useQueries.ts` that calls the backend `getAllPayments` canister method
- Update `App.tsx` to add routing between `PaymentPage` (default) and `AdminPage`
- Add an "Admin" navigation link in the sticky header on `PaymentPage`

**User-visible outcome:** Users can navigate to an Admin view via the header link and see a table of all submitted payment records with card numbers masked to show only the last 4 digits.
