import { getProfile } from "./actions";
import { ProfileClient } from "./profile-client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getProfile();

  return <ProfileClient profile={profile} />;
}
