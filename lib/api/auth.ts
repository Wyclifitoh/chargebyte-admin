import { API_BASE_URL } from './config';
import { fetchWithAuth } from './fetchWithAuth'; 

export async function registerUser(payload: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }

  return res.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to refresh token');
  }

  return res.json();
}

export async function verifyEmailOTP(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Verification failed');
  }

  return res.json();
}

export async function verifyLoginOTP(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-login-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Verification failed');
  }

  return res.json();
}

export async function resendEmailOTP(userId: string) {
  const res = await fetch(`${API_BASE_URL}/auth/resend-email-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to resend OTP');
  }

  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send reset email');
  }

  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to reset password');
  }

  return res.json();
}

export async function updatePassword(current_password: string, new_password: string, confirm_password: string) {
  const res = await fetchWithAuth(`/auth/update-password`, {
    method: 'PUT', 
    body: JSON.stringify({ current_password, new_password, confirm_password }),
  }); 

  return res;
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();


}

export async function sendPasswordResetEmail(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send reset email');
  }

  return res.json();
}

