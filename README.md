# Meme Generator

A powerful, web-based meme generator with draggable text boxes. Create hilarious memes with your custom templates and download them instantly.

## Features

✅ **Multiple Template Support** - 10 customizable meme templates
✅ **Draggable Text Boxes** - Click and drag text anywhere on the meme
✅ **Text Customization** - Font, size, color, bold, italic controls
✅ **Add/Remove Text** - Create unlimited text layers
✅ **Download as PNG** - High-quality image export
✅ **Responsive Design** - Works on desktop and mobile
✅ **Dark UI** - Easy on the eyes, gaming aesthetic

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Add Your Templates

Place your 10 meme template images in:
```
public/memes/
├── template1.png
├── template2.png
├── ... through ...
└── template10.png
```

Templates should be PNG or JPG format, 600x600px recommended.

## How to Use

1. **Select a template** from the dropdown
2. **Click on text** to edit it
3. **Drag text boxes** to position them anywhere
4. **Customize fonts** - Change size, color, family, bold/italic
5. **Add more text** - Click "+ Add Text Box" button
6. **Download** - Click "📥 Download Meme" to save as PNG

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Birthday Card API

You can generate a simple SVG birthday card from the app with the built-in API route.

- **Endpoint (GET)**: `/api/birthday?name=Name&message=Message&theme=default`
- **Endpoint (POST)**: `/api/birthday` with JSON body `{ "name": "Name", "message": "Happy Birthday!", "theme": "pastel" }`

Example `fetch` (returns an SVG response):

```js
// GET example (open in <img src="/api/birthday?name=Alice">)
fetch('/api/birthday?name=Alice&message=Have%20a%20great%20day')
	.then(res => res.text())
	.then(svg => { /* set as img src using data URI or insert into DOM */ });

// POST example
fetch('/api/birthday', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ name: 'Alice', message: 'Have a great day!', theme: 'pastel' })
})
	.then(res => res.text())
	.then(svg => { /* use svg */ });
```

Integration notes:
- If you have the UI at `C:\\Users\\USER\\Downloads\\genlayer-birthday-cards (1)`, copy the UI files into `public/birthday-ui` or update its fetch target to `/api/birthday`.
- The API returns raw SVG; the front-end can render this by setting an `<img>` src to a data URL (`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`) or inserting the SVG markup into the DOM.

