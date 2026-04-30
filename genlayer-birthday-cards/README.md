# GenLayer Birthday Cards

Small standalone Express app that generates SVG birthday cards.

Run locally:

```bash
cd genlayer-birthday-cards
npm install
npm run start
```

Open http://localhost:3001 to use the simple UI. The app exposes:

- `GET /api/birthday?name=Name&message=Message&theme=default` — returns SVG
- `POST /api/birthday` — JSON body `{ name, message, theme }` — returns SVG

Integration notes:

- You can copy your UI files into `public/` or update an external UI to call the endpoints above.
- To plug this into the existing `genlayer-stats` Next app, point the UI to `http://localhost:3001/api/birthday` or integrate the SVG generator logic directly into the Next app's API routes (already present in that repo).
