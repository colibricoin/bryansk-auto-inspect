import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "admin_session_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(login: string, password: string) {
  const { data, error } = await supabase.functions.invoke("admin-auth", {
    body: { action: "login", login, password },
  });
  if (error) throw new Error("Ошибка сервера");
  if (data.error) throw new Error(data.error);
  setAdminToken(data.token);
  return { usingDefault: data.usingDefault };
}

export async function verifyAdminSession(): Promise<{ valid: boolean; usingDefault: boolean }> {
  const token = getAdminToken();
  if (!token) return { valid: false, usingDefault: false };

  try {
    const { data, error } = await supabase.functions.invoke("admin-auth", {
      body: { action: "verify", token },
    });
    if (error || data.error) return { valid: false, usingDefault: false };
    return { valid: true, usingDefault: data.usingDefault };
  } catch {
    return { valid: false, usingDefault: false };
  }
}

export async function adminApi(action: string, params: Record<string, unknown> = {}) {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("admin-bookings", {
    body: { action, token, ...params },
  });
  if (error) throw new Error("Ошибка сервера");
  if (data.error) throw new Error(data.error);
  return data.data;
}

export const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  confirmed: "Подтверждена",
  completed: "Завершена",
  canceled: "Отменена",
};

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-600",
  canceled: "bg-red-100 text-red-700",
};

export const SOURCE_LABELS: Record<string, string> = {
  online_booking: "Онлайн-запись",
  contact: "Контакты",
  legal_entity: "Юр. лица",
};
