import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
//import LoginService from "../services/services.js";
//import useNotyf from "@/composables/useNotyf.js";
import jwt_decode from "jwt-decode";
import { useRouter } from "vue-router";
import { supabase } from "@/utils/SupabaseClient";
import { Device } from "@capacitor/device";

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
      email: ""
    }),
    user_data: useStorage("user_data",{}),
  }),

  actions: {
    async attemptLogin(email: string, password: string) {
      let _imei = (await Device.getId()).identifier;

      let { data, error } = await supabase.functions.invoke("appLogin", {
        body: {
          email: `${email}@messenger.chat`,
          password: password + "..",
          imei: _imei,
        },
      });

      if (error) {
        let error_info = await error.context.json();
        console.log(error_info);
        throw "stoppppppppp";
        let _messsage = error_info.verification
          ? error_info.verification.message
          : "Credenciales incorrectas";
        return {
          message: _messsage,
        };
      }

      await supabase.auth.setSession({
        refresh_token: data.session.refresh_token,
        access_token: data.session.access_token,
      });
      this.setLogin({
        id: data.user.id,
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expiration: data.session.expiration,
        is_logged: true,
        role: data.user.role,
        email: data.user.email
      });

      window.location.replace("/tabs/tab1");
      throw "stop";
    },
    setLogin(user_data: any) {
      this.$patch({
        user: {
          id: user_data.id,
          token: user_data.token,
          refresh_token: user_data.refresh_token,
          is_logged: true,
          expiration: user_data.expiration,
          role: user_data.role,
          email: user_data.email,
        }
      });
      this.getProfile();
    },
    setUserProperty(property: any, value: any) {
      let _user = this.getProperty("user");
      _user[property] = value;
      this.setProperty("user", _user);
    },
    getUser() {
      return this.user;
    },
    getProperty(property: any): any {
      return null;
    },
    setProperty(property: any, value: any) {
      console.log(property);
    },
    async getProfile(){
      let { data, error } = await supabase
      .from("people")
      .select('*')
      .eq("auth_id", this.user.id).single();
      this.$patch({
        user_data:{
          ...data
        }
      });
      return data;
    }
  },
});
