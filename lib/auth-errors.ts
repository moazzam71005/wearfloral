/** Map Supabase / auth / RLS errors to clear customer-facing messages. */
export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("email not confirmed") ||
    lower.includes("email_not_confirmed") ||
    lower.includes("confirm your email")
  ) {
    return "Please verify your email first. Open the confirmation link we sent to your inbox, then sign in again.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (
    lower.includes("row-level security") ||
    lower.includes("rls") ||
    lower.includes("permission denied") ||
    lower.includes("not authorized") ||
    lower.includes("jwt")
  ) {
    return "Your account must be verified to checkout. Please confirm your email, then sign in again.";
  }

  return message || "Something went wrong. Please try again.";
}

export function isEmailVerified(user: { email_confirmed_at?: string | null } | null): boolean {
  return Boolean(user?.email_confirmed_at);
}
