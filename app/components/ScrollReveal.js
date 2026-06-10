"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("active");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
