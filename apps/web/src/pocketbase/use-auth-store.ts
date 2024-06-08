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
        const { token } = await pb
          .collection("users")
          .authWithPassword(email, password);

        authStore = {
          ...authStore,
          token,
        } as BaseAuthStore;
      } catch (error) {
        console.error(error);
      }
    },
    loginWithProvider: async (provider: "google") => {
      try {
        const { meta, token, record } = await pb
          .collection("users")
          .authWithOAuth2({ provider });

        if (meta?.avatarUrl && !authStore.model?.avatar) {
          const formData = new FormData();

          const response = await fetch(meta.avatarUrl);

          if (response.ok) {
            const file = await response.blob();
            formData.append("avatar", file);
          }

          formData.append("name", meta.name);

          await pb.collection("users").update(record.id, formData);
        }

        authStore = {
          ...authStore,
          token,
        } as BaseAuthStore;
      } catch (error) {
        console.error(error);
      }
    },
    logout: () => {
      try {
        pb.authStore.clear();
      } catch (error) {
        console.error(error);
      }
    },
    subscribe: (listener: () => void) => {
      return pb.authStore.onChange((token, model) => {
        authStore = {
          ...authStore,
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

    const loginWithProvider = (provider: "google") => {
      setStatus("authenticating");

      pocketBaseAuth
        .loginWithProvider(provider)
        .then(() => {
          setStatus("authenticated");
        })
        .catch(() => {
          setStatus("unauthenticated");
        });
    };

    const logout = () => {
      pocketBaseAuth.logout();
      setStatus("unauthenticated");
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
