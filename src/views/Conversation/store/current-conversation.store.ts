import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import {
  IChatGroup,
  IPersonConversationFinder,
  IUserConversationFinder,
} from "../interfaces";
import { useConversationsStore } from "@/stores/conversations-store";
import { useAuthStore } from "@/stores/auth.store";

export interface IMe {
  id: number;
  me_id: string;
}

export interface ICurrentConversation {
  id: number;
  type: string;
  label: string;
  contact_id: number;
  label_image: string;
  userConversation?: IUserConversationFinder;
  isEmpty: boolean;
  group?: IChatGroup;
  me: number;
  me_uuid: string;
}
export const useCurrentConversation = defineStore({
  id: "current-conversation",
  state: () => ({
    current_conversation: useStorage("current-conversation", {
      id: 0,
      type: "SINGLE",
      label: "xxx",
      label_image: "https://i.pravatar.cc/300",
      userConversation: {},
      isEmpty: true,
      contact_id: 0,
      group: false,
      me: 0,
      me_uuid: "_",
    }),
  }),

  actions: {
    ////////SETTERS///////
    async setCurrentConversation(conversation: ICurrentConversation) {
      let _me: IMe | undefined = await this.getMe();
      //@ts-ignore
      this.$patch({
        current_conversation: {
          id: conversation.id,
          type: conversation.type,
          contact_id: conversation.contact_id,
          label_image: conversation.label_image ?? "https://i.pravatar.cc/300",
          label: conversation.label,
          userConversation: conversation.userConversation
            ? conversation.userConversation
            : undefined,
          groups: conversation.group ? conversation.group : undefined,
          isEmpty: conversation.isEmpty,
          me: _me?.id ?? 0,
          me_uuid: _me?.me_id ?? "",
        },
      });
    },
    setIdConversation(id: number) {
      this.$patch({
        current_conversation: {
          id: id,
          isEmpty: false,
        },
      });
    },
    async reset() {
      //@ts-ignore
      this.$patch({
        current_conversation: {
          id: 0,
          type: "SINGLE",
          label_image: "https://i.pravatar.cc/300",
          label: "Loading..",
          isEmpty: true,
          me: 0,
          me_uuid: "",
        },
      });
    },
    getCurrentConversation(): ICurrentConversation {
      return this.current_conversation;
    },
    async getMe(): Promise<IMe | undefined> {
      try {
        let { data, error } = await supabase.rpc(
          "get_all_current_chat_user_info"
        );
        return {
          id: data.id ?? 0,
          me_id: data.person.user.auth_id,
        };
      } catch {
        return {
          id: 0,
          me_id: "__",
        };
      }
    },
    async suscribeToDetectSeen() {
      let _conversation_id = this.getCurrentConversation().id;
      const conversation_store = useConversationsStore();
      const auth_store = useAuthStore();
      let _private_conversation_code =
        _conversation_id + ";" + auth_store.getUser().chat_user_id;
      conversation_store.my_conversations_realtime.channels.detect_seen =
        supabase
          .channel(_private_conversation_code + "-seen-messages")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "messages",
              filter: `seen_flag=eq.${_private_conversation_code};1`,
            },
            async (event) => {
              console.log("visto detectado");
              conversation_store.my_conversations_realtime.seen_message_detected =
                event.new;
              //this.my_conversations_realtime.new_conversation = event.new;
              // const local_notifications = useLocalNotificationsStore();
              // local_notifications.display({
              //   title: "Tienes una nueva conversación",
              //   content: "¡Abrela ahora!",
              // });
            }
          )
          .subscribe();
    },
    ////////GETTERS///////
  },
});
