# ✅ Pre-Deployment Checklist for Netlify

Use this checklist before deploying FORERUNNER to Netlify.

## 🔧 Local Build Test

### Step 1: Install Dependencies
```bash
npm install
```

Expected output: No errors, all packages installed

- [ ] Dependencies installed successfully
- [ ] No error messages
- [ ] `node_modules` folder created

### Step 2: Test Development Server
```bash
npm run dev
```

Expected output: Server running at `http://localhost:5173`

- [ ] Dev server starts without errors
- [ ] Site loads in browser
- [ ] All pages navigate correctly
- [ ] No console errors

### Step 3: Production Build
```bash
npm run build
```

Expected output: Build completes, `dist` folder created

- [ ] TypeScript compilation succeeds
- [ ] Vite build completes
- [ ] `dist` folder created
- [ ] No build errors
- [ ] Build time under 2 minutes

### Step 4: Preview Production Build
```bash
npm run preview
```

Expected output: Server running at `http://localhost:4173`

- [ ] Preview server starts
- [ ] Site looks correct
- [ ] All pages work
- [ ] Images load
- [ ] Launch countdown displays

## 📋 Configuration Checks

### Discord OAuth

- [ ] Discord app created at https://discord.com/developers/applications
- [ ] Client ID: `1435409989740265512` is correct
- [ ] OAuth2 redirect URI will be updated after deployment
- [ ] `/config/discord.ts` exists and is configured

### Build Configuration

- [ ] `netlify.toml` exists
- [ ] `vite.config.ts` has `base: '/'`
- [ ] `package.json` has correct scripts
- [ ] `.nvmrc` specifies Node 20
- [ ] `tsconfig.json` exists

### Public Assets

- [ ] `/public/_redirects` exists
- [ ] `/public/robots.txt` exists
- [ ] Other static assets in `/public` (if any)

## 🎨 Feature Verification

### Pages Load Correctly

- [ ] Home page (shows stats)
- [ ] About Us page
- [ ] Explore page
- [ ] Status page (embedded StatusPage.io)
- [ ] Legal page
- [ ] Rules page
- [ ] Socials page
- [ ] Contact page

### User System

- [ ] Auth page loads
- [ ] Can create account (test locally with localStorage)
- [ ] Profile page works
- [ ] Upload functionality works
- [ ] Settings page accessible
- [ ] Messages page accessible

### Features

- [ ] Launch countdown displays correctly
- [ ] Countdown shows correct date: Thursday 11/6/2025 @ 1PM EST
- [ ] Liquid glass aesthetic preserved
- [ ] Black and red color scheme
- [ ] Glassmorphism effects visible
- [ ] 24-hour security lock system implemented
- [ ] Privacy controls work (Public, Followers Only, Private)

### Navigation

- [ ] Header navigation works
- [ ] Footer buttons work
- [ ] Private pages accessible from footer
- [ ] Page transitions smooth
- [ ] No broken links

## 🔍 Code Quality

### No Console Errors

- [ ] No errors in browser console (dev mode)
- [ ] No errors in browser console (preview mode)
- [ ] No TypeScript errors
- [ ] No build warnings (or acceptable)

### Performance

- [ ] Initial load under 3 seconds (on good connection)
- [ ] Page transitions instant
- [ ] Images load quickly
- [ ] No layout shifts

## 📦 Git Repository

### Repository Ready

- [ ] All files committed
- [ ] `.gitignore` excludes `node_modules` and `dist`
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is public or Netlify has access

### Git Commands
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

- [ ] Git repository initialized
- [ ] All changes committed
- [ ] Pushed to remote

## 🚀 Ready for Deployment

If all checkboxes are checked, you're ready to deploy!

### Quick Deploy Steps

1. **Go to Netlify**: https://app.netlify.com/
2. **Import project**: Add new site → Import existing project
3. **Connect repo**: Authorize and select repository
4. **Deploy**: Click "Deploy site"
5. **Wait**: Build completes (2-3 minutes)
6. **Get URL**: Copy your site URL

### Post-Deployment Steps

1. **Update Discord OAuth**:
   - Go to Discord Developer Portal
   - Add redirect: `https://your-site.netlify.app/`
   - Update `/config/discord.ts` with new URL
   - Commit and push (auto-deploys)

2. **Test Live Site**:
   - [ ] Site loads at Netlify URL
   - [ ] All pages work
   - [ ] Discord OAuth works
   - [ ] Can create account
   - [ ] Can upload posts
   - [ ] Launch countdown displays

3. **Monitor**:
   - [ ] Check Netlify deploy log
   - [ ] Verify no errors
   - [ ] Test on mobile
   - [ ] Test on different browsers

## 🆘 Troubleshooting

### Build Fails on Netlify

1. Check Node version (should be 20)
2. Review Netlify build log
3. Verify all dependencies in `package.json`
4. Try building locally first

### Site Loads but Features Broken

1. Check browser console
2. Verify Discord OAuth redirect URI
3. Check localStorage enabled
4. Clear cache and reload

### Discord OAuth Doesn't Work

1. Verify redirect URI matches EXACTLY
2. Include trailing slash in URL
3. Check client ID is correct
4. Wait a few minutes for Discord to update

## 📊 Final Checklist

- [ ] Local build successful
- [ ] All features tested
- [ ] Git repository ready
- [ ] Discord OAuth configured
- [ ] Ready to update redirect URI after deploy
- [ ] Launch countdown date verified
- [ ] Documentation read

## 🎉 Deploy Command

When ready:

**Option 1**: Use Netlify UI (recommended)
**Option 2**: Use Netlify CLI: `netlify deploy --prod`
**Option 3**: Drag & drop `dist` folder

---

## 📚 Resources

- Quick Guide: `/QUICK_DEPLOY.md`
- Full Guide: `/NETLIFY_DEPLOY.md`
- Status: `/DEPLOYMENT_STATUS.md`

---

**Launch Date**: Thursday 11/6/2025 @ 1PM EST 🚀

Good luck with your deployment!
