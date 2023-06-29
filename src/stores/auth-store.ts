import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import jwt_decode from "jwt-decode";
import { supabase } from "@/utils/SupabaseClient";

export const useAuthStore = defineStore({
  id: "register-store",
  state: () => ({
    user: useStorage("auth", {
      id: "",
      token: "",
      refresh_token: "",
      is_logged: false,
      expiration: "",
      role: "",
      email: "",
      photo: "",
      name: "",
    }),
    user_data: {},
    role: {},
  }),

  actions: {
    async attemptRegister(form) {
      let response = await LoginService.attemptRegister(form);
      console.log(response);
    },
  },
});
