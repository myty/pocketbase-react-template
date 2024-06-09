import PocketBase from "pocketbase";
import { AuthProvider, AuthStore } from "./types";

export function buildAuthStore(pb: PocketBase) {
  const { token, model, isValid, isAdmin, isAuthRecord } = pb.authStore;

  let authStore: AuthStore = {
    token,
    model,
    isValid,
    isAdmin,
    isAuthRecord,
  };

  return {
    login: async (email: string, password: string) => {
      try {
        const { token } = await pb
          .collection("users")
          .authWithPassword(email, password);

        authStore = {
          ...authStore,
          token,
        };
      } catch (error) {
        console.error(error);
      }
    },

    loginWithProvider: async (provider: AuthProvider) => {
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
        };
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
        };

        listener();
      });
    },

    getSnapshot() {
      return authStore;
    },
  };
}
