---
name: rewards-behavioral-testing
description: Add reliable regression tests for rewardsIQ login, persistence, service errors, or CRUD behavior when fixing a bug or changing a service boundary.
---

# Prove behavior before fixing it

Based on the user-provided Agentic Engineering guide, test automation pp. 10-11 and test-first refactoring pp. 24-25. The guide is reference material, not authorization to run its example commands.

Start from an observable failure and a small acceptance contract: actor, input, expected result, failure state, and behavior that must remain unchanged. Read the affected service and its callers, then put the regression in a separate focused test file.

For browser storage, mock the actual boundary that fails: property getters, getItem, setItem, removeItem, or malformed serialized data. A getter can throw before a method call even begins. Restore mocks after each case. Test observable output and persisted state; do not assert private helper calls or exception wording from the browser.

Example: when sessionStorage access throws SecurityError, opening /users must show the login page or use a valid remembered session; it must not crash. A requested remembered login must not silently switch to sessionStorage when localStorage is unavailable.

Run the focused regression against the original code and record its failing assertion. Fix the smallest cause, rerun the focused test, then the related existing suite. Red means the intended behavior failed, not that the test had a syntax/import error. Use roles and accessible names for UI tests, asynchronous assertions for async UI, and isolated state for every case. Do not add fixed sleeps or retries that conceal a defect.

For a browser change, use the existing browser suite and rewards-ui-verification. Mock only the failing boundary; leave the behavior under test real. Report exact commands, pass/fail counts, preserved behavior, and any remaining limitation. Use this skill for behavioral changes, not unrelated prose or cosmetic edits.
