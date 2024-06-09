import { BaseAuthStore } from "pocketbase";

export type AuthStore = Omit<
  BaseAuthStore,
  "onChange" | "save" | "clear" | "loadFromCookie" | "exportToCookie"
>;

export const AuthProviders = {
  Email: "email",
  Google: "google",
  GitHub: "github",
  Microsoft: "microsoft",
} as const;

export type AuthProvider = (typeof AuthProviders)[keyof typeof AuthProviders];
