import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import { IPersonConversationFinder, IUserConversationFinder } from "../interfaces";

export interface IMe {
  id: number
  me_id:string
}

export interface ICurrentConversation {
      id: number
      type:string,
      label:string
      label_image:string,
      userConversation?:IUserConversationFinder,
      isEmpty:boolean,
      group:any,
      me:number,
      me_uuid:string
}
export const useCurrentConversation = defineStore({
  id: "current-conversation",
  state: () => ({
    current_conversation: useStorage("current-conversation", {
      id: 0,
      type:"SINGLE",
      label:"xxx",
      label_image:'https://i.pravatar.cc/300',
      userConversation:undefined,
      isEmpty:false,
      group:undefined,
      me:0,
      me_uuid:'_'
    }),
  }),

  actions: {

    ////////SETTERS///////
   async setCurrentConversation(conversation:ICurrentConversation){
      let _me:IMe|undefined = await this.getMe();
      //@ts-ignore
      this.$patch({
        current_conversation:{
          id:conversation.id,
          type:conversation.type,
          label_image:conversation.label_image??'https://i.pravatar.cc/300',
          label:conversation.label,
          userConversation:conversation.userConversation,
          isEmpty:conversation.isEmpty,
          me:_me?.id??0,
          me_uuid:_me?.me_id??''
        }
      })
    },
    setIdConversation(id:number){
      this.$patch({
        current_conversation:{
          id:id,
          isEmpty:false
        }
      })
    },
    async reset(){
      //@ts-ignore
      this.$patch({
        current_conversation:{
          id:0,
          type:'SINGLE',
          label_image:'https://i.pravatar.cc/300',
          label:'Loading..',
          isEmpty:true,
          me:0,
          me_uuid:''
        }
      })
    },
    ////////GETTERS///////
    getCurrentConversation() :ICurrentConversation{
      return this.current_conversation
    },
   async getMe() :Promise<IMe|undefined>{
    try{
      let { data, error } = await supabase.rpc("get_all_current_chat_user_info");
        return {
          id:data.id??0,
          me_id:data.person.user.auth_id
        }
      }catch{
        return{
          id:0,
          me_id:'__'
        }
      }
    }  
  },
});