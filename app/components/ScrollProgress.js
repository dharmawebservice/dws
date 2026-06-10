"use client";
import { useEffect } from "react";

export default function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const w = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = `${w}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="scroll-progress" style={{ width: "0%" }} />;
}
