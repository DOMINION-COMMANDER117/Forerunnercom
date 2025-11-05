// Discord OAuth Configuration
// Get your Discord Application Client ID at: https://discord.com/developers/applications

export const DISCORD_CONFIG = {
  clientId: '1435409989740265512',
  redirectUri: 'https://www.figma.com/make/c7JDPjOuY0vXVt0nhOHjZx/Liquid-Animation-Effect?node-id=0-1&p=f&t=NZcSCoGiSYI4yUVU-0&fullscreen=1',
  scope: 'identify guilds',
  responseType: 'code',
};

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.clientId,
    redirect_uri: DISCORD_CONFIG.redirectUri,
    response_type: DISCORD_CONFIG.responseType,
    scope: DISCORD_CONFIG.scope,
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function getDiscordUser(accessToken: string) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}
