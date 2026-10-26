"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";
type SocialProvider = "google" | "github";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  useEffect(() => {
    if (mode === "signin" && searchParams.get("notice") === "login-required") {
      toast("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।", { icon: "🔐" });
    }
  }, [mode, searchParams]);

  async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const result = await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
        if (result.error) {
          toast.error(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
          return;
        }
        toast.success("স্বাগতম! সফলভাবে সাইন ইন হয়েছে।");
        router.push("/");
        router.refresh();
      } else {
        const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: "/" });
        if (result.error) {
          toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
          return;
        }
        
        await authClient.signOut();
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
        router.push("/signin");
      }
    } catch {
      toast.error("Error! আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSocialSignIn(provider: SocialProvider) {
    setSocialLoading(provider);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL: "/" });
      if (result.error) toast.error(result.error.message || `${provider} দিয়ে সাইন ইন করা যায়নি।`);
    } catch {
      toast.error("সোশ্যাল সাইন ইন শুরু করা যায়নি। OAuth সেটিংস পরীক্ষা করুন।");
    } finally {
      setSocialLoading(null);
    }
  }

  const isSignIn = mode === "signin";

  return (
    <main className="auth-layout">
      <section className="auth-visual-panel">
        <Link href="/" className="auth-brand"><span className="brand-mark">🛒</span><span>বাজার দর<span className="brand-dot">।</span></span></Link>
        <div className="auth-visual-content">
          <span className="auth-visual-eyebrow">আপনার বাজার, আপনার নিয়ন্ত্রণে</span>
          <h1>সচেতন বাজারের<br /><span>শুরু হোক এখানেই।</span></h1>
          <p>এক নজরে নিত্যপণ্যের দাম দেখুন, বাজারের তুলনা করুন, আর সিদ্ধান্ত নিন আত্মবিশ্বাসের সঙ্গে।</p>
          <div className="auth-visual-products"><span>🍚</span><span>🥬</span><span>🧅</span><span>🐟</span><span>🥚</span></div>
          <div className="auth-visual-footnote"><span>✳</span> প্রতিদিনের দর, সহজে ও নির্ভরযোগ্যভাবে</div>
        </div>
        <div className="auth-panel-footer">© বাজার দর · বাংলাদেশের নিত্যপণ্যের বাজারদর</div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-top"><Link href="/" className="back-home-link">← হোম পেজে ফিরুন</Link><span className="secure-label"><span>●</span> নিরাপদ অ্যাকাউন্ট</span></div>
        <div className="auth-form-box">
          <div className="auth-form-heading"><span className="auth-icon-circle">{isSignIn ? "↗" : "✳"}</span><p className="section-eyebrow">{isSignIn ? "আবার স্বাগতম" : "আজই শুরু করুন"}</p><h2>{isSignIn ? "আপনার অ্যাকাউন্টে সাইন ইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}</h2><p>{isSignIn ? "আপনার বাজারদর ও পছন্দের তথ্য দেখতে সাইন ইন করুন।" : "বাজারের তথ্য পেতে কয়েক মুহূর্তে অ্যাকাউন্ট তৈরি করুন।"}</p></div>
          <form className="auth-form" onSubmit={onSubmit}>
            {!isSignIn ? <label className="form-field"><span>আপনার নাম</span><input type="text" name="name" placeholder="যেমন: সাইম ভুঁইয়া" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label> : null}
            <label className="form-field"><span>ইমেইল ঠিকানা</span><input type="email" name="email" placeholder="name@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label className="form-field"><span>পাসওয়ার্ড</span><input type="password" name="password" placeholder="কমপক্ষে ৮ অক্ষর" autoComplete={isSignIn ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>{submitting ? <><span className="button-spinner" /> প্রক্রিয়াধীন...</> : isSignIn ? "সাইন ইন করুন ↗" : "অ্যাকাউন্ট তৈরি করুন ↗"}</button>
          </form>
          <div className="auth-divider"><span />অথবা<span /></div>
          <div className="social-login-grid">
            <button type="button" className="social-login-button" onClick={() => onSocialSignIn("google")} disabled={socialLoading !== null}><span className="google-mark">G</span>{socialLoading === "google" ? "সংযোগ হচ্ছে..." : "Google"}</button>
            <button type="button" className="social-login-button" onClick={() => onSocialSignIn("github")} disabled={socialLoading !== null}><span className="github-mark">⌘</span>{socialLoading === "github" ? "সংযোগ হচ্ছে..." : "GitHub"}</button>
          </div>
          <p className="auth-switch-text">{isSignIn ? "আপনার অ্যাকাউন্ট নেই?" : "আগেই অ্যাকাউন্ট আছে?"} <Link href={isSignIn ? "/signup" : "/signin"}>{isSignIn ? "সাইন আপ করুন" : "সাইন ইন করুন"}</Link></p>
          <p className="auth-terms">চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের ব্যবহারবিধিতে সম্মত হচ্ছেন।</p>
        </div>
      </section>
    </main>
  );
}
