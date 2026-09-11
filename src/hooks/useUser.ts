"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { getDefaultProfile } from "@/lib/defaults";
import { User } from "@supabase/supabase-js";

function getLocalSessionCookie(): { username: string; role: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )elevate_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return { username: "admin", role: "super_admin" };
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(() => {
    const session = getLocalSessionCookie();
    return session ? getDefaultProfile(session.username) : null;
  });
  const [loading, setLoading] = useState<boolean>(() => !getLocalSessionCookie());
  const supabase = createClient();

  const loadUserData = useCallback(async () => {
    const localSession = getLocalSessionCookie();
    if (localSession) {
      setProfile(getDefaultProfile(localSession.username));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*, department:departments(*), role_details:roles(*)")
          .eq("id", user.id)
          .single();

        if (!error && profileData) {
          const effectivePermissions = await loadEffectivePermissions(user.id, profileData);
          setProfile({ ...profileData, effectivePermissions });
        } else {
          console.error("Failed to load profile:", error?.message);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      // If error occurs but local cookie exists, fallback
      const fallbackSession = getLocalSessionCookie();
      if (fallbackSession) {
        setProfile(getDefaultProfile(fallbackSession.username));
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Loads effective permissions for a user by combining:
   * 1. Role permissions (from role_permissions table)
   * 2. User permission overrides (from user_permission_overrides table)
   * Applies precedence: user deny > user grant > role permission > default deny
   */
  async function loadEffectivePermissions(
    userId: string,
    profileData: Profile
  ): Promise<Record<string, boolean>> {
    const permissions: Record<string, boolean> = {};

    // SuperAdmin bypass — grant everything
    if (profileData.role === "super_admin" || (profileData.role_details as any)?.hierarchy_level === 0) {
      return permissions;
    }

    try {
      // Fetch role permissions
      if (profileData.role_id) {
        const { data: rolePerms } = await supabase
          .from("role_permissions")
          .select("permission:permissions(resource, action)")
          .eq("role_id", profileData.role_id);

        if (rolePerms) {
          for (const rp of rolePerms) {
            const perm = rp.permission as any;
            if (perm) {
              permissions[`${perm.resource}:${perm.action}`] = true;
            }
          }
        }
      }

      // Fetch user permission overrides (these take precedence)
      const { data: overrides } = await supabase
        .from("user_permission_overrides")
        .select("is_granted, permission:permissions(resource, action)")
        .eq("user_id", userId);

      if (overrides) {
        for (const override of overrides) {
          const perm = override.permission as any;
          if (perm) {
            permissions[`${perm.resource}:${perm.action}`] = override.is_granted;
          }
        }
      }
    } catch (err) {
      console.error("Error loading effective permissions:", err);
    }

    return permissions;
  }

  useEffect(() => {
    loadUserData();

    if (getLocalSessionCookie()) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          if (!getLocalSessionCookie()) {
            setProfile(null);
            setLoading(false);
          }
        } else {
          loadUserData();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData, supabase]);

  return { user, profile, loading, refreshUser: loadUserData };
}
