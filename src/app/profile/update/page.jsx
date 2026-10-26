import { redirect } from "next/navigation";
import { ProfileUpdateForm } from "@/components/profile-update-form";
import { getServerSession } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export default async function UpdateProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/signin?notice=login-required");
  return <ProfileUpdateForm initialName={session.user.name || ""} />;
}
