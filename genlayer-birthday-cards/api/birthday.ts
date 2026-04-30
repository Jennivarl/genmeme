import type { VercelRequest, VercelResponse } from '@vercel/node';

function escapeXml(str: string) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

function generateCardSVG(opts: { name?: string; message?: string; theme?: string; from?: string; profilePic?: string }) {
    const name = opts.name || 'Friend';
    const message = opts.message || 'Happy Birthday!';
    const theme = opts.theme || 'default';
    const from = opts.from || 'Your friends';
    const profilePic = opts.profilePic || null;

    const palettes: Record<string, { bg: string; accent: string; text: string }> = {
        default: { bg: '#0f172a', accent: '#7c3aed', text: '#e6e6f0' },
        pastel: { bg: '#fff1f2', accent: '#fbcfe8', text: '#6b7280' },
        sunny: { bg: '#fffbeb', accent: '#f59e0b', text: '#92400e' },
    };

    const palette = palettes[theme] ?? palettes.default;
    const escName = escapeXml(name);
    const escMessage = escapeXml(message);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Birthday card for ${escName}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette.bg}" stop-opacity="1" />
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.08" />
    </linearGradient>
    <clipPath id="avatarClip">
      <circle cx="120" cy="210" r="60" />
    </clipPath>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />

  <g transform="translate(60,60)">
    <rect x="0" y="0" rx="24" ry="24" width="1080" height="510" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" />

    ${profilePic ? `<image href="${profilePic}" x="60" y="150" width="120" height="120" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />` : ''}

    <text x="80" y="180" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64" font-weight="700" fill="${palette.accent}">${escName}</text>

    <text x="80" y="260" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="40" font-weight="600" fill="${palette.text}">${escMessage}</text>

    <g transform="translate(800,100)">
      <circle cx="80" cy="80" r="80" fill="${palette.accent}" opacity="0.18" />
      <circle cx="140" cy="40" r="36" fill="${palette.accent}" opacity="0.22" />
      <rect x="40" y="200" width="160" height="8" rx="4" fill="${palette.accent}" opacity="0.14" />
    </g>
  </g>

  <g transform="translate(60,560)">
    <text x="0" y="-6" font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="18" fill="${palette.text}">from ${escapeXml(from)}</text>
  </g>
</svg>`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        let name, message, theme, from, profilePic;

        if (req.method === 'POST') {
            ({ name, message, theme, from, profilePic } = req.body || {});
        } else {
            ({ name, message, theme, from, profilePic } = req.query);
        }

        const svg = generateCardSVG({ name, message, theme, from, profilePic });
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        return res.status(200).send(svg);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate card' });
    }
}
