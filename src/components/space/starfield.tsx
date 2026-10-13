"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  tw: number;
  hue: number;
};
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * Fixed full-viewport 2D starfield behind every page: three parallax depth
 * layers that drift with scroll, gentle twinkle and the odd shooting star.
 * Cheap on purpose — the expensive WebGL lives only in the hero.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mobile = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    let lastDraw = 0;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let lastScroll = -1;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      width = document.documentElement.clientWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(mobile ? 90 : 240, (width * height) / 5000));
      stars = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height * 3,
          z,
          r: 0.25 + z * z * 1.35,
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.12 ? 265 : Math.random() < 0.2 ? 190 : 230,
        };
      });
    };

    const draw = (time = 0) => {
      const scroll = window.scrollY;
      // Idle stars can update slowly; parallax must follow every scroll frame.
      if (scroll === lastScroll && time - lastDraw < (mobile ? 32 : 16)) {
        if (visible) raf = requestAnimationFrame(draw);
        return;
      }
      const step = Math.min(Math.max(time - lastDraw, 0), 100) / 32;
      lastDraw = time;
      lastScroll = scroll;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const parallax = 0.04 + s.z * 0.22;
        let y = (s.y - scroll * parallax) % (height * 3);
        if (y < 0) y += height * 3;
        if (y > height + 4) continue;

        const twinkle = 0.65 + Math.sin(time * 0.0006 + s.tw) * 0.35;
        const alpha = (0.25 + s.z * 0.75) * twinkle;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 80%, ${82 + s.z * 12}%, ${alpha})`;
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.z > 0.93) {
          ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!mobile && Math.random() < 0.004 * step && meteors.length < 2) {
        const fromLeft = Math.random() < 0.5;
        meteors.push({
          x: fromLeft
            ? Math.random() * width * 0.5
            : width * (0.5 + Math.random() * 0.5),
          y: Math.random() * height * 0.4,
          vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
          vy: 3 + Math.random() * 2.5,
          life: 1,
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * step;
        m.y += m.vy * step;
        m.life -= 0.012 * step;
        const tail = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - m.vx * 14,
          m.y - m.vy * 14,
        );
        tail.addColorStop(0, `rgba(226, 232, 255, ${m.life})`);
        tail.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
        ctx.stroke();
        if (m.life <= 0) meteors.splice(i, 1);
      }

      if (visible) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    };

    const onResize = () => { resize(); };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgb(76_29_149/0.28),transparent_60%),radial-gradient(ellipse_60%_50%_at_0%_100%,rgb(14_116_144/0.18),transparent_60%)]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
