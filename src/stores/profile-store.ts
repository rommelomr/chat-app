import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import ProfileServices from "@/services/supabase/profile-services";
import { useAuthStore } from "./auth.store";
export const useProfileStore = defineStore({
  id: "profile-store",
  state: () => ({}),

  actions: {
    async getProfile(): any {
      const auth_store = useAuthStore();
      let response = await ProfileServices.getProfile(auth_store.getUser().id);
      return response.data;
    },
    async updateProfile(profile_data: any): any {
      const auth_store = useAuthStore();
      let response = await ProfileServices.updateProfile(
        auth_store.getUser().id,
        profile_data
      );
      return response.data;
    },
  },
});
