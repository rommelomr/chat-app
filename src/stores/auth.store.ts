import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
//import LoginService from "../services/services.js";
//import useNotyf from "@/composables/useNotyf.js";
import jwt_decode from "jwt-decode";
import { useRouter } from "vue-router";
import { supabase } from "@/utils/SupabaseClient";


export const useAuthStore = defineStore({
  id: "auth-store",
  state: () => ({
    user: useStorage("auth", {
      id: "",
      token: "",
      refresh_token: "",
      is_logged: false,
      expiration: "",
      role: "",
      email: "",
      photo: "",
      name: "",
    }),
    user_data: {},
    role: {},
  }),

  actions: {

    async attemptLogin() {
      let { data, error } = await supabase.functions.invoke("customLogin", {
        body: {
          email: "00010@messenger.chat",
          password: "messenger.chat.00010",
        },
      });

      if (error) {
        let error_info = await error.context.json();
        console.error(error_info)
        return;
      }

      await supabase.auth.setSession({
        refresh_token: data.refresh_token,
        access_token: data.access_token,
      });

      this.setLogin({
        id: data.user.id,
        token: data.access_token,
        refresh_token: data.refresh_token,
        is_logged: true,
        role: data.user.role,
        email: data.user.email,
      });
     // window.location.assign("/");
      return;
    },
    setLogin(user_data:any) {
      this.$patch({
        user:{
          id: user_data.id,
          token: user_data.token,
          refresh_token: user_data.refresh_token,
          is_logged: true,
          expiration: "",
          role: "",
          email:user_data.email,
          photo: user_data.photo,
          name: user_data.name,
        }
      })
    },
    setUserProperty(property:any, value:any) {
        let _user = this.getProperty("user");
        _user[property] = value;
        this.setProperty("user", _user);
    },
    getUser() {
      return this.user;
    },
    getProperty(property:any):any {
        return null;
    },
    setProperty(property:any, value:any) {
       console.log(property)
    },
  },
});