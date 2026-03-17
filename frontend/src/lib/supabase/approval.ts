import type { User } from "@supabase/supabase-js";

type Metadata = Record<string, unknown> | null | undefined;

const readRole = (meta: Metadata) => {
  const role = meta?.role;
  return typeof role === "string" ? role.toLowerCase() : "";
};

export const isUserAdmin = (user?: User | null) => {
  if (!user) return false;
  const role =
    readRole(user.app_metadata as Metadata) ||
    readRole(user.user_metadata as Metadata);
  return role === "admin" || role === "super_admin";
};

export const isUserApproved = (user?: User | null) => {
  if (!user) return false;

  const approvedFlag = (user.user_metadata as Metadata)?.approved;
  if (approvedFlag === true || approvedFlag === "true") return true;

  const role =
    readRole(user.app_metadata as Metadata) ||
    readRole(user.user_metadata as Metadata);

  return role === "admin" || role === "super_admin" || role === "instructor";
};
