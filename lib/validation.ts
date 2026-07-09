const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PK_PHONE_REGEX = /^03\d{2}[-\s]?\d{7}$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email.trim())) return "Enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | null {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Phone number is required";
  const normalized = phone.replace(/\s/g, "");
  if (!PK_PHONE_REGEX.test(normalized)) {
    return "Enter a valid Pakistani number (e.g. 0300-1234567)";
  }
  return null;
}

export function validateAddress(address: string): string | null {
  if (!address.trim()) return "Address is required";
  if (address.trim().length < 10) return "Please enter a complete address";
  return null;
}

export function validateCity(city: string): string | null {
  if (!city.trim()) return "City is required";
  return null;
}
