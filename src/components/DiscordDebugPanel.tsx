import { useState, useEffect } from 'react';
import { DISCORD_CONFIG, getDiscordAuthUrl } from '../config/discord';

export function DiscordDebugPanel() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setRedirectUri(DISCORD_CONFIG.redirectUri);
      setAuthUrl(getDiscordAuthUrl());
    }
  }, []);

  // Toggle with Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-96 p-4 rounded-lg border-2 border-red-500 bg-black/95 backdrop-blur-xl text-white text-xs font-mono shadow-2xl">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-red-500/30">
        <h3 className="text-red-500 font-bold">🔍 DISCORD DEBUG PANEL</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-500 hover:text-red-400 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-red-500 font-bold mb-1">Current Page URL:</p>
          <p className="bg-gray-900 p-2 rounded break-all">{currentUrl}</p>
        </div>

        <div>
          <p className="text-red-500 font-bold mb-1">Redirect URI (Auto-Detected):</p>
          <p className="bg-gray-900 p-2 rounded break-all text-green-400">{redirectUri}</p>
        </div>

        <div>
          <p className="text-red-500 font-bold mb-1">Client ID:</p>
          <p className="bg-gray-900 p-2 rounded break-all">{DISCORD_CONFIG.clientId}</p>
        </div>

        <div>
          <p className="text-red-500 font-bold mb-1">Client Secret:</p>
          <p className="bg-gray-900 p-2 rounded break-all">
            {DISCORD_CONFIG.clientSecret.slice(0, 10)}...{DISCORD_CONFIG.clientSecret.slice(-5)}
          </p>
        </div>

        <div>
          <p className="text-red-500 font-bold mb-1">Full Auth URL:</p>
          <p className="bg-gray-900 p-2 rounded break-all text-xs">{authUrl}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(authUrl);
              alert('Copied to clipboard!');
            }}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            📋 Copy Auth URL
          </button>
        </div>

        <div className="pt-2 border-t border-red-500/30">
          <p className="text-yellow-400 font-bold mb-1">⚠️ ADD THIS TO DISCORD PORTAL:</p>
          <p className="bg-yellow-900/20 border border-yellow-500 p-2 rounded break-all text-yellow-200">
            {redirectUri}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(redirectUri);
              alert('Redirect URI copied to clipboard!');
            }}
            className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-white w-full"
          >
            📋 Copy Redirect URI
          </button>
        </div>

        <div className="pt-2 border-t border-red-500/30">
          <a
            href="https://discord.com/developers/applications/1435409989740265512/oauth2/general"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-center"
          >
            🔗 Open Discord Developer Portal
          </a>
        </div>
      </div>

      <p className="text-gray-500 text-[10px] mt-3 pt-2 border-t border-gray-700">
        Press Ctrl+Shift+D to toggle this panel
      </p>
    </div>
  );
}
