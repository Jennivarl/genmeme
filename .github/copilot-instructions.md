# GenLayer Community Stats Dashboard - Project Instructions

## Project Overview

Full-stack Next.js dashboard for tracking GenLayer community member statistics using Discord API. Features include member leaderboards ranked by tenure, community statistics, and Discord integration.

## Technology Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS, React
- **Backend**: Next.js API Routes
- **Data Source**: Discord API
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js 16+)

## Project Setup Status

### ✅ Completed Steps

1. **Project Structure Created**
   - Next.js App Router with TypeScript
   - Tailwind CSS configured
   - ESLint configured for code quality
   
2. **API Routes Built**
   - `GET /api/members` - Fetches Discord members with tenure data
   - `GET /api/leaderboard` - Returns paginated leaderboard ranked by tenure
   
3. **Components Developed**
   - `Leaderboard.tsx` - Displays top members by tenure
   - `StatsOverview.tsx` - Shows community statistics
   
4. **Pages Implemented**
   - Main dashboard at `/` with header, stats, and leaderboard
   
5. **Configuration**
   - Environment variables template in `.env.local`
   - TypeScript interfaces for Discord data
   
6. **Documentation**
   - `README.md` - Quick start guide
   - `SETUP.md` - Detailed Discord bot setup instructions
   
7. **Dependencies Installed**
   - discord.js (v14+)
   - axios
   - zod
   - All Next.js and dev dependencies

8. **Build Verified**
   - Project compiles without errors
   - TypeScript type checking passed
   
9. **Development Server**
   - Running on localhost:3000
   - Hot reload enabled

## Environment Variables Required

```bash
NEXT_PUBLIC_DISCORD_CLIENT_ID=          # From Discord Developer Portal
DISCORD_CLIENT_SECRET=                  # From OAuth2 settings
DISCORD_BOT_TOKEN=                      # From Bot section
NEXT_PUBLIC_DISCORD_GUILD_ID=           # Your GenLayer server ID
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
DATABASE_URL=                           # Optional: for data persistence
```

## Quick Start

### 1. Configure Discord

Follow [SETUP.md](./SETUP.md) to:
- Create Discord application
- Generate bot token
- Get guild ID and credentials
- Invite bot to server

### 2. Set Environment Variables

Create `.env.local` with values from Discord Developer Portal:
```bash
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_value
DISCORD_CLIENT_SECRET=your_value
DISCORD_BOT_TOKEN=your_value
NEXT_PUBLIC_DISCORD_GUILD_ID=your_value
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Available Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Run production build
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── members/route.ts       # Discord member fetching
│   │   └── leaderboard/route.ts   # Ranked leaderboard
│   ├── components/
│   │   ├── Leaderboard.tsx        # UI component
│   │   └── StatsOverview.tsx      # Statistics display
│   ├── layout.tsx
│   └── page.tsx                   # Main dashboard
├── types/
│   └── discord.ts                 # TypeScript interfaces
└── globals.css
```

## Key Features Implemented

✅ Real-time Discord member fetching
✅ Tenure-based ranking system  
✅ Community statistics display
✅ Responsive design (Tailwind CSS)
✅ TypeScript type safety
✅ API route structure ready for expansion
✅ Environment-based configuration

## Known Limitations & Future Improvements

- Current in-memory data (ideal for small servers < 1000 members)
- Suggested: Add database caching for production
- No authentication yet (public stats view)
- Suggested: Add Discord OAuth for personal views
- Basic scoring (tenure-based only)
- Suggested: Add role-weighted scoring

## Deployment Ready

### For Vercel:
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

### For Self-Hosted:
1. Run `npm run build`
2. Set environment variables
3. Run `npm start`
4. Use PM2 or systemd for persistence

## Troubleshooting

**Members endpoint returns empty?**
- Verify Discord bot token in .env.local
- Check bot has "Read Members" intent enabled
- Ensure bot is in the server

**TypeScript errors?**
- Run `npm run build` to regenerate types
- Clear `.next` folder: `rm -r .next`

**Port 3000 in use?**
- Run `npm run dev -- -p 3001`

## Next Steps for Development

1. Add database persistence (PostgreSQL/MongoDB)
2. Implement Discord OAuth login
3. Create personal stats pages
4. Add role-based filtering
5. Implement data refresh schedule
6. Add export functionality (CSV/JSON)
7. Create admin dashboard
8. Add analytics and graphs

## Resources

- [Discord.js Documentation](https://discord.js.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Discord API Reference](https://discord.com/developers/docs/intro)

## Team Notes

- Project uses Latest Next.js with Turbopack for faster builds
- All components are client-side rendered (marked with 'use client')
- Consider server components for data fetching in future iterations
- Error handling implemented for API failures
- Responsive design works on mobile, tablet, and desktop

---

**Last Updated**: March 1, 2026
**Status**: ✅ Ready for Development & Deployment
