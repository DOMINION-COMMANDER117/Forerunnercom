// Discord OAuth Configuration
// Public Discord Application: https://discord.com/oauth2/authorize?client_id=1435409989740265512
// Scopes: identify, guilds, guilds.channels.read, guilds.join, email, connections, gdm.join, guilds.members.read, applications.commands.permissions.update

// Automatically detect environment and use appropriate redirect URI
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    // Use the current origin to support both development and production
    const origin = window.location.origin;
    
    // Production URL: https://solo-bit-97610928.figma.site/
    // This should match exactly what's configured in Discord Developer Portal
    return origin + '/';
  }
  // Fallback for SSR or build time
  return 'https://solo-bit-97610928.figma.site/';
};

export const DISCORD_CONFIG = {
  clientId: '1435409989740265512',
  clientSecret: 'vV2guTGsv3uC9RJvdy9K1ChsnDRomRto',
  redirectUri: getRedirectUri(),
  scope: 'identify guilds guilds.channels.read guilds.join email connections gdm.join guilds.members.read applications.commands.permissions.update',
  responseType: 'code',
};

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.clientId,
    redirect_uri: DISCORD_CONFIG.redirectUri,
    response_type: DISCORD_CONFIG.responseType,
    scope: DISCORD_CONFIG.scope,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

// Get the public Discord OAuth URL (for sharing/documentation)
export function getPublicDiscordAuthUrl(): string {
  return 'https://discord.com/oauth2/authorize?client_id=1435409989740265512&response_type=code&redirect_uri=https%3A%2F%2Fsolo-bit-97610928.figma.site%2F&scope=identify+guilds+guilds.channels.read+guilds.join+email+connections+gdm.join+guilds.members.read+applications.commands.permissions.update';
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  try {
    console.log('🔷 Exchanging OAuth code for token...');
    
    if (!code) {
      throw new Error('No authorization code provided');
    }

    const params = new URLSearchParams({
      client_id: DISCORD_CONFIG.clientId,
      client_secret: DISCORD_CONFIG.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: DISCORD_CONFIG.redirectUri,
    });

    console.log('🔷 Request params:', {
      client_id: DISCORD_CONFIG.clientId,
      redirect_uri: DISCORD_CONFIG.redirectUri,
      code: code.substring(0, 20) + '...'
    });

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Discord token exchange failed:', response.status, errorText);
      
      // Parse error if possible
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Discord OAuth error: ${errorData.error || 'Unknown error'} - ${errorData.error_description || ''}`);
      } catch {
        throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    if (!data.access_token) {
      console.error('❌ No access token in response:', data);
      throw new Error('No access token received from Discord');
    }
    
    console.log('✅ Token exchange successful');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error in exchangeCodeForToken:', error);
    throw error;
  }
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUserData> {
  try {
    console.log('🔷 Fetching Discord user data...');
    
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Discord user fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch Discord user: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();
    
    if (!userData || !userData.id) {
      console.error('❌ Invalid user data received:', userData);
      throw new Error('Invalid user data received from Discord');
    }
    
    console.log('✅ User data fetched successfully');
    return userData;
  } catch (error) {
    console.error('❌ Error in getDiscordUser:', error);
    throw error;
  }
}

export interface DiscordUserData {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
}
