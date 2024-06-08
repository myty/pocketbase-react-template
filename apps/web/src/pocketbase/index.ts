import PocketBase from "pocketbase";
import { buildAuthStoreHook } from "./use-auth-store";

const pb = new PocketBase("/pb");
const useAuthStore = buildAuthStoreHook(pb);

export default pb;
export { useAuthStore };
