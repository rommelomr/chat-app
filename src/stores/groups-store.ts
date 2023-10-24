import { defineStore } from "pinia";
import { supabase } from "@/utils/SupabaseClient";
import Utils from "@/utils/Utils";

export const useGroupsStore = defineStore({
  id: "groups-store",
  state: () => ({}),

  actions: {
    async fetchContactsOf(chat_user: any) {
      let { data, error } = await supabase
        .from("contacts")
        .select(
          "*,chat_user:chat_users!contacts_contact_id_fkey(*,person:people(*,user:users(*)),contacts!inner!contacts_contact_id_fkey(*))"
        )
        .eq("chat_user_id", chat_user.id);
      Utils.handleErrors(error);

      return {
        data,
      };
    },
  },
});
