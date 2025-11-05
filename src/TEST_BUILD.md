# 🧪 Test Build Before Deploying

## Quick Test Commands

Copy and paste these commands to test your build:

### Option 1: Quick Test (30 seconds)
```bash
npm install && npm run build && npm run preview
```

Then open http://localhost:4173 to test.

---

### Option 2: Full Test (1 minute)
```bash
# Clean everything
rm -rf node_modules package-lock.json dist

# Fresh install
npm install

# Build
npm run build

# Verify dist created
echo "Checking dist folder..."
ls -la dist/

# Check key files
echo "Checking index.html..."
ls dist/index.html && echo "✅ index.html exists"

echo "Checking assets..."
ls dist/assets/ && echo "✅ assets folder exists"

echo "Checking _redirects..."
ls dist/_redirects && echo "✅ _redirects exists"

# Preview
npm run preview
```

---

## Expected Success Output

### After `npm install`:
```
added [number] packages
```

### After `npm run build`:
```
vite v5.4.11 building for production...
✓ [number] modules transformed.
dist/index.html                [size] kB
dist/assets/index-[hash].css   [size] kB
dist/assets/index-[hash].js    [size] kB
dist/assets/vendor-[hash].js   [size] kB
✓ built in [time]s
```

### After `npm run preview`:
```
  ➜  Local:   http://localhost:4173/
  ➜  press h + enter to show help
```

---

## What to Check in Preview

Open http://localhost:4173 and verify:

1. **Home Page Loads**
   - [ ] Page displays correctly
   - [ ] Launch countdown shows
   - [ ] Statistics display
   - [ ] Liquid glass effects visible

2. **Navigation Works**
   - [ ] Header buttons work
   - [ ] Can navigate to About
   - [ ] Can navigate to Explore
   - [ ] Can navigate to Status
   - [ ] Footer buttons work

3. **Authentication**
   - [ ] Auth page loads
   - [ ] Can create demo account
   - [ ] Login works

4. **Features Work**
   - [ ] Profile page accessible
   - [ ] Settings page loads
   - [ ] No console errors

---

## If Build Fails

### Check 1: Node Version
```bash
node --version
# Must be 20.x or higher
```

If wrong version:
```bash
# Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use Node 20
nvm install 20
nvm use 20
```

### Check 2: Dependencies
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Check 3: Cache
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Check 4: Disk Space
```bash
df -h
# Make sure you have at least 1GB free
```

---

## Common Issues & Fixes

### Issue: "Cannot find module"
```bash
npm install
```

### Issue: "Build failed with errors"
```bash
npm run build 2>&1 | tee build-log.txt
# Check build-log.txt for specific errors
```

### Issue: "dist folder empty"
Check vite.config.ts has:
```typescript
build: {
  outDir: 'dist',
}
```

### Issue: "Permission denied"
```bash
chmod -R 755 .
npm run build
```

---

## One-Line Build Test

For absolute quickest test:

```bash
npm i && npm run build && ls -la dist/ && npm run preview
```

If this succeeds, you're 100% ready to deploy!

---

## Deploy After Success

Once your test passes:

1. **Commit changes**:
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Deploy to Netlify**:
   - Go to https://app.netlify.com/
   - Import repository
   - Click deploy

3. **Wait for build** (1-2 minutes)

4. **Update Discord OAuth** with your Netlify URL

---

## Quick Troubleshooting Reference

| Error | Solution |
|-------|----------|
| Module not found | `npm install` |
| Build fails | Clear cache, rebuild |
| dist not created | Check vite.config.ts |
| Preview fails | Check port 4173 available |
| Files missing | Re-run build |

---

## Success Checklist

- [ ] `npm install` works
- [ ] `npm run build` succeeds
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` has files
- [ ] `npm run preview` works
- [ ] Site loads at localhost:4173
- [ ] All pages work
- [ ] No console errors

**All checked?** → **Deploy now!** 🚀

---

## Final Command

```bash
# The ultimate test
npm install && \
npm run build && \
echo "✅ Build successful!" && \
ls -la dist/ && \
echo "✅ Dist folder created!" && \
npm run preview &
echo "✅ Preview started at http://localhost:4173"
```

If this runs without errors, your build is **100% ready** for Netlify! 🎉
