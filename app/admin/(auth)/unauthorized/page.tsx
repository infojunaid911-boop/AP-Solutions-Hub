import { ShieldAlert } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-white p-8 text-center md:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red/10 text-red">
          <ShieldAlert size={24} strokeWidth={1.8} />
        </span>
        <h1 className="mt-6 font-display text-xl font-semibold text-ink">Access Restricted</h1>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink/55">
          Your account doesn&apos;t have admin access. If you believe this is a mistake, contact
          the site owner.
        </p>
        <div className="mt-7">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
