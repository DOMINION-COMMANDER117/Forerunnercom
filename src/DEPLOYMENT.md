# 🚀 Deployment Guide for GitHub Pages

This guide will help you deploy FORERUNNER to GitHub Pages.

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account

## Step 1: Local Setup & Testing

```bash
# Install dependencies
npm install

# Run development server to test locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Step 2: Update Discord OAuth Configuration

**IMPORTANT**: Before deploying, update the Discord OAuth redirect URL.

1. Go to [Discord Developer Portal](https://discord.com/developers/applications/1435409989740265512)
2. Navigate to **OAuth2** → **General**
3. Add your GitHub Pages URL to **Redirects**:
   - Format: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - Example: `https://johndoe.github.io/forerunner/`

4. Update `/config/discord.ts`:
```typescript
export const DISCORD_CONFIG = {
  clientId: '1435409989740265512',
  redirectUri: 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/', // UPDATE THIS
  scope: 'identify guilds',
  responseType: 'code',
};
```

## Step 3: Update Vite Base Path

If your repo is NOT at the root (e.g., `username.github.io/repo-name`), update `/vite.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  base: '/YOUR_REPO_NAME/', // e.g., '/forerunner/'
});
```

**If deploying to `username.github.io` (root)**, keep `base: '/'`

## Step 4: Create GitHub Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FORERUNNER"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

## Step 6: Deploy

The site will automatically deploy when you push to the `main` branch!

```bash
# Make changes
git add .
git commit -m "Update site"
git push

# GitHub Actions will automatically build and deploy
```

## Manual Deploy (Alternative)

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

## Verify Deployment

1. Check the **Actions** tab in your GitHub repo
2. Wait for the workflow to complete (green checkmark)
3. Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Troubleshooting

### 404 Errors

- Make sure `base` in `vite.config.ts` matches your repo structure
- Check that GitHub Pages is enabled in Settings

### Discord OAuth Fails

- Verify redirect URI matches EXACTLY in Discord Developer Portal
- Check `/config/discord.ts` has the correct URL

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets Not Loading

- Check `base` path in `vite.config.ts`
- Ensure all imports use relative paths

## Environment Variables (Optional)

For production environment variables:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets (e.g., API keys)
3. Update `.github/workflows/deploy.yml` to use them

## Custom Domain (Optional)

1. Add a `CNAME` file to `/public/` with your domain
2. Configure DNS settings with your domain provider
3. Enable **Enforce HTTPS** in GitHub Pages settings

## Performance Tips

- The build is optimized with code splitting
- Assets are cached by browsers
- Uses Vite's production optimizations
- All JavaScript is minified

## Support

If you encounter issues:
- Check GitHub Actions logs
- Review browser console for errors
- Ensure all dependencies installed correctly

---

**Launch Countdown Active**: Remember to update the countdown date in `/components/LaunchCountdown.tsx` if needed!

🚀 Happy deploying!
