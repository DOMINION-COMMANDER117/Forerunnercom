# 🎮 DISCORD LOGIN SETUP - SUPER SIMPLE! 

## ✅ EVERYTHING IS READY!

Discord OAuth is fully configured with:
- ✅ Real token exchange with your client secret
- ✅ Auto-detection of redirect URI
- ✅ **Debug panel** to see exactly what's happening (`Ctrl+Shift+D`)
- ✅ All `.tsx` files removed from `/public/_redirects/`

---

## 🚀 3 STEPS TO MAKE IT WORK (60 SECONDS)

### Step 1️⃣: Open Debug Panel
In your app, press **`Ctrl+Shift+D`**

This shows you exactly what redirect URI you need!

### Step 2️⃣: Copy the Redirect URI
In the yellow box, click **"📋 Copy Redirect URI"**

It will look like:
```
https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/FORERUNNER.COM
```

### Step 3️⃣: Add to Discord Portal
1. In the debug panel, click **"🔗 Open Discord Developer Portal"**
2. Scroll to **"Redirects"**
3. Click **"Add Redirect"**
4. Paste the URI you copied
5. Click **"Save Changes"**

---

## ✅ TEST IT!

1. Click **"Login with Discord"** in your app
2. Click **"Authorize"** on Discord
3. You're redirected back and logged in!

---

## 🔍 DEBUG PANEL (`Ctrl+Shift+D`)

The debug panel shows you:
- Current page URL
- **Redirect URI** (what you need to add to Discord)
- Client ID & Secret
- Full auth URL
- Copy buttons for everything
- Link to Discord portal

**Use this to see exactly what's happening!**

---

## ⚠️ IMPORTANT

### Redirect URI Must Match Exactly!

The redirect URI in Discord portal must match what the app uses.

**In Figma Make:**
```
https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/FORERUNNER.COM
```

**On Netlify (after deploy):**
```
https://your-site.netlify.app
```

Add both if you want Discord login to work in both places!

### No Query Parameters!

✅ Correct:
```
https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/FORERUNNER.COM
```

❌ Wrong:
```
https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/FORERUNNER.COM?node-id=0-1&...
```

The app auto-removes query params!

---

## 🐛 TROUBLESHOOTING

### "Invalid redirect_uri" Error
- Press `Ctrl+Shift+D`
- Check the redirect URI shown
- Make sure it's EXACTLY in Discord portal (no extra characters!)

### "401 Unauthorized" Error
- Check client secret in `/config/discord.ts`
- Should be: `vV2guTGsv3uC9RJvdy9K1ChsnDRomRto`

### Nothing Happens
- Open browser console (F12)
- Look for errors
- Press `Ctrl+Shift+D` and copy the full auth URL
- Try pasting it directly in browser

---

## 🎯 THAT'S IT!

1. **Press `Ctrl+Shift+D`**
2. **Copy redirect URI**
3. **Add to Discord portal**
4. **Test login**
5. **Done!** ✅

---

## 📝 CURRENT CONFIG

- **Client ID**: `1435409989740265512`
- **Client Secret**: `vV2guTGsv3uC9RJvdy9K1ChsnDRomRto`
- **Scopes**: `identify guilds`
- **Redirect URI**: Auto-detected (press `Ctrl+Shift+D` to see!)

---

## 🔗 QUICK LINKS

- **Discord Portal**: https://discord.com/developers/applications/1435409989740265512/oauth2/general
- **Debug Panel**: Press `Ctrl+Shift+D` in your app

---

**Need help? Press `Ctrl+Shift+D` and everything is right there!** 🔥
