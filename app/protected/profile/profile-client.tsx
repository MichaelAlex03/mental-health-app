"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserProfile, UpdateProfileInput } from "@/app/schemas/profile";
import { updateProfile } from "./actions";
import { toast } from "sonner";

function getInitials(profile: UserProfile): string {
  const first = profile.first_name?.[0] ?? "";
  const last = profile.last_name?.[0] ?? "";
  if (first || last) return (first + last).toUpperCase();
  return profile.display_name[0]?.toUpperCase() ?? "?";
}

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`pointer-events-none block h-[18px] w-[18px] rounded-full bg-white shadow-md ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export function ProfileClient({ profile }: { profile: UserProfile }) {


  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [birthday, setBirthday] = useState(profile.birthday_date ?? "");
  const [isPublic, setIsPublic] = useState(profile.is_profile_public);
  const [avatarUrl, setAvatarsUrl] = useState(profile.avatar_url ?? null);
  const [imagePath, setImagePath] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string>("")

  const initials = getInitials(profile);

  const handleAvatarChange = (file: File | null) => {

    if (!file) return

    const maxAllowedSize = 5 * 1024 * 1024;
    if (file.size > maxAllowedSize) {
      setErrors("File is too big. Must be 5MB or smaller")
      return
    }

    const path = `${profile.user_id}/${file.name}`;

    setImagePath(path)
    setUploadedFile(file)
    setAvatarsUrl(URL.createObjectURL(file))
  }

  const handleCancel = () => {
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setDisplayName(profile.display_name);
    setBio(profile.bio ?? "");
    setBirthday(profile.birthday_date ?? "");
    setIsPublic(profile.is_profile_public);
    setAvatarsUrl(profile.avatar_url ?? null)
    setImagePath("")
    setUploadedFile(null)
    setEditing(false);
  };


  const handleSave = async () => {
    setSaving(true);

    const input: UpdateProfileInput = {
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      display_name: displayName.trim(),
      bio: bio.trim() || null,
      birthday_date: birthday || null,
      is_profile_public: isPublic,
      avatar_url: profile.avatar_url || null
    };

    const formData = new FormData();
    formData.set("input", JSON.stringify(input));
    if (uploadedFile && imagePath) {
      formData.set("avatar", uploadedFile);
      formData.set("filePath", imagePath);
    }

    const result = await updateProfile(formData);

    if (result.success) {
      toast.success("Profile updated");
      setEditing(false);
      setImagePath("")
      setUploadedFile(null)
    } else {
      toast.error(result.error ?? "Something went wrong");
      
    }

    setSaving(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-6 max-w-[640px]">
        {/* Avatar header */}
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8">
          <div className="relative group cursor-pointer">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback className="text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white text-[0.7rem] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <label htmlFor="fileSelector">
                Change
                <br />
                photo
                <input
                  type="file"
                  id="fileSelector"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
                />

              </label>
            </div>
          </div>
          <span className="text-xl font-semibold">{profile.display_name}</span>
        </div>

        {/* Edit form */}
        <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Edit Profile
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                First Name
              </Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Display Name
            </Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              className="min-h-20 resize-vertical"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Birthday</Label>
            <Input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>

          <div className="h-px bg-border" />

          {/* Public toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Public profile</span>
              <span className="text-xs text-muted-foreground">
                Allow others to see your profile
              </span>
            </div>
            <Toggle checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── View mode ──
  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center">
        <div className="relative group cursor-pointer">
          <Avatar className="h-24 w-24 text-2xl">
            <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <span className="text-xl font-semibold">{profile.display_name}</span>

        {profile.bio && (
          <p className="text-sm text-muted-foreground max-w-[420px] leading-relaxed">
            {profile.bio}
          </p>
        )}

        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          {profile.is_profile_public ? "Public profile" : "Private profile"}
        </span>
      </div>

      {/* Personal info card */}
      <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Information
          </span>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              First Name
            </span>
            <span className="text-sm">
              {profile.first_name || (
                <span className="italic text-muted-foreground">Not set</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Last Name
            </span>
            <span className="text-sm">
              {profile.last_name || (
                <span className="italic text-muted-foreground">Not set</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Display Name
          </span>
          <span className="text-sm">{profile.display_name}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Birthday
          </span>
          <span className="text-sm">
            {profile.birthday_date || (
              <span className="italic text-muted-foreground">Not set</span>
            )}
          </span>
        </div>

        <div className="h-px bg-border" />

        {/* Public toggle (read-only in view mode) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Public profile</span>
            <span className="text-xs text-muted-foreground">
              Allow others to see your profile
            </span>
          </div>
          <Toggle
            checked={profile.is_profile_public}
            onCheckedChange={() => setEditing(true)}
          />
        </div>
      </div>
    </div>
  );
}
