import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";

export const useConversationsStore = defineStore({
  id: "conversations-store",
  state: () => ({
    my_conversations_realtime: {
      channel: {},
      conversation: {},
    },
  }),

  actions: {
    getMyConversationsRealtime() {
      return this.my_conversations_realtime;
    },
    async suscribeToMyConversations(chat_user_id: number) {
      this.my_conversations_realtime.channel = supabase
        .channel(chat_user_id + "-conversations" + "-update")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_users_conversations",
            filter: `chat_user_id=eq.${chat_user_id}`,
          },
          async (event) => {
            let { data, error } = await supabase
              .from("conversations")
              .select(
                "*,last_message:messages(*),flag:chat_users_conversations(id),chat_users_conversations(*,chat_users(*))"
              )
              .eq("id", event.new.conversation_id)
              .is("messages.is_last", true)
              .eq("flag.chat_user_id", chat_user_id)
              .single();
            if (error) {
              throw "stop: error updating conversations order";
            }
            this.my_conversations_realtime.conversation = data;
          }
        )
        .subscribe();
    },
  },
});
