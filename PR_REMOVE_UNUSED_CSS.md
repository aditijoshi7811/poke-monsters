# Proposed removal of unused CSS utilities

Branch: `chore/remove-unused-css`

## Summary
This change removes several global utility CSS classes from `src/styles/global.scss` that showed no usage within the `src/` tree according to a grep-based scan. This is a conservative cleanup intended to reduce CSS surface area and maintenance overhead.

**Classes removed:**
- `.text-center`
- `.text-primary`
- `.text-secondary`
- `.bg-primary`
- `.bg-secondary`
- `.bg-accent`

> These were removed in a single commit; a note was left in the stylesheet documenting which classes were removed and why.

## Why this is safe
- I searched the entire `src/` directory for literal class name occurrences (grep) and did not find any matches for the removed classes.
- The removals are limited to utilities that are not tied to component-scoped styles.

## How to review / test (Checklist)
- [ ] Checkout the branch `chore/remove-unused-css`
- [ ] Run the dev server: `npm run dev`
- [ ] Smoke test all user flows:
  - Home / Navigation
  - Capture view: Find / Throw / Ignore
  - Event log typewriter and collection modal
  - Quit confirmation modal
- [ ] Visual check (desktop & mobile simulated) for layout/regression issues
- [ ] Search the repo for dynamic construction of these class names (e.g., template strings) to confirm no false negatives

## Revert instructions
If you find the removal causes a regression, you can revert the commit or re-add the needed utility class in `src/styles/global.scss`.

---

If you'd like, I can also:
- Run a quick screenshot or visual diff test locally to catch regressions automatically,
- or keep the branch open and remove more classes incrementally after your review.
