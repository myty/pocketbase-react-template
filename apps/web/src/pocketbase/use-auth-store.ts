import { useState, useSyncExternalStore } from "react";
import PocketBase, { BaseAuthStore } from "pocketbase";

function createExternalPocketBaseAuthStore(pb: PocketBase) {
  let authStore = {
    token: pb.authStore.token,
    model: pb.authStore.model,
    isValid: pb.authStore.isValid,
    isAdmin: pb.authStore.isAdmin,
  } as BaseAuthStore;

  return {
    login: async (email: string, password: string) => {
      try {
        await pb.collection("users").authWithPassword(email, password);
      } catch (error) {
        console.error(error);
      }
    },
    logout: async () => {
      try {
        pb.authStore.clear();
      } catch (error) {
        console.error(error);
      }
    },
    subscribe: (listener: () => void) => {
      return pb.authStore.onChange((token, model) => {
        authStore = {
          token,
          model,
          isValid: pb.authStore.isValid,
          isAdmin: pb.authStore.isAdmin,
        } as BaseAuthStore;
        listener();
      });
    },
    getSnapshot() {
      return authStore;
    },
  };
}

export function buildAuthStoreHook(pb: PocketBase) {
  const pocketBaseAuth = createExternalPocketBaseAuthStore(pb);

  function useAuthStore() {
    const authStore = useSyncExternalStore(
      pocketBaseAuth.subscribe,
      pocketBaseAuth.getSnapshot
    );

    const [status, setStatus] = useState<
      "authenticating" | "authenticated" | "unauthenticated"
    >(authStore.isValid ? "authenticated" : "unauthenticated");

    const login = (email: string, password: string) => {
      setStatus("authenticating");

      pocketBaseAuth
        .login(email, password)
        .then(() => {
          setStatus("authenticated");
        })
        .catch(() => {
          setStatus("unauthenticated");
        });
    };

    return {
      status,
      authStore,
      login,
      logout: pocketBaseAuth.logout,
    };
  }

  return useAuthStore;
}
