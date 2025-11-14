# Testing GitHub Actions

This guide helps you test the two GitHub Actions created for this project.

## 🧪 Test Files Created

### 1. `public/utils.js` - JavaScript file WITHOUT tests
- **Purpose**: Triggers the auto-unit-test generation action
- **What it does**: When you create a PR with this file, the action should detect it lacks tests and auto-generate `utils.test.js`

### 2. `public/test-page.html` - HTML file with elements missing IDs
- **Purpose**: Triggers the auto-add-ids action
- **What it does**: When you create a PR with this file, the action should add `id` and `data-testid` attributes to elements

## 🚀 How to Test

### Option 1: Test Both Actions Together (Recommended)

```bash
# Create a new branch
git checkout -b test-github-actions

# Stage the test files
git add public/utils.js public/test-page.html public/main.test.js

# Commit the changes
git commit -m "test: add files to trigger GitHub Actions"

# Push to GitHub
git push origin test-github-actions
```

Then:
1. Go to your GitHub repository
2. Create a Pull Request from `test-github-actions` to `master`
3. Watch the Actions tab - you should see 2 workflows running
4. Wait for the actions to complete (usually 1-2 minutes)

### Expected Results:
✅ **Auto Generate Unit Tests Action**:
- Creates `public/utils.test.js` with test templates
- Adds a commit to your PR
- Posts a comment: "🤖 Unit Tests Auto-Generated"

✅ **Auto Add UI Component IDs Action**:
- Modifies `public/test-page.html` to add IDs to elements
- Adds a commit to your PR
- Posts a comment: "🤖 UI Component IDs Auto-Added"

---

### Option 2: Test Actions Separately

#### Test Auto-Unit-Tests Action Only:
```bash
git checkout -b test-auto-tests
git add public/utils.js
git commit -m "test: add utils without tests"
git push origin test-auto-tests
# Then create PR on GitHub
```

#### Test Auto-Add-IDs Action Only:
```bash
git checkout -b test-auto-ids
git add public/test-page.html
git commit -m "test: add HTML without IDs"
git push origin test-auto-ids
# Then create PR on GitHub
```

---

## 🔍 Monitoring the Actions

### View in GitHub:
1. **Actions Tab**: See all workflow runs
2. **Pull Request**: See automated commits and comments
3. **Checks Section**: See status of each action

### What to Look For:
- ✓ Green checkmarks indicate success
- 🤖 Bot commits appear in PR timeline
- 💬 Bot comments explain what was done
- 📝 Generated files appear in the PR's "Files changed" tab

---

## 🐛 Troubleshooting

### Actions Don't Run:
- ✓ Ensure Actions are enabled: Settings → Actions → Allow all actions
- ✓ Check workflow files exist in `.github/workflows/`
- ✓ Verify you created a **Pull Request** (not just pushed to master)
- ✓ Check that file paths match the `paths:` filters in workflows

### Actions Fail:
- ✓ Check the Actions tab for error logs
- ✓ Ensure `package.json` has the required dependencies
- ✓ Verify the workflow YAML syntax is correct

### No Commits Added:
- ✓ Check if files already have tests or IDs
- ✓ Review action logs - may indicate "no changes needed"
- ✓ Ensure the scripts in `.github/scripts/` are executable

---

## 📊 Success Indicators

You'll know everything works when you see:

1. **In the Actions Tab**:
   - ✅ Both workflows show green checkmarks
   - 📝 Logs show "Generated test file" or "Added IDs"

2. **In Your Pull Request**:
   - 🤖 2 automated commits from `github-actions[bot]`
   - 💬 2 comments explaining what was done
   - 📝 New/modified files in "Files changed"

3. **In Your Local Files** (after merging):
   - 📄 `public/utils.test.js` exists
   - 🆔 `public/test-page.html` has `id` attributes

---

## 🎯 Quick Verification

After creating your PR, run these checks:

```bash
# Check if test file was generated
ls -la public/utils.test.js

# Check if HTML was modified (should see id attributes)
grep 'id=' public/test-page.html

# Pull the changes locally
git pull origin test-github-actions
```

---

## 📝 Notes

- Actions only run on **Pull Requests**, not direct pushes to master
- Each action runs independently and in parallel
- Actions use `github-actions[bot]` account for commits
- Generated content may need manual review/adjustment

---

## ✨ What's Next?

After verifying the actions work:
1. Merge the test PR or close it
2. The actions will run automatically on all future PRs
3. Customize the scripts in `.github/scripts/` as needed
4. Add more validation or custom logic to the workflows

Happy testing! 🎉
