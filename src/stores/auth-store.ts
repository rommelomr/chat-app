import { defineStore } from "pinia";
import { type Auth } from "@/logic/interfaces/users/users-interfaces";
import AuthServices from "@/services/supabase/auth-services";
export const useConnectionsStore = defineStore({
  id: "connections-store",
  state: () =>
    ({
      auth: {}, 
    } as { auth: Auth }),
  actions: {
    async attemptLogin() {},
  },
});
