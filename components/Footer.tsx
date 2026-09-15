import { Facebook, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/whatsapp";

const SERVICES = [
  "Website Development",
  "Dashboard Development",
  "Digital Marketing",
  "Graphic Design",
  "3D Architecture",
];

const COMPANY = [
  { label: "About", href: "#why-us" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Packages", href: "#packages" },
  { label: "Reviews", href: "#reviews" },
];

export default function Footer() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <footer className="bg-ink pt-20">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="grid gap-12 pb-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
<div>
  <span className="flex items-center gap-2.5">
    <img
  src="/previews/footerlogo.png"
  alt="AP Solutions Hub"
  className="h-8 w-auto object-contain"
/>
     </span>
            <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-white/50">
              We build digital solutions that help businesses grow.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="https://www.instagram.com/apsolutionshub/" label="Instagram">
                <Instagram size={16} strokeWidth={1.8} />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <Linkedin size={16} strokeWidth={1.8} />
              </SocialIcon>
              <SocialIcon href="https://www.facebook.com/apsolutionshub.pk" label="Facebook">
                <Facebook size={16} strokeWidth={1.8} />
              </SocialIcon>
            </div>
          </div>

          {/* Services */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-white/35">
              Services
            </span>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-[14px] text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-white/35">
              Company
            </span>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="text-[14px] text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-white/35">
              Contact
            </span>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="mailto:hello@apsolutionshub.com"
                  className="flex items-center gap-2 text-[14px] text-white/60 transition-colors duration-200 hover:text-white"
                >
                  <Mail size={14} strokeWidth={1.8} />
                  Email
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14px] text-white/60 transition-colors duration-200 hover:text-white"
                >
                  <MessageCircle size={14} strokeWidth={1.8} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-[13px] text-white/40">
            © 2026 AP Solutions Hub. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[13px] text-white/40 transition-colors duration-200 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-[13px] text-white/40 transition-colors duration-200 hover:text-white">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/60 transition-colors duration-200 hover:border-white/30 hover:text-white"
    >
      {children}
    </a>
  );
}
