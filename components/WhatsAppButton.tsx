"use client";

import { motion } from "framer-motion";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-4 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-200 hover:-translate-y-0.5 sm:bottom-7 sm:right-7"
      style={{ paddingBottom: "max(0.875rem, env(safe-area-inset-bottom))" }}
    >
      {/* Pulse ring */}
      <motion.span
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 -z-10 rounded-full bg-[#25D366]"
      />

      <WhatsAppIcon className="h-6 w-6 shrink-0" />

      <span className="hidden text-[13.5px] font-semibold sm:inline">Chat With Us</span>
    </a>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.652 4.527 1.785 6.396L4 29l7.79-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.997 16.972c-.3.842-1.487 1.55-2.436 1.756-.648.14-1.494.252-4.34-.933-3.64-1.51-5.98-5.203-6.163-5.444-.176-.242-1.474-1.963-1.474-3.744 0-1.78.933-2.654 1.264-3.02.3-.33.658-.412.878-.412.22 0 .44.002.632.012.203.01.475-.077.744.567.3.72 1.02 2.5 1.11 2.682.09.183.15.396.03.638-.12.242-.18.393-.36.605-.18.212-.378.474-.54.638-.18.182-.368.38-.158.744.21.363.933 1.539 2.003 2.492 1.377 1.228 2.538 1.61 2.902 1.79.363.182.575.152.788-.09.212-.242.9-1.05 1.14-1.412.24-.363.48-.303.81-.182.33.121 2.1.99 2.46 1.17.36.182.6.272.688.424.09.152.09.878-.21 1.72Z" />
    </svg>
  );
}
