"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileUpdateForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanedName = name.trim();
    if (cleanedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }
    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: cleanedName });
      if (result.error) {
        toast.error(result.error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }
      toast.success("আপনার তথ্য আপডেট হয়েছে।");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেটের সময় সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  return <main className="container route-main profile-edit-page"><div className="breadcrumbs"><Link href="/">হোম</Link><span>/</span><Link href="/profile">আমার প্রোফাইল</Link><span>/</span><span>তথ্য আপডেট</span></div><section className="profile-form-card"><div className="profile-form-icon">✎</div><p className="section-eyebrow">প্রোফাইল সেটিংস</p><h1>ব্যক্তিগত তথ্য আপডেট</h1><p className="profile-form-description">আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।</p><form onSubmit={onSubmit} className="auth-form"><label className="form-field"><span>আপনার নাম</span><input name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="আপনার পূর্ণ নাম" minLength={2} required /></label><div className="profile-form-actions"><Link href="/profile" className="button button-outline">বাতিল</Link><button type="submit" className="button button-primary" disabled={saving}>{saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন ↗"}</button></div></form></section></main>;
}
