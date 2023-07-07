import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import { IChatGroup, IPersonConversationFinder, IUserConversationFinder } from "../../Conversation/interfaces/index";
import { ChatUser } from "@/logic/interfaces/iChatUser";

export interface IMe {
  id: number
  me_id:string
}

export interface ICurrentGroupsCreate {
      id: number
      name:string,
      photo:string
      users:ChatUser[],
      me:number,
      me_uuid:string
}
export const useNewGroup = defineStore({
  id: "groups",
  state: () => ({
    new_group: useStorage("new-group", {
      id: 0,
      name:"",
      photo:'https://i.pravatar.cc/300',
      users:[],
      me:0,
      me_uuid:'_'
    }),
  }),

  actions: {

    ////////SETTERS///////
   async setNewGroup(group:ICurrentGroupsCreate){
      let _me:IMe|undefined = await this.getMe();
      //@ts-ignore
      this.$patch({
        new_group:{
          id:group.id,
          name:group.name??'',
          photo:group.photo,
          users:group.users,
          me:_me?.id??0,
          me_uuid:_me?.me_id??''
        }
      })
    },
    async setNewGroupList(groups:ChatUser[]){
      //@ts-ignore
      this.$patch({
        new_group:{
          users:groups
        }
      })
    },
    async reset(){
      //@ts-ignore
      this.$patch({
        new_group:{
          id: 0,
          name:"",
          photo:'https://i.pravatar.cc/300',
          users:[],
          me:0,
          me_uuid:'_'
        }
      })
    },
    ////////GETTERS///////
    getNewGroups() :ICurrentGroupsCreate{
      return this.new_group
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