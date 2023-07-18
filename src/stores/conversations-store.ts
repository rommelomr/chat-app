import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import Utils from "@/utils/Utils";
import { IResponse } from "@/logic/interfaces/IResponse";

export const useConversationsStore = defineStore({
  id: "conversations-store",
  state: () => ({
    my_conversations_realtime: {
      channel: {},
      conversation: {},
      new_conversation: {},
    },
    current_conversation: useStorage("current-conversation", {
      id: 0,
      type: "SINGLE",
      label: "xxx",
      label_image: "https://i.pravatar.cc/300",
      userConversation: undefined,
      isEmpty: true,
      group: undefined,
      me: 0,
      me_uuid: "_",
    }),
  }),

  actions: {
    getMyConversationsRealtime() {
      return this.my_conversations_realtime;
    },
    async suscribeToNewConversation(
      partner_chat_user_id: number,
      current_chat_user_id: number
    ) {
      let _private_conversation_code =
        partner_chat_user_id + "" + current_chat_user_id;
      this.my_conversations_realtime.channel = supabase
        .channel(_private_conversation_code + "-new-conversations")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "private_conversations",
            filter: `chat_user_ids=eq.${_private_conversation_code}`,
          },
          async (event) => {
            this.my_conversations_realtime.new_conversation = event.new;
          }
        )
        .subscribe();
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
                "*,last_message:messages(*),flag:chat_users_conversations(id),chat_users_conversations(*,chat_users(*,person:people(*)))"
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
    async getConversationWithChatUser(
      chat_user_id: number
    ): Promise<IResponse> {
      let { data, error } = await supabase.rpc(
        "get_conversation_with_chat_user",
        {
          partnerchatuserid: chat_user_id,
        }
      );
      Utils.handleErrors(error);
      return {
        status: 200,
        action: "GET_CONVERSATION_WITH_CHAT_USER",
        message: "Conversation data loaded",
        entity: "AUTH.USERS",
        data,
      };
    },
    setCurrentConversation(conversations_data: any) {
      this.current_conversation = {
        id: conversations_data.id,
        type: conversations_data.type,
        label: conversations_data.label,
        label_image: conversations_data.label_image,
        userConversation: conversations_data.userConversation,
        isEmpty: conversations_data.isEmpty,
        group: conversations_data.group,
        me: conversations_data.me,
        me_uuid: conversations_data.me_uuid,
      };
    },
    resetCurrentConverstion() {
      this.setCurrentConversation({
        id: 0,
        type: "SINGLE",
        label: "xxx",
        label_image: "https://i.pravatar.cc/300",
        userConversation: undefined,
        isEmpty: true,
        group: undefined,
        me: 0,
        me_uuid: "_",
      });
    },
  },
});
