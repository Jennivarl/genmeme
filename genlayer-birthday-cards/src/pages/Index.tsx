import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, PartyPopper, Cake, Upload, User } from "lucide-react";
import { toast } from "sonner";
import genlayerLogo from "@/assets/genlayer-logo.png";
import mochiMascot from "@/assets/mochi-mascot.png";

const themes = [
  { name: "Cosmic", from: "270 90% 60%", via: "320 90% 62%", to: "25 95% 62%" },
  { name: "Sunset", from: "15 95% 60%", via: "340 90% 60%", to: "280 85% 60%" },
  { name: "Mint", from: "160 80% 50%", via: "190 85% 55%", to: "260 80% 65%" },
  { name: "Candy", from: "330 95% 65%", via: "290 90% 65%", to: "200 95% 60%" },
];

const Index = () => {
  const [name, setName] = useState("Alex");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("Wishing you the most epic year ahead. Stay legendary! 🎉");
  const [from, setFrom] = useState("The Genlayer Crew");
  const [theme, setTheme] = useState(themes[0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  };

  const download = async () => {
    try {
      toast.loading('Generating card…', { id: 'dl' });
      const dataUrl = await drawCardToCanvas();
      const link = document.createElement('a');
      link.download = `birthday-${name || 'card'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Card downloaded! 🎂', { id: 'dl' });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't export the card.", { id: 'dl' });
    }
  };

  const loadImg = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    const words = text.split(' ');
    let line = '';
    let y = startY;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y);
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawCardToCanvas = async (): Promise<string> => {
    const W = 1200;
    const H = 1500;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, `hsl(${theme.from})`);
    grad.addColorStop(0.5, `hsl(${theme.via})`);
    grad.addColorStop(1, `hsl(${theme.to})`);
    roundRect(ctx, 0, 0, W, H, 60);
    ctx.fillStyle = grad;
    ctx.fill();

    // Decorative blobs
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(W, 0, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(0, H, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Mochi mascot bottom-right
    try {
      const mochi = await loadImg(mochiMascot);
      const ms = 360;
      ctx.save();
      ctx.translate(W + 10, H + 10);
      ctx.rotate((12 * Math.PI) / 180);
      ctx.drawImage(mochi, -ms, -ms, ms, ms);
      ctx.restore();
    } catch { /* skip */ }

    // "Happy Birthday" badge top-left
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, 60, 60, 340, 64, 32);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '500 30px system-ui,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🎉 Happy Birthday', 84, 102);
    ctx.restore();

    // Cake icon top-right
    ctx.save();
    ctx.font = '52px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('🎂', W - 60, 108);
    ctx.restore();

    // Profile picture
    const hasPic = !!profilePic;
    const picCY = 600;
    if (hasPic && profilePic) {
      try {
        const pic = await loadImg(profilePic);
        const cx = W / 2;
        const pr = 130;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, picCY, pr, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(pic, cx - pr, picCY - pr, pr * 2, pr * 2);
        ctx.restore();
        // border
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, picCY, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } catch { /* skip */ }
    }

    const textTop = hasPic ? 790 : 520;

    // "Hey,"
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.90)';
    ctx.font = '500 68px Georgia,serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hey,', W / 2, textTop);
    ctx.restore();

    // Name
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 140px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name || 'Friend', W / 2, textTop + 170, W - 80);
    ctx.restore();

    // Message
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = '400 42px system-ui,sans-serif';
    ctx.textAlign = 'center';
    wrapText(ctx, message, W / 2, textTop + 300, 920, 62);
    ctx.restore();

    // FROM label
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    ctx.font = '400 24px system-ui,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('FROM', 80, H - 130);
    ctx.restore();

    // From name
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '500 56px Georgia,serif';
    ctx.textAlign = 'left';
    ctx.fillText(from || 'Your friends', 80, H - 68);
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  const cardStyle = {
    backgroundImage: `linear-gradient(135deg, hsl(${theme.from}), hsl(${theme.via}) 50%, hsl(${theme.to}))`,
  };

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur">
            <img src={genlayerLogo} alt="Genlayer logo" className="h-4 w-4" />
            <span className="text-sm font-medium text-muted-foreground">Genlayer Community Birthday Cards</span>
          </div>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            Make a <span className="text-brand">birthday card</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Drop a name, pick a vibe, share it on X.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Form */}
          <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-card backdrop-blur md:p-8">
            <h2 className="font-display mb-6 text-2xl font-semibold">Customize</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Profile pic</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profilePic ? "Change image" : "Upload image"}
                  </Button>
                  {profilePic && (
                    <Button type="button" variant="ghost" onClick={() => setProfilePic(null)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-4 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t)}
                      className={`group relative h-16 overflow-hidden rounded-xl ring-offset-2 ring-offset-background transition-all ${theme.name === t.name ? "ring-2 ring-primary" : "hover:scale-105"
                        }`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, hsl(${t.from}), hsl(${t.via}) 50%, hsl(${t.to}))`,
                      }}
                      aria-label={t.name}
                    >
                      <span className="absolute inset-x-0 bottom-0 bg-black/30 py-0.5 text-[10px] font-medium text-white">
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={download} size="lg" className="w-full bg-brand text-primary-foreground shadow-glow hover:opacity-95">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
          </section>

          {/* Preview */}
          <section className="flex items-start justify-center">
            <div
              ref={cardRef}
              style={cardStyle}
              className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl p-8 text-white shadow-card"
            >
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-12 -left-10 h-56 w-56 rounded-full bg-black/20 blur-2xl" />
              <img
                src={mochiMascot}
                alt="Mochi mascot"
                className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rotate-12 drop-shadow-2xl md:h-48 md:w-48"
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                    <PartyPopper className="h-3.5 w-3.5" /> Happy Birthday
                  </div>
                  <Cake className="h-6 w-6 opacity-90" />
                </div>

                <div className="my-auto text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white/40 bg-white/15 shadow-lg">
                    {profilePic ? (
                      <img src={profilePic} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-10 w-10 opacity-80" />
                      </div>
                    )}
                  </div>
                  <p className="font-script text-3xl opacity-90">Hey,</p>
                  <h2 className="font-display text-5xl font-bold leading-tight md:text-6xl break-words">
                    {name || "Friend"}
                  </h2>
                  <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed opacity-95">
                    {message}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-75">From</p>
                    <p className="font-script text-2xl">{from || "Your friends"}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Built with <span className="text-brand font-semibold">love</span> for the Genlayer community.
        </footer>
      </div>
    </main>
  );
};

export default Index;
