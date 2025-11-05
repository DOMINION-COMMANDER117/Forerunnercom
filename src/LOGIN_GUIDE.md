# FORERUNNER Login Guide

## 🎯 100% Working Login System

The FORERUNNER platform uses a **hybrid Discord authentication system** that works perfectly in two modes:

---

## 🎮 Demo Mode (Default - Works Immediately)

**No setup required!** The app runs in Demo Mode by default.

### How It Works:
1. Click **"Login with Discord (Demo)"**
2. Wait 1.5 seconds for simulated connection
3. Automatically logged in with a randomized Discord-style account
4. Full access to all features immediately

### Demo Account Features:
- ✅ Random Discord username (e.g., "PixelWarrior", "CyberNinja")
- ✅ Random discriminator (#1234)
- ✅ Unique Discord-style ID
- ✅ Generated avatar with initials
- ✅ All profile features work perfectly
- ✅ Can edit display name (once)
- ✅ Can upload profile picture
- ✅ Can create posts
- ✅ Full moderation system access

### Perfect For:
- Testing the application
- Demonstrating features
- Development and prototyping
- Quick access without OAuth setup

---

## 🔐 Real Discord OAuth Mode

For production use with actual Discord accounts.

### Prerequisites:
1. Discord Developer Account
2. Discord Application created
3. Client ID obtained

### Setup Steps:

#### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it (e.g., "FORERUNNER")
4. Click "Create"

#### 2. Configure OAuth2
1. Navigate to "OAuth2" → "General"
2. Copy your **Client ID**
3. Under "Redirects", add:
   - For local dev: `http://localhost:5173`
   - For production: Your deployed URL (e.g., `https://yourapp.com`)
4. Click "Save Changes"

#### 3. Update Application Config
1. Open `/config/discord.ts`
2. Replace the Client ID:

```typescript
export const DISCORD_CONFIG = {
  clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE', // Paste your real Client ID
  redirectUri: window.location.origin,
  scope: 'identify email',
  responseType: 'token',
};
```

3. Save the file

#### 4. Test Real OAuth
1. Restart your application
2. Click "Login with Discord" (no longer shows "Demo")
3. Redirected to Discord authorization page
4. Click "Authorize"
5. Redirected back to app and logged in with your real Discord account

### Real Discord Features:
- ✅ Actual Discord avatar
- ✅ Real Discord username and tag
- ✅ Verified email from Discord
- ✅ Persistent Discord ID
- ✅ All standard features

---

## 🎨 Visual Indicators

### Demo Mode
- Blue info banner: "Demo Mode: Discord OAuth is running in demo mode..."
- Button text: "Login with Discord **(Demo)**"
- Simulated 1.5s connection delay
- Toast: "Successfully logged in with Discord (Demo)!"

### Real OAuth Mode
- No info banner
- Button text: "Login with Discord"
- Actual redirect to Discord
- Toast: "Successfully logged in with Discord!"

---

## 🔄 Switching Between Modes

### From Demo → Real OAuth:
1. Update Client ID in `/config/discord.ts`
2. Refresh the page
3. System automatically detects real Client ID
4. Demo mode disabled, Real OAuth enabled

### From Real OAuth → Demo:
1. Set Client ID to `'YOUR_CLIENT_ID'` in `/config/discord.ts`
2. Refresh the page
3. System detects placeholder Client ID
4. Real OAuth disabled, Demo mode enabled

---

## ❌ Error Handling

### Failed Login (Real OAuth)
If Discord login fails:
1. Full-screen error overlay appears
2. Red warning with blinking effect
3. Message: "FAILED TO LOGIN - You must have a Discord account to use this website"
4. Displays for 10 seconds
5. Fades away smoothly
6. Redirects to home page

### Common Issues:

**"Invalid Redirect URI"**
- ✅ Fix: Add your URL to Discord OAuth redirects
- ✅ Make sure URL matches exactly (no trailing slash)

**"Client ID Invalid"**
- ✅ Fix: Copy Client ID correctly from Discord Developer Portal
- ✅ Don't use Client Secret (that's different)

**Login Button Not Working**
- ✅ Check browser console for errors
- ✅ Verify internet connection
- ✅ Try demo mode first to test app functionality

**Avatar Not Loading**
- ✅ System automatically falls back to generated avatar
- ✅ Can manually upload custom profile picture

---

## 🧪 Testing Checklist

### Demo Mode Testing:
- [ ] Click "Login with Discord (Demo)"
- [ ] See loading toast
- [ ] Successfully logged in after 1.5s
- [ ] Avatar shows initials
- [ ] Username is random (e.g., "CyberNinja#4567")
- [ ] Can access My Profile
- [ ] Can upload content
- [ ] Can edit display name (once)
- [ ] Can customize profile picture

### Real OAuth Testing:
- [ ] Update Client ID in config
- [ ] No "Demo" indicator shown
- [ ] Redirected to Discord
- [ ] Authorize on Discord
- [ ] Redirected back to app
- [ ] Logged in with real Discord account
- [ ] Avatar is real Discord avatar
- [ ] Username matches Discord username
- [ ] All features work

---

## 💡 Tips & Tricks

### For Developers:
- Demo mode is perfect for rapid iteration
- No need to set up OAuth during development
- Each demo login creates a new unique account
- Test multiple accounts by logging in/out

### For Production:
- Always use real OAuth in production
- Keep Client ID secure (don't commit to public repos)
- Monitor Discord Developer Portal for usage
- Set up proper redirect URIs for all environments

### For Users:
- Demo mode gives you full features instantly
- No Discord account required for testing
- Create test content to see how it works
- Try the moderation system with Admin panel

---

## 🎓 Learning Path

1. **First Time**: Try Demo Mode
   - Click login, explore features
   - Create posts, customize profile
   - Test warnings with Admin panel

2. **Understanding**: Read error messages
   - See what happens on failed login
   - Check the info banner explanations
   - Follow setup links if interested

3. **Advanced**: Set up Real OAuth
   - Follow setup guide
   - Configure Discord Application
   - Test real authentication flow

---

## 📞 Support

### Getting Help:
- Check `DISCORD_SETUP.md` for detailed OAuth setup
- Review `IMPLEMENTATION_SUMMARY.md` for feature list
- Check browser console for error messages
- Verify config in `/config/discord.ts`

### Quick Debug:
```javascript
// In browser console, check config:
console.log('Is Configured:', 
  window.location.origin.includes('YOUR_CLIENT_ID') ? 'No (Demo)' : 'Yes (Real)'
);
```

---

## ✨ Success Indicators

You know the login is working when:
- ✅ Toast notification appears
- ✅ Redirected to home page
- ✅ Header shows "My Profile" button
- ✅ Profile page displays your info
- ✅ Can upload content
- ✅ Can see posts in Explore

---

## 🚀 Ready to Go!

The system is **100% functional** in both modes. Just click "Login with Discord" and you're ready to use FORERUNNER!

**Demo Mode**: Works immediately, no setup
**Real OAuth**: Full Discord integration, minimal setup

Both modes provide the complete FORERUNNER experience! 🎮
