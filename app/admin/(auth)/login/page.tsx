"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Monitor,
  BarChart3,
  Megaphone,
  Boxes,
  ImageIcon,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const next: { email?: string; password?: string } = {};

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    }

    setFieldErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    const supabase = createClient();

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const services = [
    { icon: Monitor, label: "Websites" },
    { icon: BarChart3, label: "Dashboards" },
    { icon: Megaphone, label: "Marketing" },
    { icon: Boxes, label: "Architecture" },
    { icon: ImageIcon, label: "Portfolios" },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="flex min-h-screen w-full">

        {/* ================= LEFT LOGIN ================= */}

        <section className="relative flex w-full flex-col bg-white px-6 py-7 sm:px-10 lg:w-[42%] lg:px-12 xl:px-16 2xl:px-20">

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-[38px] font-black leading-none tracking-[-4px] text-[#EC1D25]">
                AP
              </span>
            </div>

            <div>
              <h2 className="text-[19px] font-bold tracking-tight text-[#242932]">
                <span className="text-[#EC1D25]">AP</span> Solutions Hub
              </h2>

              <p className="mt-1 text-[8px] font-semibold tracking-[0.18em] text-[#7B828C]">
                IDEAS · WEBSITES · GROWTH
              </p>
            </div>
          </div>


          {/* Mobile Header */}

          <div className="mt-10 lg:hidden">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#EC1D25]">
              ADMIN PORTAL
            </p>
          </div>


          {/* Login Area */}

          <div className="flex flex-1 items-center py-10 lg:py-6">

            <div className="w-full max-w-[470px]">

              {/* Heading */}

              <div className="mb-8">

                <div className="mb-4 h-[3px] w-9 rounded-full bg-[#EC1D25]" />

                <h1 className="text-[36px] font-bold leading-tight tracking-[-1.2px] text-[#252A33] sm:text-[42px] xl:text-[46px]">
                  Welcome{" "}
                  <span className="text-[#EC1D25]">
                    Back
                  </span>
                </h1>

                <p className="mt-3 max-w-[400px] text-[14px] leading-6 text-[#747C87]">
                  Sign in to your admin account and manage your projects,
                  clients and digital growth.
                </p>

              </div>


              {/* Error */}

              {error && (
                <div className="mb-5 rounded-xl border border-[#EC1D25]/20 bg-[#EC1D25]/5 px-4 py-3 text-[13px] text-[#EC1D25]">
                  {error}
                </div>
              )}


              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 flex items-center gap-2.5 text-[13px] font-medium text-[#4D5560]">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EC1D25]/5 text-[#EC1D25]">
                      <Mail size={16} strokeWidth={1.8} />
                    </span>

                    Email Address

                  </label>

                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder="Enter your email address"
                    className={`h-[54px] w-full rounded-[14px] border bg-[#FAFAFA] px-5 text-[14px] text-[#252A33] outline-none transition-all duration-200 placeholder:text-[#A5ABB3] ${
                      fieldErrors.email
                        ? "border-[#EC1D25]"
                        : "border-[#E1E4E8] focus:border-[#EC1D25] focus:bg-white focus:ring-4 focus:ring-[#EC1D25]/5"
                    }`}
                  />

                  {fieldErrors.email && (
                    <p className="mt-1.5 text-[12px] text-[#EC1D25]">
                      {fieldErrors.email}
                    </p>
                  )}

                </div>


                {/* Password */}

                <div>

                  <label className="mb-2 flex items-center gap-2.5 text-[13px] font-medium text-[#4D5560]">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EC1D25]/5 text-[#EC1D25]">
                      <Lock size={16} strokeWidth={1.8} />
                    </span>

                    Password

                  </label>


                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);

                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      placeholder="Enter your password"
                      className={`h-[54px] w-full rounded-[14px] border bg-[#FAFAFA] px-5 pr-14 text-[14px] text-[#252A33] outline-none transition-all duration-200 placeholder:text-[#A5ABB3] ${
                        fieldErrors.password
                          ? "border-[#EC1D25]"
                          : "border-[#E1E4E8] focus:border-[#EC1D25] focus:bg-white focus:ring-4 focus:ring-[#EC1D25]/5"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#858C95] transition-colors hover:text-[#EC1D25]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  {fieldErrors.password && (
                    <p className="mt-1.5 text-[12px] text-[#EC1D25]">
                      {fieldErrors.password}
                    </p>
                  )}

                </div>


                {/* Remember */}

                <div className="flex items-center justify-between pt-1">

                  <div className="flex items-center gap-2 text-[12px] text-[#69717B]">

                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#EC1D25] text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>

                    Remember me

                  </div>

                  <span className="text-[12px] font-medium text-[#EC1D25]">
                    Forgot password?
                  </span>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-[56px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#EC1D25] text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(236,29,37,0.22)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#D91820] hover:shadow-[0_16px_32px_rgba(236,29,37,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {loading ? "Signing in..." : "Sign In"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}

                </button>

              </form>


              {/* Security */}

              <div className="mt-8 flex items-center gap-3 border-t border-[#EEF0F2] pt-6">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F6F7] text-[#737B85]">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <p className="text-[12px] font-semibold text-[#4E5660]">
                    Secure login
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#9299A2]">
                    Your data is protected and encrypted.
                  </p>

                </div>

              </div>

            </div>

          </div>


          <p className="hidden text-[10px] text-[#A1A6AD] lg:block">
            © {new Date().getFullYear()} AP Solutions Hub
          </p>

        </section>



        {/* ================= RIGHT SHOWCASE ================= */}

        <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#FAFAF9] lg:flex">


          {/* Background subtle shapes */}

          <div className="absolute -right-[180px] top-[130px] h-[520px] w-[520px] rounded-full bg-[#EC1D25]" />

          <div className="absolute -bottom-[280px] right-[120px] h-[500px] w-[500px] rounded-full bg-[#EC1D25]" />


          {/* Main right content */}

          <div className="relative z-10 flex h-screen w-full flex-col px-10 py-10 xl:px-14 xl:py-12">


            {/* Admin badge */}

            <div className="flex justify-end">

              <div className="flex items-center gap-2 rounded-full border border-[#E5E6E8] bg-white px-4 py-2 shadow-sm">

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EC1D25]/10 text-[#EC1D25]">
                  <ShieldCheck size={13} />
                </span>

                <span className="text-[11px] font-medium text-[#535B65]">
                  Admin Portal
                </span>

              </div>

            </div>


            {/* Text */}

            <div className="mt-5">

              <p className="text-[10px] font-bold tracking-[0.2em] text-[#EC1D25]">
                DIGITAL SOLUTIONS FOR MODERN BUSINESSES
              </p>


              <h2 className="mt-3 max-w-[650px] text-[34px] font-bold leading-[1.12] tracking-[-1.5px] text-[#252A33] xl:text-[45px]">

                Websites. Dashboards.

                <br />

                <span className="text-[#EC1D25]">
                  Marketing. Architecture.
                </span>

                <br />

                Portfolios.

              </h2>


              <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[#737B85]">

                We build digital products that help your business grow,
                connect and stand out.

              </p>

            </div>


            {/* Services */}

            <div className="mt-6 flex items-center gap-2 xl:gap-4">

              {services.map((service) => {

                const Icon = service.icon;

                return (

                  <div
                    key={service.label}
                    className="flex min-w-[72px] flex-col items-center gap-2 xl:min-w-[86px]"
                  >

                    <div className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#F0F0F0] bg-white shadow-sm">

                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        className="text-[#EC1D25]"
                      />

                    </div>

                    <span className="text-[9px] font-medium text-[#555C65]">
                      {service.label}
                    </span>

                  </div>

                );

              })}

            </div>


            {/* Laptop */}

            <div className="relative mt-auto flex flex-1 items-end justify-center pb-4">


              {/* Laptop Container */}

              <div className="relative z-10 w-[72%] max-w-[700px]">

                <div className="overflow-hidden rounded-t-[18px] border-[7px] border-[#292D32] bg-white shadow-[0_22px_55px_rgba(0,0,0,0.20)]">


                  {/* Laptop Header */}

                  <div className="flex h-9 items-center justify-between border-b border-[#EDEEF0] px-4">

                    <span className="text-[7px] font-bold text-[#343A42]">

                      <span className="text-[#EC1D25]">
                        AP
                      </span>{" "}

                      Solutions Hub

                    </span>


                    <div className="flex gap-1.5">

                      <span className="h-1.5 w-1.5 rounded-full bg-[#EC1D25]" />

                      <span className="h-1.5 w-1.5 rounded-full bg-[#D9DDE1]" />

                    </div>

                  </div>


                  {/* Dashboard */}

                  <div className="flex h-[235px] xl:h-[270px]">


                    {/* Sidebar */}

                    <div className="w-[82px] border-r border-[#ECEEF0] bg-[#FAFAFA] p-3">

                      <div className="rounded-md bg-[#EC1D25] px-2 py-1.5 text-[6px] text-white">
                        Dashboard
                      </div>


                      {[
                        "Projects",
                        "Clients",
                        "Marketing",
                        "Analytics",
                        "Settings",
                      ].map((item) => (

                        <div
                          key={item}
                          className="mt-2.5 flex items-center gap-1.5 text-[6px] text-[#858C94]"
                        >

                          <span className="h-1 w-1 rounded-full bg-[#D5D8DC]" />

                          {item}

                        </div>

                      ))}

                    </div>


                    {/* Main */}

                    <div className="flex-1 p-4">

                      <p className="mb-3 text-[10px] font-semibold text-[#424851]">
                        Overview
                      </p>


                      <div className="grid grid-cols-3 gap-2.5">

                        {[
                          ["Projects", "24"],
                          ["Clients", "18"],
                          ["Revenue", "$12.4K"],
                        ].map(([label, value]) => (

                          <div
                            key={label}
                            className="rounded-lg bg-[#FAFAFA] p-2.5"
                          >

                            <p className="text-[5px] text-[#8D939B]">
                              {label}
                            </p>

                            <p className="mt-1.5 text-[11px] font-bold text-[#303640]">
                              {value}
                            </p>

                            <p className="mt-1 text-[5px] text-green-600">
                              +12%
                            </p>

                          </div>

                        ))}

                      </div>


                      {/* Chart */}

                      <div className="mt-3 rounded-xl border border-[#EEF0F2] p-3">

                        <div className="flex items-center justify-between">

                          <span className="text-[7px] font-semibold text-[#555C65]">
                            Project Growth
                          </span>

                          <span className="text-[6px] text-green-600">
                            +22%
                          </span>

                        </div>


                        <div className="mt-3 h-[95px]">

                          <svg
                            viewBox="0 0 500 130"
                            className="h-full w-full"
                            preserveAspectRatio="none"
                          >

                            <defs>

                              <linearGradient
                                id="dashboardGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >

                                <stop
                                  offset="0%"
                                  stopColor="#EC1D25"
                                  stopOpacity="0.18"
                                />

                                <stop
                                  offset="100%"
                                  stopColor="#EC1D25"
                                  stopOpacity="0"
                                />

                              </linearGradient>

                            </defs>


                            <path
                              d="M0 105 L40 85 L80 98 L120 70 L160 83 L200 55 L240 62 L280 38 L320 47 L360 20 L400 35 L440 10 L500 0 L500 130 L0 130 Z"
                              fill="url(#dashboardGradient)"
                            />

                            <path
                              d="M0 105 L40 85 L80 98 L120 70 L160 83 L200 55 L240 62 L280 38 L320 47 L360 20 L400 35 L440 10 L500 0"
                              fill="none"
                              stroke="#EC1D25"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                          </svg>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Laptop Base */}

                <div className="mx-auto h-4 w-[106%] -translate-x-[3%] rounded-b-[50%] bg-gradient-to-b from-[#3E4248] to-[#202328] shadow-lg" />

              </div>

            </div>


            {/* Floating bottom cards */}

            <div className="absolute bottom-7 left-10 z-20 rounded-xl bg-white px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.08)] xl:left-14">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EC1D25]/10 text-[#EC1D25]">
                  <ShieldCheck size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-[#353B43]">
                    Expert Team
                  </p>

                  <p className="text-[7px] text-[#8C939B]">
                    Creative · Technical · Dedicated
                  </p>

                </div>

              </div>

            </div>


            <div className="absolute bottom-7 right-10 z-20 rounded-xl bg-white px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.08)] xl:right-14">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EC1D25]/10 text-[#EC1D25]">
                  <ShieldCheck size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-[#353B43]">
                    Secure & Reliable
                  </p>

                  <p className="text-[7px] text-[#8C939B]">
                    Your Data · Our Priority
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}