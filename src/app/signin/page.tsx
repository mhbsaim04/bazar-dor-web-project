import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return <Suspense fallback={<main className="auth-loading">
    <div className="auth-loading-card">
        <span className="button-spinner" /> পেজ লোড হচ্ছে...</div></main>}>
        <AuthForm mode="signin" /></Suspense>;
}
