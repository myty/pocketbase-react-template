import { BaseAuthStore } from "pocketbase";
import { User } from "../models/user";

export type AuthStore = Omit<
  BaseAuthStore,
  "onChange" | "save" | "clear" | "loadFromCookie" | "exportToCookie"
> & {
  model: User;
};

export const AuthProviders = {
  Email: "email",
  Google: "google",
  GitHub: "github",
  Microsoft: "microsoft",
} as const;

export type AuthProvider = (typeof AuthProviders)[keyof typeof AuthProviders];
