import generateCardSVG from '../../../../lib/card';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const name = body?.name ?? 'Friend';
        const message = body?.message ?? 'Happy Birthday!';
        const theme = body?.theme ?? 'default';

        const svg = generateCardSVG({ name, message, theme });

        return new Response(svg, {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') ?? 'Friend';
    const message = url.searchParams.get('message') ?? 'Happy Birthday!';
    const theme = url.searchParams.get('theme') ?? 'default';

    const svg = generateCardSVG({ name, message, theme });
    return new Response(svg, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
}
