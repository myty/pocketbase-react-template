import { useState, useSyncExternalStore } from "react";
import PocketBase from "pocketbase";
import { buildAuthStore } from "./build";
import { AuthProvider, AuthStore } from "./types";

export const AuthStoreStatuses = {
  Authenticating: "authenticating",
  Authenticated: "authenticated",
  Unauthenticated: "unauthenticated",
} as const;

export type AuthStoreStatus =
  (typeof AuthStoreStatuses)[keyof typeof AuthStoreStatuses];

interface AuthStoreHook {
  /**
   * The current status of the auth store.
   */
  status: AuthStoreStatus;

  /**
   * The auth store.
   */
  authStore: AuthStore;

  /**
   * Logs in with an email and password.
   */
  login: (email: string, password: string) => void;

  /**
   * Logs in with a provider.
   */
  loginWithProvider: (provider: Exclude<AuthProvider, "email">) => void;

  /**
   * Logs out.
   */
  logout: () => void;
}

export function authStoreHookFactory(pb: PocketBase) {
  const pocketBaseAuth = buildAuthStore(pb);

  /**
   * A hook for interacting with the auth store.
   */
  function useAuthStore(): AuthStoreHook {
    const authStore = useSyncExternalStore(
      pocketBaseAuth.subscribe,
      pocketBaseAuth.getSnapshot
    );

    const [status, setStatus] = useState<AuthStoreStatus>(
      authStore.isValid
        ? AuthStoreStatuses.Authenticated
        : AuthStoreStatuses.Unauthenticated
    );

    const handleLogin = (loginPromise: Promise<void>) => {
      setStatus(AuthStoreStatuses.Authenticating);

      loginPromise
        .then(() => {
          setStatus(AuthStoreStatuses.Authenticated);
        })
        .catch(() => {
          setStatus(AuthStoreStatuses.Unauthenticated);
        });
    };

    const login = (email: string, password: string) =>
      handleLogin(pocketBaseAuth.login(email, password));

    const loginWithProvider = (provider: Exclude<AuthProvider, "email">) =>
      handleLogin(pocketBaseAuth.loginWithProvider(provider));

    const logout = () => {
      pocketBaseAuth.logout();
      setStatus(AuthStoreStatuses.Unauthenticated);
    };

    return {
      status,
      authStore,
      login,
      loginWithProvider,
      logout,
    };
  }

  return useAuthStore;
}
