# Discord OAuth - Quick Setup Guide

## ✅ Configuration Complete

Your Discord OAuth integration is **ready to use** with the following settings:

### Public Discord OAuth Link
```
https://discord.com/oauth2/authorize?client_id=1435409989740265512&response_type=code&redirect_uri=https%3A%2F%2Fsolo-bit-97610928.figma.site%2F&scope=identify+guilds+guilds.channels.read+guilds.join+email+connections
```

### Key Details
- **Client ID**: `1435409989740265512`
- **Redirect URI**: `https://solo-bit-97610928.figma.site/`
- **Scopes**: `identify`, `guilds`, `guilds.channels.read`, `guilds.join`, `email`, `connections`

---

## How to Use

### For Users
1. Go to **Settings** page
2. Scroll to **Account Information** section
3. Click the **"Connect Discord"** button
4. Authorize on Discord
5. Get redirected back to your profile
6. Your Discord info is now synced! ✨

### What Gets Synced
- ✅ Display Name (from Discord global name)
- ✅ Username (from Discord username)  
- ✅ Avatar (Discord profile picture)
- ✅ Discord Tag (@username#discriminator)

---

## Verify Discord App Settings

Make sure your Discord application at https://discord.com/developers/applications has:

### OAuth2 Settings
- ✅ **Redirect URIs**: `https://solo-bit-97610928.figma.site/`
- ✅ **Authorization Method**: Authorization Code Grant
- ✅ **Public Bot**: Can be disabled (not using bot features)

### OAuth2 Scopes
- ✅ `identify`
- ✅ `guilds`
- ✅ `guilds.channels.read`
- ✅ `guilds.join`
- ✅ `email`
- ✅ `connections`

---

## Testing Checklist

- [ ] Discord app has correct redirect URI
- [ ] User is logged into FORERUNNER
- [ ] Click "Connect Discord" in Settings
- [ ] Successfully authorize on Discord
- [ ] Redirect back to FORERUNNER profile
- [ ] Discord username visible on profile
- [ ] Discord info visible in Settings
- [ ] Display name updated (if not manually edited)

---

## Current Status

🟢 **LIVE & READY**

The Discord integration is configured for production use at `https://solo-bit-97610928.figma.site/`

---

**Need Help?** Check `/DISCORD_INTEGRATION.md` for detailed documentation.
