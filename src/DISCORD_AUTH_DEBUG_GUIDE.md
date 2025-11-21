# Discord Authentication Debug Guide

## Overview
This guide explains the console logging system for debugging Discord OAuth authentication in FORERUNNER.

---

## Console Log Legend

### 🟦 Blue Circles (🔵) - OAuth Flow Steps
These show the Discord OAuth authentication process:

```
🔵 Discord OAuth code detected: abcd1234...
🔵 Step 1: Exchanging code for access token...
✅ Access token received: xyz789...
🔵 Step 2: Fetching Discord user data...
✅ Discord user data received: { id, username, global_name, avatar, email }
🔵 Step 3: Creating/logging in user with Discord...
✅ User logged in with Discord! Redirecting to profile...
🔵 Cleaning URL...
✅ Discord OAuth flow complete!
```

### 🟢 Green Circles (🟢) - User Login Process
These show what happens inside the `loginWithDiscord` function:

```
🟢 loginWithDiscord called with: { id, username, ... }
🟢 Current users in database: 5
🟢 No existing user found. Creating NEW account...
🟢 New user created: { id, username, displayName, profilePicture, discordId }
✅ NEW USER ACCOUNT CREATED AND LOGGED IN!
✅ Total users now: 6
✅ Current user set to: username123
```

**OR** if user already exists:

```
🟢 loginWithDiscord called with: { id, username, ... }
🟢 Current users in database: 5
🟢 Existing user found! Logging in user: username123
✅ User updated and logged in: username123
```

### 💾 Floppy Disk (💾) - localStorage Operations
These show when data is saved to browser storage:

```
💾 Saving current user to localStorage: username123
✅ Current user saved to localStorage!
```

### 📂 Folder (📂) - Loading from localStorage
These show when the app loads saved data on startup:

```
📂 Loading data from localStorage...
📂 Loaded users: 5
📂 Loaded posts: 12
📂 Loaded current user: username123
✅ USER IS LOGGED IN ON LOAD!
```

**OR** if no user logged in:

```
📂 Loading data from localStorage...
📂 No current user in localStorage - user is logged out
```

### 🎮 Game Controller (🎮) - Current User Status
These show the current user state in the App component:

```
🎮 CURRENT USER IN APP: { username, displayName, discordId, profilePicture }
```

**OR** if logged out:

```
🎮 NO USER LOGGED IN
```

### ❌ Red X (❌) - Errors
These indicate something went wrong:

```
❌ Discord OAuth error: Error message here
```

---

## Expected Flow for New User

When a new user signs in with Discord, you should see this sequence:

```
1. 🔵 Discord OAuth code detected: ...
2. 🔵 Step 1: Exchanging code for access token...
3. ✅ Access token received: ...
4. 🔵 Step 2: Fetching Discord user data...
5. ✅ Discord user data received: { ... }
6. 🔵 Step 3: Creating/logging in user with Discord...
7. 🟢 loginWithDiscord called with: { ... }
8. 🟢 Current users in database: X
9. 🟢 No existing user found. Creating NEW account...
10. 🟢 New user created: { ... }
11. ✅ NEW USER ACCOUNT CREATED AND LOGGED IN!
12. ✅ Total users now: X+1
13. ✅ Current user set to: username
14. 💾 Saving current user to localStorage: username
15. ✅ Current user saved to localStorage!
16. 🎮 CURRENT USER IN APP: { ... }
17. ✅ User logged in with Discord! Redirecting to profile...
18. 🔵 Cleaning URL...
19. ✅ Discord OAuth flow complete!
```

---

## Expected Flow for Returning User

When an existing user signs in with Discord:

```
1. 🔵 Discord OAuth code detected: ...
2. 🔵 Step 1: Exchanging code for access token...
3. ✅ Access token received: ...
4. 🔵 Step 2: Fetching Discord user data...
5. ✅ Discord user data received: { ... }
6. 🔵 Step 3: Creating/logging in user with Discord...
7. 🟢 loginWithDiscord called with: { ... }
8. 🟢 Current users in database: X
9. 🟢 Existing user found! Logging in user: username
10. ✅ User updated and logged in: username
11. 💾 Saving current user to localStorage: username
12. ✅ Current user saved to localStorage!
13. 🎮 CURRENT USER IN APP: { ... }
14. ✅ User logged in with Discord! Redirecting to profile...
15. 🔵 Cleaning URL...
16. ✅ Discord OAuth flow complete!
```

---

## Expected Flow on Page Refresh (Logged In User)

When you refresh the page while logged in:

```
1. 📂 Loading data from localStorage...
2. 📂 Loaded users: X
3. 📂 Loaded posts: Y
4. 📂 Loaded current user: username
5. ✅ USER IS LOGGED IN ON LOAD!
6. 🎮 CURRENT USER IN APP: { ... }
```

---

## Troubleshooting

### Problem: User Not Staying Logged In

**Symptom:** User logs in successfully but is logged out after refresh

**Check these logs:**
1. ✅ Look for "💾 Saving current user to localStorage"
2. ✅ Look for "✅ Current user saved to localStorage!"
3. ✅ On refresh, look for "📂 Loaded current user: username"

**If missing:**
- Check browser localStorage in DevTools
- Look for `forerunner_current_user` key
- Verify it contains user data

### Problem: OAuth Flow Not Starting

**Symptom:** Clicking "Sign in with Discord" does nothing

**Check these logs:**
1. Look for "🔵 Discord OAuth code detected"
2. If missing, check if URL has `?code=...` parameter
3. Verify Discord redirect URI matches exactly

### Problem: User Created But Not Logged In

**Symptom:** New account created but user is logged out

**Check these logs:**
1. ✅ Look for "🟢 New user created"
2. ✅ Look for "✅ NEW USER ACCOUNT CREATED AND LOGGED IN!"
3. ✅ Look for "💾 Saving current user to localStorage"
4. ✅ Look for "🎮 CURRENT USER IN APP"

**If user created but App shows "NO USER LOGGED IN":**
- There may be a timing issue
- Check if `setCurrentUser` is being called
- Verify UserContext is properly providing currentUser

### Problem: Redirect Loop

**Symptom:** Page keeps redirecting

**Check these logs:**
1. Look for repeated "🔵 Discord OAuth code detected"
2. Check if URL is being cleaned: "🔵 Cleaning URL..."
3. Verify `window.history.replaceState` is removing the code

### Problem: Discord Data Not Showing

**Symptom:** User logged in but profile shows default data

**Check these logs:**
1. Look at "✅ Discord user data received" - verify it has avatar, global_name
2. Look at "🟢 New user created" - verify profilePicture is set
3. Check "🎮 CURRENT USER IN APP" - verify profilePicture URL

---

## Manual Testing Checklist

### Test 1: New User Login
- [ ] Open incognito/private window
- [ ] Go to FORERUNNER
- [ ] Click "Sign in with Discord"
- [ ] Authorize on Discord
- [ ] Check console logs (see "Expected Flow for New User")
- [ ] Verify redirected to profile page
- [ ] Verify Discord avatar shows
- [ ] Verify Discord name shows
- [ ] Refresh page
- [ ] Verify still logged in
- [ ] Check localStorage for `forerunner_current_user`

### Test 2: Returning User Login
- [ ] Log out if logged in
- [ ] Click "Sign in with Discord"
- [ ] Authorize on Discord
- [ ] Check console logs (see "Expected Flow for Returning User")
- [ ] Verify redirected to profile page
- [ ] Verify correct user data shows
- [ ] Refresh page
- [ ] Verify still logged in

### Test 3: Persistence
- [ ] Log in with Discord
- [ ] Close tab completely
- [ ] Open new tab
- [ ] Go to FORERUNNER
- [ ] Check console logs (see "Expected Flow on Page Refresh")
- [ ] Verify still logged in
- [ ] Verify all data intact

### Test 4: Multiple Sessions
- [ ] Log in with Discord
- [ ] Open second tab
- [ ] Verify logged in on both tabs
- [ ] Log out on one tab
- [ ] Check other tab
- [ ] Verify logged out on both

---

## localStorage Keys

FORERUNNER uses these localStorage keys:

```javascript
// User accounts database
'forerunner_users' // Array of all user accounts

// Posts database
'forerunner_posts' // Array of all posts

// Passwords (hashed)
'forerunner_passwords' // Object mapping user IDs to passwords

// Current logged-in user
'forerunner_current_user' // Current user object (null if logged out)

// Friend requests
'forerunner_friend_requests' // Array of friend requests
```

To inspect in browser DevTools:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Click on your site URL
5. Look for keys starting with `forerunner_`

---

## Common Console Output Examples

### Successful Login (New User)
```
🔵 Discord OAuth code detected: K7x2...
🔵 Step 1: Exchanging code for access token...
✅ Access token received: abc123...
🔵 Step 2: Fetching Discord user data...
✅ Discord user data received: {
  id: "123456789",
  username: "gamer123",
  global_name: "Cool Gamer",
  avatar: "a_xyz789",
  email: "user@email.com"
}
🔵 Step 3: Creating/logging in user with Discord...
🟢 loginWithDiscord called with: [Discord user data]
🟢 Current users in database: 0
🟢 No existing user found. Creating NEW account...
🟢 New user created: {
  id: "user_discord_1730918400000_abc123",
  username: "gamer123",
  displayName: "Cool Gamer",
  profilePicture: "https://cdn.discordapp.com/avatars/123456789/a_xyz789.png?size=256",
  discordId: "123456789"
}
✅ NEW USER ACCOUNT CREATED AND LOGGED IN!
✅ Total users now: 1
✅ Current user set to: gamer123
💾 Saving current user to localStorage: gamer123
✅ Current user saved to localStorage!
🎮 CURRENT USER IN APP: {
  username: "gamer123",
  displayName: "Cool Gamer",
  discordId: "123456789",
  profilePicture: "https://cdn.discordapp.com/avatars/123456789/a_xyz789.png?size=256"
}
✅ User logged in with Discord! Redirecting to profile...
🔵 Cleaning URL...
✅ Discord OAuth flow complete!
```

### Successful Login (Returning User)
```
🔵 Discord OAuth code detected: K7x2...
🔵 Step 1: Exchanging code for access token...
✅ Access token received: abc123...
🔵 Step 2: Fetching Discord user data...
✅ Discord user data received: { ... }
🔵 Step 3: Creating/logging in user with Discord...
🟢 loginWithDiscord called with: [Discord user data]
🟢 Current users in database: 1
🟢 Existing user found! Logging in user: gamer123
✅ User updated and logged in: gamer123
💾 Saving current user to localStorage: gamer123
✅ Current user saved to localStorage!
🎮 CURRENT USER IN APP: { ... }
✅ User logged in with Discord! Redirecting to profile...
🔵 Cleaning URL...
✅ Discord OAuth flow complete!
```

### Failed Login
```
🔵 Discord OAuth code detected: invalid_code
🔵 Step 1: Exchanging code for access token...
❌ Discord OAuth error: Error: Failed to exchange code for token
```

---

## Developer Notes

### Adding New Logs

To add new debug logs, use these emojis:

- 🔵 Blue Circle - OAuth flow steps
- 🟢 Green Circle - User operations
- 💾 Floppy Disk - Storage operations
- 📂 Folder - Load operations
- 🎮 Game Controller - App state
- ✅ Check Mark - Success
- ❌ Red X - Error
- 🟡 Yellow Circle - Warning

### Removing Logs for Production

To remove all debug logs for production, search for `console.log` and remove lines containing emojis.

Or use this regex to find all debug logs:
```regex
console\.log\(['"][\u{1F000}-\u{1FFFF}].*\);
```

---

## Contact Support

If you're still having issues after checking the logs:

1. **Copy all console output** (right-click console → Save as...)
2. **Take screenshot** of localStorage (Application tab)
3. **Note exact steps** to reproduce
4. **Include browser** and version
5. **Share logs** with support team

---

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Author:** FORERUNNER Development Team
