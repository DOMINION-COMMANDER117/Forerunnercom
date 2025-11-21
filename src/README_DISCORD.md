# 🚀 DISCORD LOGIN - QUICK START

## ⚡ 60-SECOND SETUP

### 1. Press `Ctrl+Shift+D` in your app
Opens the debug panel

### 2. Click "📋 Copy Redirect URI"
Copies the exact URL you need

### 3. Click "🔗 Open Discord Developer Portal"
Opens Discord settings

### 4. Add the redirect URI
- Scroll to "Redirects"
- Click "Add Redirect"  
- Paste
- Save

### 5. Test!
Click "Login with Discord" in your app ✅

---

## 🔍 DEBUG PANEL FEATURES

Press **`Ctrl+Shift+D`** anywhere in your app to see:
- ✅ Current redirect URI (auto-detected)
- ✅ Client ID & Secret
- ✅ Full OAuth URL
- ✅ Copy buttons for everything
- ✅ Direct link to Discord portal

---

## ⚠️ KEY INFO

**Your Redirect URI** (auto-detected):
```
https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/FORERUNNER.COM
```

**Client ID**: `1435409989740265512`  
**Client Secret**: `vV2guTGsv3uC9RJvdy9K1ChsnDRomRto`

**Discord Portal**: https://discord.com/developers/applications/1435409989740265512/oauth2/general

---

## ✅ WHAT'S FIXED

- ✅ Deleted all `.tsx` files from `/public/_redirects/`
- ✅ Added your client secret to config
- ✅ Implemented real OAuth token exchange
- ✅ Auto-detects redirect URI
- ✅ Added debug panel (`Ctrl+Shift+D`)

---

## 🐛 IF IT DOESN'T WORK

1. Press `Ctrl+Shift+D`
2. Copy the redirect URI shown
3. Make sure it's EXACTLY in Discord portal
4. No trailing slash, no query params!

---

**See `SETUP_DISCORD.md` for full details!**
