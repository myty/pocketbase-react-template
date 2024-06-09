import PocketBase from "pocketbase";
import { authStoreHookFactory } from "./auth-store/hook-factory";

const pb = new PocketBase("/pb");
const useAuthStore = authStoreHookFactory(pb);

export default pb;
export { useAuthStore };
