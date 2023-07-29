import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { supabase } from "@/utils/SupabaseClient";
import Utils from "@/utils/Utils";
import { IResponse } from "@/logic/interfaces/IResponse";
import { useLocalNotificationsStore } from "./local-notifications-store";
import { useAuthStore } from "./auth.store";

export const useConversationsStore = defineStore({
  id: "conversations-store",
  state: () => ({
    my_conversations_realtime: {
      channels: {
        new_current_conversation: {},
        new_conversations: {},
        my_conversations: {},
      },
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
    getCurrentConversation() {
      return this.current_conversation;
    },
    getMyConversationsRealtime() {
      return this.my_conversations_realtime;
    },
    /**
     *
     * @param partner_chat_user_id
     * @param current_chat_user_id
     *
     * function that listen when a new current conversation
     * with an specific partner is created and the current user
     * has the conversation opened.
     *
     */
    async suscribeToNewConversation(
      partner_chat_user_id: number,
      current_chat_user_id: number
    ) {
      let _private_conversation_code =
        partner_chat_user_id + "" + current_chat_user_id;

      this.my_conversations_realtime.channels.new_current_conversation =
        supabase
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
              const local_notifications = useLocalNotificationsStore();
              local_notifications.display({
                title: "Tienes una nueva conversación",
                content: "¡Abrela ahora!",
              });
            }
          )
          .subscribe();
    },
    /**
     * @param chat_user_id
     * function that listen when someone write in
     * a group or a private chat already created
     */
    async suscribeToMyConversations(chat_user_id: number) {
      this.my_conversations_realtime.channels.my_conversations = supabase
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
                "*,last_message:messages(*),flag:chat_users_conversations(id),chat_users_conversations(*,chat_users(*,person:people(*))),groups(*),private_conversation:private_conversations(*)"
              )
              .eq("id", event.new.conversation_id)
              .is("messages.is_last", true)
              .eq("flag.chat_user_id", chat_user_id)
              .single();
            if (error) {
              throw "stop: error updating conversations order";
            }
            const local_notifications = useLocalNotificationsStore();
            local_notifications.display({
              title: "Has recibido un nuevo mensaje",
              content: "¡Contesta ahora!",
            });
            this.my_conversations_realtime.conversation = data;
          }
        )
        .subscribe();
    },

    /**
     * @param chat_user_id
     * Function that listens when someone writes to the
     * current user in a private conversation, or if someone
     * writes in a group to which the current user belongs,
     * and the current user is in the conversations tab (not inside the conversation page)
     */

    async suscribeToNewConversations(chat_user_id: number) {
      this.my_conversations_realtime.channels.new_conversations = supabase
        .channel(chat_user_id + "-conversations-insert")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_users_conversations",
            filter: `chat_user_id=eq.${chat_user_id}`,
          },
          async (event) => {
            let { data, error } = await supabase
              .from("conversations")
              .select(
                "*,last_message:messages(*),flag:chat_users_conversations(id),chat_users_conversations(*,chat_users(*,person:people(*))),groups(*),private_conversation:private_conversations(*)"
              )
              .eq("id", event.new.conversation_id)
              .is("messages.is_last", true)
              .eq("flag.chat_user_id", chat_user_id)
              .single();
            if (error) {
              throw "stop: error updating conversations order";
            }
            const local_notifications = useLocalNotificationsStore();
            local_notifications.display({
              title: "Has recibido un nuevo mensaje",
              content: "¡Contesta ahora!",
            });
            this.my_conversations_realtime.new_conversation = data;
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

    async unsuscribeFromConversationEvents() {
      await supabase.removeAllChannels();
    },
    async sendFirstMessage(text: String = "") {
      //se guarda el mensaje en la bd
      let { data, error } = await supabase.functions.invoke("send-message", {
        body: {
          conversation_type: 1,
          conversation_name: "",
          chat_users_ids: [this.getCurrentConversation().userConversation.id],
          auth_ids: [
            this.getCurrentConversation().userConversation.person.auth_id,
          ],
          content: {
            text,
            files: [],
          },
        },
      });
      if (error) {
        console.log(error);
        throw "error sending first message";
      }
      return {
        data,
      };
    },
    async sendNotFirstMessage(text: String = "") {
      const auth_store = useAuthStore();
      let { data, error } = await supabase.functions.invoke("send-message", {
        body: {
          conversation_id: this.getCurrentConversation().id,
          chat_user_id: auth_store.getUser().chat_user_id,
          content: {
            text,
          },
        },
      });
      if (error) {
        console.log(error);
        throw "error sending not first message";
      }
      return {
        data,
      };
    },
    async sendFilesToConversation(files: Array<any>) {
      let conversation_id;
      let message_id;
      if (this.getCurrentConversation().isEmpty) {
        let { data } = await this.sendFirstMessage();
        console.log(data);
        conversation_id = data.message_info.first_message.conversation_id;
        message_id = data.message_info.first_message.id;
        this.setCurrentConversation({
          id: conversation_id,
          isEmpty: false,
        });
      } else {
        let { data } = await this.sendNotFirstMessage();
        conversation_id = this.getCurrentConversation().id;
        message_id = data.message_info.conversation_answer.id;
      }

      let _files_status = {
        success: [],
        errors: [],
      };

      let _message_files = [];

      const auth_store = useAuthStore();

      for (let i in files) {
        let _file = files[i];
        let access_code = auth_store.getUser().email.split("@")[0];
        const { data, error } = await supabase.storage
          .from("users-files")
          .upload(access_code + "/" + Date.now(), _file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) {
          _files_status.errors.push(error);
        } else {
          //si no hay error se pushea a files.success solo el path
          _files_status.success.push(data.path);

          /*y se agrega al array _files el objeto
              {
                name: string,
                metadata: {
                  mimetype: string
                }
              }
            */
          _message_files.push({
            name: data.path,
            metadata: {
              mimetype: _file.type,
            },
          });
        }
      }
      console.log(_files_status.success);
      console.log({
        message_id,
        conversation_id,
      });
      const { data, error } = await supabase
        .from("message_files")
        .update({
          chat_user_id: auth_store.getUser().chat_user_id,
          message_id,
          conversation_id,
        })
        .in("name", _files_status.success)
        .select("*")
        .single();

      console.log(data);
      Utils.handleErrors(error);
      return {
        data,
      };
    },
    setCurrentConversation(conversations_data: any) {
      this.current_conversation = {
        id: conversations_data.id ?? this.current_conversation.id,
        type: conversations_data.type ?? this.current_conversation.type,
        label: conversations_data.label ?? this.current_conversation.label,
        label_image:
          conversations_data.label_image ??
          this.current_conversation.label_image,
        userConversation:
          conversations_data.userConversation ??
          this.current_conversation.userConversation,
        isEmpty:
          conversations_data.isEmpty ?? this.current_conversation.isEmpty,
        group: conversations_data.group ?? this.current_conversation.group,
        me: conversations_data.me ?? this.current_conversation.me,
        me_uuid:
          conversations_data.me_uuid ?? this.current_conversation.me_uuid,
      };
    },
    async getSignedUrls(files: Array<string>) {
      const { data, error } = await supabase.storage
        .from("users-files")
        .createSignedUrls(files, 30);
      Utils.handleErrors(error);
      return {
        data,
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
