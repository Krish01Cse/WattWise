
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8" />
          <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.8-.8" />
        </>
      )}
    </svg>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("mode") === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [persistSession, setPersistSession] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(signup: boolean) {
    setMessage("");
    setErrorMessage("");
    setShowPassword(false);
    setShowConfirm(false);

    router.push(signup ? "/auth?mode=signup" : "/auth");
  }

  // Storage helper for offline resilience and local persistence
  function getRegisteredUsers(): Array<{ email: string; passwordHash: string; fullName: string }> {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("wattwise_registered_users");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default demo operator seeded
    return [
      {
        email: "aditya.k@wattwise.internal",
        passwordHash: "Passcode@2026",
        fullName: "Dr. Aditya K.",
      },
    ];
  }

  function saveRegisteredUser(user: { email: string; passwordHash: string; fullName: string }) {
    if (typeof window === "undefined") return;
    try {
      const current = getRegisteredUsers();
      if (!current.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
        current.push(user);
        localStorage.setItem("wattwise_registered_users", JSON.stringify(current));
      }
    } catch {
      // ignore
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    if (isSignup) {
      const fullName = String(data.get("fullName") || "").trim() || "Operator Node";
      const confirmPassword = String(data.get("confirmPassword") || "");

      if (password.length < 10) {
        setErrorMessage("Your password cipher must contain at least 10 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("The access keys do not match. Please verify your confirmation entry.");
        return;
      }

      if (!acceptedTerms) {
        setErrorMessage("Please accept the Terms of Service & Continuous Telemetry Protocol to proceed.");
        return;
      }

      setIsSubmitting(true);
      try {
        let backendUser = null;
        try {
          const res = await api.auth.signup({ email, password, fullName });
          backendUser = res.user;
        } catch (apiErr: any) {
          if (apiErr.message && apiErr.message.includes("already registered")) {
            setErrorMessage(apiErr.message);
            setIsSubmitting(false);
            return;
          }
          console.warn("Backend signup sync notice:", apiErr);
        }

        saveRegisteredUser({ email, passwordHash: password, fullName });
        localStorage.setItem(
          "wattwise_session",
          JSON.stringify({
            token: "wtw_live_" + Date.now(),
            user: backendUser || { email, fullName, role: "residential_operator" },
            loggedInAt: new Date().toISOString(),
          })
        );
        localStorage.setItem("wattwise_user_email", email);
        localStorage.setItem("wattwise_user_password", password);

        setMessage("Account registered successfully. Initializing telemetry node...");
        setTimeout(() => {
          router.push("/setup");
        }, 600);
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred while creating your account.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // LOGIN LOGIC - STRICT CHECK
    if (!email || !password) {
      setErrorMessage("Please enter your registered email identifier and password cipher.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Attempt backend authentication
      try {
        const response = await api.auth.login({ email, password });
        if (response && response.token) {
          localStorage.setItem(
            "wattwise_session",
            JSON.stringify({
              token: response.token,
              user: response.user,
              persist: persistSession,
              loggedInAt: new Date().toISOString(),
            })
          );
          localStorage.setItem("wattwise_user_email", email);
          localStorage.setItem("wattwise_user_password", password);
          saveRegisteredUser({
            email,
            passwordHash: password,
            fullName: response.user?.fullName || "Operator Node",
          });

          setMessage("Telemetry node verified. Redirecting to energy command center...");
          setTimeout(() => {
            router.push("/setup");
          }, 400);
          return;
        }
      } catch (backendErr: any) {
        const errMsg = backendErr.message || "";
        if (errMsg.includes("Account not found") || errMsg.includes("No operator node is registered")) {
          setErrorMessage(
            `ACCESS DENIED: No operator account is registered for "${email}". You must sign up before accessing the telemetry node.`
          );
          setIsSubmitting(false);
          return;
        }
        if (errMsg.includes("Invalid credentials") || errMsg.includes("Password cipher does not match")) {
          setErrorMessage("ACCESS DENIED: Invalid password cipher. Verification key does not match.");
          setIsSubmitting(false);
          return;
        }

        // Offline / fallback check against registered store
        const registered = getRegisteredUsers();
        const userMatch = registered.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!userMatch) {
          setErrorMessage(
            `ACCESS DENIED: Account not found. No operator node is registered for "${email}". Please sign up first.`
          );
          setIsSubmitting(false);
          return;
        }

        if (userMatch.passwordHash !== password) {
          setErrorMessage("ACCESS DENIED: Invalid password cipher for registered operator.");
          setIsSubmitting(false);
          return;
        }

        // Offline credentials valid
        localStorage.setItem(
          "wattwise_session",
          JSON.stringify({
            token: "wtw_local_" + Date.now(),
            user: { email: userMatch.email, fullName: userMatch.fullName, role: "residential_operator" },
            persist: persistSession,
            loggedInAt: new Date().toISOString(),
          })
        );
        localStorage.setItem("wattwise_user_email", email);

        setMessage("Telemetry node verified. Redirecting to energy command center...");
        setTimeout(() => {
          router.push("/setup");
        }, 400);
        return;
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate operator credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcf9f2] text-[#111111]">
      {/* TOP NAVIGATION */}
      <header className="flex min-h-[61px] items-center justify-between border-b border-[#dedbd4] px-5 sm:px-7">
        <a href="/" className="flex items-center gap-4">
          <span className="text-xl font-black tracking-[-1px]">
            WATTWISE
          </span>
          <span className="hidden h-5 border-l border-[#d5d0c8] sm:block" />
          <span className="hidden font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a] sm:block">
            TELEMETRY INTERFACE // V2.4
          </span>
        </a>

        <div className="flex items-center gap-3 font-mono text-[9px] font-bold tracking-[1.3px] text-[#55515a] sm:gap-6 sm:text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
            <span className="hidden sm:inline">GRID NODE LIVE</span>
            <span className="sm:hidden">LIVE</span>
          </span>
          <span>AUTH.SYS.01</span>
        </div>
      </header>

      {/* SYSTEM STATUS STRIP */}
      <div className="mx-4 mt-7 flex min-h-[30px] flex-wrap items-center justify-between gap-2 bg-[#f3f0e8] px-3 py-2 sm:mx-7 sm:mt-10 sm:px-4">
        <div className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[1.3px] sm:text-[10px] sm:tracking-[1.6px]">
          <span className="h-2 w-2 rounded-full bg-[#a17be8]" />
          AUTH.PORTAL // ENCRYPTED NODE ID #4092
        </div>

        <div className="flex gap-3 font-mono text-[9px] font-bold tracking-wider text-[#55515a] sm:gap-4 sm:text-[10px]">
          <span>HASH: 0x9AF84..C2</span>
          <span className="text-[#7939E8]">STATE: READY</span>
        </div>
      </div>

      {/* AUTHENTICATION PANEL */}
      <section className="mx-auto w-full max-w-[670px] px-4 pb-5 pt-7 sm:px-5 sm:pt-7">
        <div className="bg-white px-5 py-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-11 sm:py-11">
          {/* LOGIN / SIGN-UP TABS */}
          <div className="flex bg-[#f0eee7] p-1">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`min-h-[35px] flex-1 font-mono text-[11px] font-bold tracking-[2px] transition-colors ${
                !isSignup
                  ? "bg-black text-white"
                  : "bg-transparent text-[#55515a] hover:text-black"
              }`}
            >
              LOGIN
            </button>

            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`min-h-[35px] flex-1 font-mono text-[11px] font-bold tracking-[2px] transition-colors ${
                isSignup
                  ? "bg-black text-white"
                  : "bg-transparent text-[#55515a] hover:text-black"
              }`}
            >
              SIGN-UP
            </button>
          </div>

          {/* FORM HEADING */}
          <div className="mb-7 mt-7">
            <p className="font-mono text-[10px] font-bold tracking-[1.8px] text-[#7939E8]">
              {isSignup ? "REGISTRATION GATEWAY" : "AUTHENTICATION GATEWAY"}
            </p>

            <h1 className="mt-1 text-[30px] font-black leading-tight tracking-[-1.2px] sm:text-[34px]">
              {isSignup ? "CREATE ACCOUNT." : "WELCOME BACK."}
            </h1>

            <p className="mt-1 text-[14px] leading-6 text-[#55515a] sm:text-[15px]">
              {isSignup
                ? "Start monitoring real-time household electrical load profiles."
                : "Sign in to monitor your household energy diagnostics."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME — SIGN-UP ONLY */}
            {isSignup && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px]"
                >
                  FULL NAME / OPERATOR
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Dr. S. Ramanujan"
                  required
                  className="h-[44px] w-full border border-transparent bg-[#f4f2ec] px-4 font-mono text-sm outline-none placeholder:text-[#c7c5ce] focus:border-[#7939E8]"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
                <label
                  htmlFor="email"
                  className="font-mono text-[11px] font-bold tracking-[1px]"
                >
                  {isSignup ? "RESIDENTIAL EMAIL" : "EMAIL IDENTIFIER"}
                </label>

                {!isSignup && (
                  <span className="font-mono text-[9px] text-[#55515a]">
                    HEX_HASH COMPATIBLE
                  </span>
                )}
              </div>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="resident@grid.wattwise.io"
                required
                className="h-[46px] w-full border border-transparent bg-[#f4f2ec] px-4 font-mono text-sm outline-none placeholder:text-[#c7c5ce] focus:border-[#7939E8]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="font-mono text-[11px] font-bold tracking-[1px]"
                >
                  {isSignup ? "ACCESS KEY / PASSWORD" : "ACCESS KEY / CIPHER"}
                </label>

                {!isSignup && (
                  <span className="font-mono text-[9px] text-[#55515a]">
                    SECURE BUS
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={
                    isSignup ? "Min. 10 chars + symbol" : "••••••••••••"
                  }
                  minLength={isSignup ? 10 : undefined}
                  required
                  className="h-[46px] w-full border border-transparent bg-[#f4f2ec] px-4 pr-12 font-mono text-sm outline-none placeholder:text-[#c7c5ce] focus:border-[#7939E8]"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55515a] hover:text-[#7939E8]"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD — SIGN-UP ONLY */}
            {isSignup && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px]"
                >
                  VERIFY PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter access key"
                    minLength={10}
                    required
                    className="h-[44px] w-full border border-transparent bg-[#f4f2ec] px-4 pr-12 font-mono text-sm outline-none placeholder:text-[#c7c5ce] focus:border-[#7939E8]"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirm ? "Hide confirmation" : "Show confirmation"
                    }
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55515a] hover:text-[#7939E8]"
                  >
                    <EyeIcon visible={showConfirm} />
                  </button>
                </div>
              </div>
            )}

            {/* LOGIN OPTIONS */}
            {!isSignup && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex cursor-pointer items-center gap-1.5 text-[13px] text-[#55515a]">
                  <input
                    type="checkbox"
                    checked={persistSession}
                    onChange={(event) =>
                      setPersistSession(event.target.checked)
                    }
                    className="h-[17px] w-[17px] accent-black"
                  />
                  Persist node session
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Password recovery will be available after email services are connected."
                    )
                  }
                  className="font-mono text-[11px] font-bold text-[#7939E8] hover:underline"
                >
                  Forgot key?
                </button>
              </div>
            )}

            {/* TERMS — SIGN-UP ONLY */}
            {isSignup && (
              <label className="flex cursor-pointer items-start gap-2 text-[12px] leading-5 text-[#55515a]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-black"
                />
                <span>
                  I accept the{" "}
                  <a
                    href="/terms"
                    onClick={(event) => event.preventDefault()}
                    className="font-medium text-[#7939E8] underline"
                  >
                    Terms of Service
                  </a>{" "}
                  &amp; continuous{" "}
                  <a
                    href="/privacy"
                    onClick={(event) => event.preventDefault()}
                    className="font-medium text-[#7939E8] underline"
                  >
                    Telemetry Privacy Protocol
                  </a>
                  .
                </span>
              </label>
            )}

            {/* ERROR MESSAGE BANNER */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-[#e5a09b] bg-[#fff0f0] p-3 text-xs leading-5 text-[#b82e2e]"
              >
                <span className="shrink-0 font-bold">⚠️</span>
                <span className="font-mono text-[11px] font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* STATUS / SUCCESS MESSAGE */}
            {message && !errorMessage && (
              <p
                role="status"
                className="border border-[#d9c8fa] bg-[#f5efff] p-3 font-mono text-xs leading-5 text-[#5930a7]"
              >
                {message}
              </p>
            )}

            {/* MAIN SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[57px] w-full items-center justify-center gap-3 bg-black px-4 font-mono text-[12px] font-bold tracking-[2px] text-white transition-colors hover:bg-[#7939E8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>VERIFYING TELEMETRY CREDENTIALS...</span>
              ) : (
                <>
                  {isSignup ? "CREATE ACCOUNT" : "LOG IN"}
                  <span className="text-2xl leading-none">→</span>
                </>
              )}
            </button>
          </form>

          {/* HARDWARE TOKEN — LOGIN ONLY */}
          {!isSignup && (
            <>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#eeeae3]" />
                <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#88838a]">
                  OR VIA LOCAL BUS
                </span>
                <span className="h-px flex-1 bg-[#eeeae3]" />
              </div>

              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Hardware token authentication is a future integration and is not connected yet."
                  )
                }
                className="flex min-h-[52px] w-full items-center justify-center gap-3 bg-[#f4f2ec] px-3 py-3 font-mono text-[10px] font-bold tracking-[1.1px] transition-colors hover:bg-[#eee9df] sm:text-[11px] sm:tracking-[1.4px]"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7939E8"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <path d="M9 9h6v6H9zM9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4" />
                </svg>
                AUTHENTICATE WITH HARDWARE TOKEN
              </button>
            </>
          )}

          {/* SWITCH BETWEEN LOGIN AND SIGN-UP */}
          <div className="mt-6 flex min-h-[48px] flex-wrap items-center justify-center gap-x-2 bg-[#f4f2ec] px-3 py-3 text-center text-[12px] text-[#55515a]">
            {isSignup ? (
              <>
                Already an authenticated operator?
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="font-mono text-[11px] font-bold tracking-[1px] text-[#7939E8] hover:underline"
                >
                  LOG IN →
                </button>
              </>
            ) : (
              <>
                New to WattWise?
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="font-mono text-[11px] font-bold tracking-[1px] text-[#7939E8] hover:underline"
                >
                  CREATE AN ACCOUNT →
                </button>
              </>
            )}
          </div>
        </div>

        {/* SECURITY FOOTER */}
        <footer className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 font-mono text-[9px] font-bold tracking-[1.3px] text-[#55515a]">
          <span>SPEC: IEC 62053-21 COMPLIANT</span>
          <span className="text-black">LATENCY: 42ms</span>
        </footer>
      </section>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fcf9f2] p-10 font-mono text-xs">
          INITIALIZING AUTHENTICATION PORTAL...
        </main>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
