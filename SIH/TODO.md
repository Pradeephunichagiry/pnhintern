# Fix API Route Params and Model for Next.js 15

## Problem
"Error submitting review: Failed to fetch" occurs when submitting a review in the educator dialog.

## Root Cause
- In Next.js 15, params in API routes are now Promises and must be awaited.
- The route src/app/api/submissions/[id]/review/route.ts was using the old synchronous params syntax.
- The Submission model was missing the 'score' field, which is required for the review update.

## Plan
1. **Edit src/app/api/submissions/[id]/review/route.ts:**
   - Change params type to Promise<{ id: string }>.
   - Await params to get the id.

2. **Edit src/lib/models/Submission.ts:**
   - Add 'score?: number' to the interface.
   - Add 'score: { type: Number }' to the schema.

## Followup Steps
- Test the review submission functionality.
- Verify that the error no longer occurs.
- Ensure the API responds correctly.
