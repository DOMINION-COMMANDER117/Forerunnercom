# ⚡ Quick Deploy to Netlify

## 🚀 Fastest Way to Deploy

### Option 1: Netlify UI (2 minutes)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy to Netlify"
git push
```

2. **Go to Netlify**:
   - Visit https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Click "Deploy site"

3. **Done!** Your site is live at `https://random-name.netlify.app`

### Option 2: Drag & Drop (1 minute)

```bash
npm install
npm run build
```

Then drag the `dist` folder to https://app.netlify.com/drop

---

## ⚠️ IMPORTANT: Update Discord OAuth

After deployment, you MUST update your Discord redirect URI:

1. Copy your Netlify URL (e.g., `https://your-site.netlify.app/`)
2. Go to https://discord.com/developers/applications/1435409989740265512
3. OAuth2 → Add redirect: `https://your-site.netlify.app/`
4. Update `/config/discord.ts` with your new URL
5. Push changes

---

## 🔧 Build Commands (for Netlify)

If Netlify asks, use these settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20

---

## ✅ Pre-Deployment Checklist

- [ ] All files committed to Git
- [ ] Repository pushed to GitHub/GitLab
- [ ] Discord app created with correct redirect URI
- [ ] Ready to update Discord OAuth after deployment

---

## 🎉 That's It!

Full guide: See `/NETLIFY_DEPLOY.md`

Your FORERUNNER site with liquid glass UI, Discord auth, and 24hr security lock will be live in minutes!

**Launch Date**: Thursday 11/6/2025 @ 1PM EST 🚀
