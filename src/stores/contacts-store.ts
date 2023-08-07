import { defineStore } from "pinia";
import { type Auth } from "@/logic/interfaces/users/users-interfaces";
import AuthServices from "@/services/supabase/auth-services";
import { Paginator } from "@/logic/interfaces/iPaginator";
import { supabase } from "@/utils/SupabaseClient";
import { useAuthStore } from "./auth.store";
import Utils from "@/utils/Utils";
import { IResponse } from "@/logic/interfaces/IResponse";
export const useContactsStore = defineStore({
  id: "contacts-store",
  state: () =>
    ({
      contacts_paginator: {
        items_per_page: 0,
        current_page: 0,
        total_pages: 0,
        total_items: 0,
      },
    } as { contacts_paginator: Paginator }),
  actions: {
    async fetchContacts(chat_user_id: number) {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("contacts")
        .select("*,chat_user:contact_id(*,person:people(*))")
        .eq("chat_user_id", auth_store.getUser().chat_user_id);

      Utils.handleErrors(error);
      return {
        status: 1,
        action: "FETCH_CONTACTS",
        entity: "CONTACTS",
        message: "contacts obtained successfuly",
        data,
      } as IResponse;
    },
    async findContactById(contact_id: number) {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("chat_user_id", auth_store.getUser().chat_user_id)
        .eq("contact_id", contact_id)
        .select("*");
      Utils.handleErrors(error);
      return {
        message: "Contact search",
        status: 1,
        entity: "CONTACTS",
        action: "FIND_CONTACT_BY_ID",
        data,
      } as IResponse;
    },
    async addContact(contact_id: number, nickname?: string) {
      let store_response = await this.findContactById(contact_id);
      if (store_response.data.length > 0)
        return {
          message: "Contact already added",
          status: 2,
          entity: "CONTACTS",
          action: "ADD_CONTACTS",
        } as IResponse;
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("contacts")
        .insert({
          chat_user_id: auth_store.getUser().chat_user_id,
          contact_id: contact_id,
          nickname,
        })
        .select("*")
        .single();
      Utils.handleErrors(error);
      return {
        message: "Contact added successfuly",
        status: 1,
        entity: "CONTACTS",
        action: "ADD_CONTACTS",
        data,
      } as IResponse;
    },
  },
});
