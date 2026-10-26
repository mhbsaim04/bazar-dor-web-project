import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/server-auth";
import { formatBanglaNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin?notice=login-required");
  const name = session.user.name || "ব্যবহারকারী";
  return <main className="container route-main profile-page"><div className="breadcrumbs"><Link href="/">হোম</Link><span>/</span><span>আমার প্রোফাইল</span></div><section className="profile-overview-card"><div className="profile-cover" /><div className="profile-avatar-large">{name.slice(0, 1)}</div><div className="profile-overview-body"><p className="section-eyebrow">আপনার অ্যাকাউন্ট</p><h1>{name}</h1><p>{session.user.email}</p><span className="profile-verified-pill"><span /> অ্যাকাউন্ট সক্রিয়</span></div><Link href="/profile/update" className="button button-primary">তথ্য আপডেট করুন</Link></section><section className="profile-info-grid"><div className="profile-info-card"><span className="profile-info-icon">♙</span><span>নাম</span><strong>{name}</strong></div><div className="profile-info-card"><span className="profile-info-icon">✉</span><span>ইমেইল</span><strong>{session.user.email}</strong></div><div className="profile-info-card"><span className="profile-info-icon">⌂</span><span>সেবা</span><strong>বাজার দর</strong></div></section><div className="profile-help-note"><span>ⓘ</span><p>আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে “তথ্য আপডেট করুন” বাটনে ক্লিক করুন।</p></div><div className="profile-bottom-link"><Link href="/">← বাজারদরে ফিরে যান</Link><span>{formatBanglaNumber(1, 0)}টি অ্যাকাউন্ট</span></div></main>;
}