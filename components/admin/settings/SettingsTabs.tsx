"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LogOut, Loader2 } from "lucide-react";
import {
  changeAdminPassword,
  signOutAdmin,
  updateAdminName,
} from "@/app/admin/(dashboard)/settings/actions";

const TABS = [
  "Business Info",
  "Social Media",
  "WhatsApp",
  "Website",
  "Admin Profile",
  "Danger Zone",
] as const;
type Tab = (typeof TABS)[number];

/**
 * Shown on every tab whose fields have nowhere to persist yet. See the
 * chat response for the full explanation — short version: there is no
 * settings table in the schema, and per the brief this feature isn't
 * allowed to create one automatically. The form is real and usable so
 * you can see the intended interface; Save just can't write anywhere
 * durable until that's decided.
 */
function NotPersistedNotice() {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red/20 bg-red/5 p-4 text-sm text-ink/70">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red" />
      <p>
        Not saved yet. There&apos;s no settings table in the database for this content, and this
        build intentionally doesn&apos;t create one automatically — see the setup note that came
        with this delivery for the two options.
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink/70">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
      />
    </label>
  );
}

export default function SettingsTabs({
  adminEmail,
  adminName,
  adminRole,
}: {
  adminEmail: string;
  adminName: string;
  adminRole: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Business Info");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-ink/50">
            Manage your AP Solutions Hub website and admin preferences.
          </p>
        </div>
        <button
          onClick={() =>
            startTransition(async () => {
              await signOutAdmin();
              router.push("/admin/login");
            })
          }
          disabled={isPending}
          className="flex shrink-0 items-center gap-2 rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-mist disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              tab === t ? "bg-ink text-white" : "bg-mist text-ink/60 hover:bg-ink/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-xl rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        {tab === "Business Info" && <BusinessInfoForm />}
        {tab === "Social Media" && <SocialMediaForm />}
        {tab === "WhatsApp" && <WhatsAppForm />}
        {tab === "Website" && <WebsiteForm />}
        {tab === "Admin Profile" && (
          <AdminProfileForm email={adminEmail} name={adminName} role={adminRole} />
        )}
        {tab === "Danger Zone" && <DangerZone />}
      </div>
    </div>
  );
}

function UnsavedForm({
  children,
  onSaveClick,
}: {
  children: React.ReactNode;
  onSaveClick: () => void;
}) {
  return (
    <div>
      <NotPersistedNotice />
      <div className="space-y-4">{children}</div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onSaveClick}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function BusinessInfoForm() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-ink">Business Information</h2>
      <UnsavedForm onSaveClick={() => setMsg("Nothing to save yet — see the notice above.")}>
        <Field label="Business Name" defaultValue="AP Solutions Hub" />
        <Field label="Email Address" type="email" placeholder="hello@apsolutionshub.com" />
        <Field label="WhatsApp Number" placeholder="+92 300 0000000" />
        <Field label="Phone Number" placeholder="+92 21 0000000" />
        <Field label="Business Address" placeholder="Karachi, Pakistan" />
        <Field label="Website URL" placeholder="https://apsolutionshub.com" />
      </UnsavedForm>
      {msg && <p className="mt-3 text-xs text-ink/40">{msg}</p>}
    </div>
  );
}

function SocialMediaForm() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-ink">Social Media</h2>
      <UnsavedForm onSaveClick={() => setMsg("Nothing to save yet — see the notice above.")}>
        <Field label="Instagram URL" placeholder="https://instagram.com/apsolutionshub" />
        <Field label="Facebook URL" placeholder="https://facebook.com/apsolutionshub" />
        <Field label="LinkedIn URL" placeholder="https://linkedin.com/company/apsolutionshub" />
        <Field label="YouTube URL" placeholder="https://youtube.com/@apsolutionshub" />
        <Field label="TikTok URL" placeholder="https://tiktok.com/@apsolutionshub" />
      </UnsavedForm>
      {msg && <p className="mt-3 text-xs text-ink/40">{msg}</p>}
      <p className="mt-3 text-xs text-ink/40">
        Currently these are hardcoded directly in <code>components/Footer.tsx</code>.
      </p>
    </div>
  );
}

function WhatsAppForm() {
  const [enabled, setEnabled] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-ink">WhatsApp Settings</h2>
      <UnsavedForm onSaveClick={() => setMsg("Nothing to save yet — see the notice above.")}>
        <Field label="WhatsApp Number" placeholder="923000000000 (numbers only)" />
        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Default WhatsApp Message</span>
          <textarea
            rows={3}
            placeholder="Hi AP Solutions Hub, I'm interested in your services and would like to discuss my project."
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <span className="text-ink/70">Enable Floating WhatsApp Button</span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={`h-6 w-11 rounded-full transition ${enabled ? "bg-red" : "bg-ink/15"}`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition ${
                enabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      </UnsavedForm>
      {msg && <p className="mt-3 text-xs text-ink/40">{msg}</p>}
      <p className="mt-3 text-xs text-ink/40">
        Currently sourced from constants in <code>lib/whatsapp.ts</code>, used by the footer and
        the floating WhatsApp button.
      </p>
    </div>
  );
}

function WebsiteForm() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-ink">Website Settings</h2>
      <UnsavedForm onSaveClick={() => setMsg("Nothing to save yet — see the notice above.")}>
        <Field label="Website Name" defaultValue="AP Solutions Hub" />
        <label className="block text-sm">
          <span className="mb-1 block text-ink/70">Website Description</span>
          <textarea
            rows={2}
            placeholder="We build digital solutions that help businesses grow."
            className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </label>
        <Field label="Contact Email" type="email" placeholder="hello@apsolutionshub.com" />
        <Field
          label="Footer Copyright Text"
          defaultValue="© 2026 AP Solutions Hub. All Rights Reserved."
        />
      </UnsavedForm>
      {msg && <p className="mt-3 text-xs text-ink/40">{msg}</p>}
    </div>
  );
}

function AdminProfileForm({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: string;
}) {
  const [fullName, setFullName] = useState(name);
  const [isPending, startTransition] = useTransition();
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwPending, startPwTransition] = useTransition();

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(null);
    setNameError(null);
    startTransition(async () => {
      try {
        await updateAdminName(fullName);
        setNameMsg("Name updated.");
      } catch (err) {
        setNameError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwError(null);
    if (newPassword !== confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }
    startPwTransition(async () => {
      try {
        await changeAdminPassword(newPassword);
        setNewPassword("");
        setConfirmPassword("");
        setPwMsg("Password changed.");
      } catch (err) {
        setPwError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-sm font-semibold text-ink">Admin Profile</h2>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="text-sm">
            <span className="mb-1 block text-ink/50">Email</span>
            <p className="text-ink">{email || "—"}</p>
          </div>
          <div className="text-sm">
            <span className="mb-1 block text-ink/50">Role</span>
            <span className="inline-block rounded-full bg-mist px-2 py-0.5 text-xs font-medium capitalize text-ink/70">
              {role}
            </span>
          </div>
        </div>

        <form onSubmit={saveName} className="space-y-3">
          {nameError && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{nameError}</p>}
          {nameMsg && <p className="rounded-md bg-ink/5 px-3 py-2 text-sm text-ink/70">{nameMsg}</p>}
          <Field
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Name
          </button>
        </form>
      </div>

      <div className="border-t border-ink/10 pt-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Change Password</h2>
        <form onSubmit={savePassword} className="space-y-3">
          {pwError && <p className="rounded-md bg-red/10 px-3 py-2 text-sm text-red">{pwError}</p>}
          {pwMsg && <p className="rounded-md bg-ink/5 px-3 py-2 text-sm text-ink/70">{pwMsg}</p>}
          <Field
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
          />
          <Field
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
          />
          <button
            type="submit"
            disabled={pwPending || !newPassword}
            className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50"
          >
            {pwPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

function DangerZone() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <h2 className="mb-1 text-sm font-semibold text-red">Danger Zone</h2>
      <p className="mb-4 text-sm text-ink/50">
        End your current admin session on this device.
      </p>
      <button
        onClick={() =>
          startTransition(async () => {
            await signOutAdmin();
            router.push("/admin/login");
          })
        }
        disabled={isPending}
        className="flex items-center gap-2 rounded-md border border-red/30 bg-red/5 px-4 py-2 text-sm font-medium text-red hover:bg-red/10 disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Sign Out
      </button>
    </div>
  );
}
