import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import Utils from "@/utils/Utils";
import { Device } from "@capacitor/device";
import { supabase } from "@/utils/SupabaseClient";
import { useAuthStore } from "./auth.store";
export const useAccountStore = defineStore({
  id: "account-store",
  state: () => ({
    created_user: {},
    id_machine: useStorage("id_machine", ""),
    imei: "",
    brand: "",
    model: "",
    os: "",
    os_version: "",
  }),
  actions: {
    async updateAccount(account_data: any) {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("accounts")
        .update(account_data)
        .eq("chat_user_id", auth_store.getUser().chat_user_id)
        .select("*");

      Utils.handleErrors(error);
      return {
        data,
      };
    },

    async getAccountBy(field: string, value: any) {
      let { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq(field, value)
        .select("*")
        .single();

      Utils.handleErrors(error);
      return {
        data,
      };
    },

    async resetPassword(password: string) {
      const { data, error } = await supabase.auth.updateUser({ password });
      Utils.handleErrors(error);
      return { data };
    },
  },
});
