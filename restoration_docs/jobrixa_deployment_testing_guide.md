# 🧪 Jobrixa Deployment & Testing Guide

## Pre-Deployment
1. Run `npm run build`.
2. Check for unused variables or lint errors.
3. Verify `dist/` directory size (~1.2MB JS).

## Testing Matrix
| Feature | Check | Priority |
| :--- | :--- | :--- |
| **Theme** | All pages have midnight background? | 🔴 High |
| **Avatar** | Sidebar and Settings show initials? | 🔴 High |
| **Feedback** | Does the modal open from Sidebar? | 🔴 High |
| **Charts** | Are they visible on dark background? | 🔴 High |
| **Mobile** | Sidebar collapses into bottom bar? | 🟡 Med |

## Rollback
1. `git log` to find the last stable commit.
2. `git reset --hard <commit_hash>`.
3. `vercel --prod`.

---
Testing completed on local build.
