# 🚀 Netlify Deployment Guide for FORERUNNER

Complete guide to deploy FORERUNNER to Netlify.

## Prerequisites

- Node.js 20+ installed
- Git installed
- Netlify account (free tier works!)
- GitHub/GitLab/Bitbucket account

## Method 1: Deploy via Netlify UI (Recommended)

### Step 1: Prepare Your Repository

```bash
# If not already initialized
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Netlify deployment"

# Push to your Git provider (GitHub example)
git remote add origin https://github.com/YOUR_USERNAME/forerunner.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your **forerunner** repository

### Step 3: Configure Build Settings

Netlify should auto-detect these settings, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20 (set in Environment Variables if needed)

### Step 4: Deploy!

Click **"Deploy site"** and Netlify will:
1. Install dependencies
2. Build your app
3. Deploy to a live URL (e.g., `random-name-123.netlify.app`)

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

### Step 3: Initialize Site

```bash
# In your project directory
netlify init
```

Follow the prompts to connect/create a site.

### Step 4: Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or deploy as draft first
netlify deploy
```

## Method 3: Drag & Drop (Quick Test)

```bash
# Build locally
npm install
npm run build

# Go to https://app.netlify.com/drop
# Drag the 'dist' folder
```

⚠️ This method doesn't enable continuous deployment.

## Post-Deployment Configuration

### 1. Update Discord OAuth

**CRITICAL**: Update your Discord OAuth redirect URI!

1. Go to [Discord Developer Portal](https://discord.com/developers/applications/1435409989740265512)
2. Navigate to **OAuth2** → **General**
3. Add your Netlify URL to **Redirects**:
   ```
   https://your-site-name.netlify.app/
   ```

4. Update `/config/discord.ts`:
```typescript
export const DISCORD_CONFIG = {
  clientId: '1435409989740265512',
  redirectUri: 'https://your-site-name.netlify.app/', // UPDATE THIS
  scope: 'identify guilds',
  responseType: 'code',
};
```

### 2. Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions
4. Enable **HTTPS** (automatic with Netlify)
5. Update Discord OAuth with custom domain

### 3. Environment Variables

If you need environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add variables (e.g., API keys)
3. They'll be available during build as `process.env.VARIABLE_NAME`

## Continuous Deployment

Once connected, Netlify automatically deploys when you push to your repository:

```bash
# Make changes
git add .
git commit -m "Update site"
git push

# Netlify automatically builds and deploys!
```

## Build Configuration

The `netlify.toml` file is already configured with:

- ✅ Build command and publish directory
- ✅ SPA redirect rules (for client-side routing)
- ✅ Security headers
- ✅ Asset caching

## Troubleshooting

### Build Fails

**Error**: `Cannot find module 'path'`
```bash
# Solution: Already fixed in package.json
npm install --save-dev @types/node
```

**Error**: TypeScript errors during build
```bash
# Temporarily disable strict mode (already done in tsconfig.json)
# Or fix the specific errors
```

**Error**: `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deploy Succeeds but Site Broken

**Issue**: Blank page or console errors
- Check browser console for errors
- Verify all imports are correct
- Check that all dependencies are in `dependencies` (not `devDependencies`)

**Issue**: Routes don't work (404 on refresh)
- Already fixed with redirect rules in `netlify.toml`

### Discord OAuth Not Working

- Verify redirect URI matches EXACTLY (including trailing slash)
- Check Discord Developer Portal settings
- Clear browser cache and cookies

### Site is Slow

```bash
# Already optimized with code splitting in vite.config.ts
# Check Netlify Analytics for performance insights
```

## Local Testing

Test the production build locally before deploying:

```bash
# Build
npm run build

# Preview (simulates production)
npm run preview

# Open http://localhost:4173
```

## Performance Optimization

Already implemented:

- ✅ Code splitting (vendor, ui, radix chunks)
- ✅ Asset caching headers
- ✅ Tree shaking
- ✅ Minification
- ✅ No sourcemaps in production

## Monitoring

### Netlify Analytics

Enable in **Site settings** → **Analytics** for:
- Page views
- Unique visitors
- Top pages
- Bandwidth usage

### Deploy Notifications

1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add integrations (Slack, Email, etc.)
3. Get notified when builds succeed/fail

## Rollback

If something goes wrong:

1. Go to **Deploys** in Netlify dashboard
2. Find a previous working deploy
3. Click **"Publish deploy"** to rollback

## Cost

- **Free tier**: 100 GB bandwidth/month
- **Automatic HTTPS**
- **Continuous deployment**
- **Forms (if needed)**

Perfect for FORERUNNER! 🚀

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy via CLI
netlify deploy --prod

# Open Netlify dashboard
netlify open
```

## Important Notes

- ✅ `netlify.toml` is already configured
- ✅ `vite.config.ts` is optimized for Netlify
- ✅ TypeScript is configured to build successfully
- ⚠️ Remember to update Discord OAuth redirect URI
- ⚠️ Don't commit sensitive data (use environment variables)

## Launch Countdown

Your launch countdown is set for **Thursday 11/6/2025 @ 1PM EST**. Make sure to deploy before then!

## Support

If you encounter issues:
- Check [Netlify Support Docs](https://docs.netlify.com/)
- Review build logs in Netlify dashboard
- Check browser console for errors
- Verify Discord OAuth configuration

---

🎉 **Ready to launch FORERUNNER!**

Your liquid glass aesthetic website with Discord OAuth, user profiles, posting system, and 24-hour security lock will be live on Netlify!
