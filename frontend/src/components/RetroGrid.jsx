import { useEffect, useRef } from "react";

/**
 * Full-screen animated retro grid background with subtle parallax/pulse.
 * Fixed behind the app (z-negative), pointer-events disabled.
 */
export default function RetroGrid() {
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    let t = 0;
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      t += 0.008;
      const pulse = 0.6 + Math.sin(t) * 0.08;
      el.style.setProperty("--grid-opacity", pulse.toString());
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="retro-grid"
    >
      <div className="retro-grid__scanlines" />
    </div>
  );
}
