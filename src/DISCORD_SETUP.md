# Discord OAuth Setup Guide

This application uses real Discord OAuth authentication. Follow these steps to configure it:

## 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name (e.g., "FORERUNNER")
4. Click "Create"

## 2. Configure OAuth2

1. In your application, navigate to the "OAuth2" section in the left sidebar
2. Click on "OAuth2" → "General"
3. Under "Redirects", add your application URL:
   - For local development: `http://localhost:5173` (or your dev server URL)
   - For production: Your deployed application URL
4. Click "Save Changes"

## 3. Get Your Client ID

1. In the "OAuth2" → "General" section, you'll see your "Client ID"
2. Copy this Client ID

## 4. Update the Application

1. Open `/config/discord.ts` in your code
2. Replace `'YOUR_CLIENT_ID'` with your actual Discord Client ID:

```typescript
export const DISCORD_CONFIG = {
  clientId: 'YOUR_ACTUAL_CLIENT_ID_HERE', // Paste your Client ID here
  redirectUri: window.location.origin,
  scope: 'identify email',
  responseType: 'token',
};
```

## 5. Test the OAuth Flow

1. Start your application
2. Click "Login with Discord"
3. You'll be redirected to Discord's authorization page
4. After authorizing, you'll be redirected back to your app and logged in

## Security Notes

- **Never commit your Client ID to public repositories** if you want to keep it private
- The implicit grant flow (token in URL fragment) is used for client-side apps
- For production apps with a backend, consider using the authorization code flow instead
- This implementation stores user data locally in the browser (localStorage)

## Troubleshooting

### "Invalid Redirect URI" Error
- Make sure the redirect URI in Discord matches your application's URL exactly
- Include the protocol (http:// or https://)
- Don't include trailing slashes

### OAuth Callback Not Working
- Check browser console for errors
- Verify the Client ID is correct
- Make sure the redirect URI is whitelisted in Discord

### User Data Not Loading
- Check if the access token is being received in the URL hash
- Verify Discord API is accessible (check network tab)
- Make sure CORS is not blocking the Discord API request

## Features

Once logged in with Discord, users get:
- ✅ Discord avatar automatically imported
- ✅ Discord username as default username
- ✅ Ability to customize display name (once only)
- ✅ Profile picture customization (every 30 days)
- ✅ Full access to post uploads and viewing
- ✅ Moderation system with warnings/reports tracking
- ✅ 24-hour security lock for new accounts

## API Endpoints Used

- `https://discord.com/api/oauth2/authorize` - Authorization
- `https://discord.com/api/users/@me` - Get current user info

For more information, see the [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2).
