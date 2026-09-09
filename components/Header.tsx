"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  "Home",
  "Services",
  "Portfolio",
  "Process",
  "Packages",
  "Reviews",
  "Contact",
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<(typeof NAV_ITEMS)[number]>("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-premium ${
          scrolled
            ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(10,10,10,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-5 md:px-10">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5" onClick={() => setActive("Home")}>
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-ink text-sm font-display font-bold text-white">
              AP
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
              Solutions Hub
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setActive(item)}
                className="group relative py-1 text-[14.5px] font-medium text-ink/70 transition-colors duration-200 hover:text-ink"
              >
                {item}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-red transition-all duration-300 ease-premium ${
                    active === item ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink/70 transition-all duration-200 hover:border-ink hover:text-ink sm:flex"
            >
              <MessageCircle size={18} strokeWidth={1.8} />
            </a>
            <a
              href="#contact"
              className="hidden items-center rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-red sm:flex"
            >
              Get Started
            </a>

            {/* Mobile trigger */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink lg:hidden"
            >
              <Menu size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-5 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white text-sm font-display font-bold text-ink">
                  AP
                </span>
                <span className="font-display text-[15px] font-semibold text-white">
                  Solutions Hub
                </span>
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <nav className="mt-16 flex flex-1 flex-col justify-center gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setActive(item);
                    setMenuOpen(false);
                  }}
                  className="border-b border-white/10 py-5 font-display text-3xl font-semibold text-white/90 transition-colors active:text-red"
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mb-4 flex items-center justify-center rounded-full bg-red py-4 text-base font-semibold text-white"
            >
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
