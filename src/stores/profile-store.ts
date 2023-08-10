import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import ProfileServices from "@/services/supabase/profile-services";
import { useAuthStore } from "./auth.store";
import Utils from "@/utils/Utils";
export const useProfileStore = defineStore({
  id: "profile-store",
  state: () => ({}),

  actions: {
    async getProfile(): any {
      const auth_store = useAuthStore();
      let response = await ProfileServices.getProfile(auth_store.getUser().id);

      const { data: file_data, error: file_error } = await supabase.storage
        .from("profile-images")
        .createSignedUrl(auth_store.user_data.photo + ".png", 30);
      Utils.handleErrors(file_error);
      return { ...response.data, ...file_data };
    },
    async updateProfile(profile_data: any): Promise<any> {
      const auth_store = useAuthStore();
      let response = await ProfileServices.updateProfile(
        auth_store.getUser().id,
        profile_data
      );
      return response.data;
    },
    async updateProfileImage(number: any): Promise<any> {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("people")
        .update({
          photo: number,
        })
        .eq("auth_id", auth_store.user_data.auth_id);
      auth_store.user_data.photo = number;
      Utils.handleErrors(error);
    },
    async updatePassword(
      current_password: string,
      password: string
    ): Promise<any> {
      let response = await ProfileServices.updatePassword(
        current_password,
        password
      );
      return response.data;
    },
  },
});
