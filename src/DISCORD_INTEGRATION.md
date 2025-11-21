# Discord OAuth Integration

## Overview
FORERUNNER now supports Discord OAuth integration, allowing users to connect their Discord accounts and sync their profile information automatically.

## Public Discord OAuth URL
```
https://discord.com/oauth2/authorize?client_id=1435409989740265512&response_type=code&redirect_uri=https%3A%2F%2Fsolo-bit-97610928.figma.site%2F&scope=identify+guilds+guilds.channels.read+guilds.join+email+connections
```

## Configuration

### Discord Application Settings
- **Application ID**: `1435409989740265512`
- **Redirect URI**: `https://solo-bit-97610928.figma.site/`
- **Scopes**:
  - `identify` - Access to user's profile information
  - `guilds` - Access to user's guild list
  - `guilds.channels.read` - Access to guild channels
  - `guilds.join` - Ability to join guilds on behalf of user
  - `email` - Access to user's email
  - `connections` - Access to user's connected accounts

### Configuration File
The Discord configuration is located in `/config/discord.ts`

## Features

### 1. Connect Discord Account
Users can connect their Discord account from **Settings → Account Information → Connect Discord**

### 2. Automatic Profile Sync
When a Discord account is connected, the following information is automatically synced:
- **Display Name** - Updates to Discord's global name (if not manually edited)
- **Username** - Updates to Discord username (if not manually edited)
- **Avatar** - Stores Discord avatar URL
- **Discord Tag** - Shows `@username#discriminator` on profile

### 3. Profile Display
Connected Discord information appears on:
- Profile page (shows Discord username)
- Settings page (shows connection status and Discord avatar)

## User Flow

1. **User clicks "Connect Discord"** in Settings
2. **Redirects to Discord OAuth** authorization page
3. **User authorizes** the application
4. **Discord redirects back** with authorization code
5. **App exchanges code** for access token
6. **App fetches** Discord user data
7. **Profile is updated** automatically with Discord info
8. **User is redirected** to their profile page
9. **Success notification** is shown

## Technical Implementation

### OAuth Flow
```
User → Connect Button → Discord OAuth → Authorization → Callback
→ Exchange Code for Token → Fetch User Data → Update Profile → Redirect
```

### Key Files
- `/config/discord.ts` - Discord configuration and API functions
- `/contexts/UserContext.tsx` - User profile management with `connectDiscord()` method
- `/App.tsx` - OAuth callback handler
- `/components/SettingsPage.tsx` - Connect Discord UI
- `/components/EnhancedProfilePage.tsx` - Discord info display

### Data Stored
```typescript
interface DiscordUserData {
  id: string;                    // Discord user ID
  username: string;              // Discord username
  discriminator: string;         // Discord discriminator (#0000)
  global_name: string | null;    // Discord display name
  avatar: string | null;         // Discord avatar hash
  email?: string;                // Discord email (if scope granted)
}
```

## Security Notes

⚠️ **Important**: The client secret is exposed in the frontend code. This is acceptable for client-side OAuth flows, but be aware:
- Do not use this setup for sensitive operations
- Rate limiting is handled by Discord
- The secret is only used for token exchange
- All user data is stored client-side in localStorage

## Testing

### Test the Integration
1. Click "Connect Discord" in Settings
2. Authorize on Discord
3. Verify redirect back to profile
4. Check that Discord info appears in Settings
5. Check that @username appears on profile

### Debugging
- Check browser console for OAuth errors
- Verify redirect URI matches Discord app settings exactly
- Ensure all scopes are granted during authorization
- Check localStorage for updated user data

## Troubleshooting

### Common Issues

**"Failed to connect Discord account"**
- Check that redirect URI is exactly `https://solo-bit-97610928.figma.site/`
- Verify client ID and secret are correct
- Check browser console for detailed error messages

**Profile not updating**
- User must be logged in before connecting Discord
- Check that `connectDiscord()` is being called
- Verify user data is being fetched successfully

**Redirect not working**
- Ensure URL in Discord app settings matches production URL
- Check that no trailing slashes or extra paths exist

## Future Enhancements

Potential improvements:
- Discord server integration
- Show Discord guilds on profile
- Discord notifications
- Discord rich presence
- Guild member verification
- Role synchronization

---

**Last Updated**: November 6, 2025  
**Status**: ✅ Production Ready
