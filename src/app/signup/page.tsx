import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return <Suspense fallback={<main className="auth-loading"><div className="auth-loading-card"><span className="button-spinner" /> পেজ লোড হচ্ছে...</div></main>}><AuthForm mode="signup" /></Suspense>;
}
