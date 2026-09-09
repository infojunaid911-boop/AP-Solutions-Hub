"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:border-red hover:text-red disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={15} strokeWidth={1.8} />
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
