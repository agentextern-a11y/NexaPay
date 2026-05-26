import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating orbs
    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 150 + Math.random() * 250,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      hue: 200 + Math.random() * 40,
    }));

    // Small particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: 0.1 + Math.random() * 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw gradient orbs
      for (const orb of orbs) {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r) orb.x = w + orb.r;
        if (orb.x > w + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = h + orb.r;
        if (orb.y > h + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, 0.04)`);
        grad.addColorStop(0.5, `hsla(${orb.hue}, 60%, 50%, 0.02)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = `rgba(148, 191, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}

export function MeshGradientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(210, 60%, 98%) 0%, hsl(200, 50%, 96%) 50%, hsl(210, 55%, 97%) 100%)" }} />

      {/* Animated mesh blobs */}
      <div
        className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, hsl(195, 90%, 65%) 0%, transparent 70%)",
          animation: "float1 20s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, hsl(220, 80%, 60%) 0%, transparent 70%)",
          animation: "float2 25s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, hsl(180, 70%, 55%) 0%, transparent 70%)",
          animation: "float3 18s ease-in-out infinite alternate",
        }}
      />

      {/* Fine dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(210, 30%, 60%) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <style>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, -60px) scale(1.15); }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -30px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
