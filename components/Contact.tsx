"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { submitInquiryAction } from "@/app/contact/actions";
import { CONTACT_BUDGET_OPTIONS, CONTACT_SERVICE_OPTIONS } from "@/lib/inquiries";

const SERVICE_OPTIONS = CONTACT_SERVICE_OPTIONS;
const BUDGET_OPTIONS = CONTACT_BUDGET_OPTIONS;

type FormState = {
  fullName: string;
  businessName: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  description: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  businessName: "",
  email: "",
  whatsapp: "",
  service: "",
  budget: "",
  description: "",
};

const REASSURANCES = [
  { icon: Clock, text: "We reply within 24 hours" },
  { icon: ShieldCheck, text: "No obligation, free consultation" },
  { icon: MessageCircle, text: "Talk to a real strategist, not a bot" },
];

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Honeypot: real visitors never see or fill this field. Any bot that
  // fills every input on the page will trip it.
  const [website, setWebsite] = useState("");
  // Submissions faster than a human can plausibly fill the form are
  // treated as spam server-side too — see app/contact/actions.ts.
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.businessName.trim()) next.businessName = "Business name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.whatsapp.trim()) next.whatsapp = "WhatsApp number is required.";
    if (!form.service) next.service = "Select the service you need.";
    if (!form.budget) next.budget = "Select a budget range.";
    if (!form.description.trim() || form.description.trim().length < 20)
      next.description = "Tell us a little more about your project (at least 20 characters).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    if (submitting) return;

    setSubmitting(true);
    try {
      const result = await submitInquiryAction({
        fullName: form.fullName,
        businessName: form.businessName,
        email: form.email,
        whatsapp: form.whatsapp,
        service: form.service,
        budget: form.budget,
        description: form.description,
        website,
        startedAt,
      });

      if (result.ok) {
        setSubmitted(true);
      } else {
        setFormError(result.error);
      }
    } catch {
      setFormError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    setFormError(null);
    setWebsite("");
    setStartedAt(Date.now());
    setSubmitted(false);
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition-colors duration-200 placeholder:text-ink/30 ${
      hasError ? "border-red" : "border-ink/12 focus:border-ink"
    }`;

  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-shell px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.75rem]">
              Tell us what you want to build.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/60">
              Have an idea or project in mind? Tell us about it.
            </p>

            <ul className="mt-10 space-y-4">
              {REASSURANCES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[14px] font-medium text-ink/65">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-offwhite text-red">
                    <Icon size={15} strokeWidth={1.8} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-ink/10 bg-offwhite p-6 md:p-10"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white">
                    <Check size={26} strokeWidth={2} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                    Your inquiry has been received.
                  </h3>
                  <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink/55">
                    We&apos;ll get back to you soon.
                  </p>
                  <button onClick={resetForm} className="mt-8 text-[13.5px] font-semibold text-red underline-offset-4 hover:underline">
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                  {/* Honeypot — hidden from real visitors, left as bait for bots. */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <Field label="Full Name" error={errors.fullName}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Your name"
                      className={inputClass(errors.fullName)}
                    />
                  </Field>

                  <Field label="Business Name" error={errors.businessName}>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                      placeholder="Your business"
                      className={inputClass(errors.businessName)}
                    />
                  </Field>

                  <Field label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@business.com"
                      className={inputClass(errors.email)}
                    />
                  </Field>

                  <Field label="WhatsApp Number" error={errors.whatsapp}>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      placeholder="+1 234 567 8901"
                      className={inputClass(errors.whatsapp)}
                    />
                  </Field>

                  <Field label="Service Needed" error={errors.service}>
                    <select
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      className={`${inputClass(errors.service)} appearance-none`}
                    >
                      <option value="">Select a service</option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Budget Range" error={errors.budget}>
                    <select
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      className={`${inputClass(errors.budget)} appearance-none`}
                    >
                      <option value="">Select a range</option>
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Project Description" error={errors.description} className="sm:col-span-2">
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Tell us about your idea, goals and timeline..."
                      rows={5}
                      className={`${inputClass(errors.description)} resize-none`}
                    />
                  </Field>

                  {formError && (
                    <p className="sm:col-span-2 text-[13px] text-red">{formError}</p>
                  )}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:bg-red disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? "Sending..." : "Send Project Inquiry"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-ink/45">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[12.5px] text-red">{error}</span>}
    </label>
  );
}
