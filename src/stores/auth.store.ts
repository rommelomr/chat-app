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
    user: {
      id: "",
      token: "",
      chat_user_id: -1,
      refresh_token: "",
      expires_at: 0,
      is_logged: false,
      role: "",
      email: "",
    },
    user_data: useStorage("user_data", {}),
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
      let { data: current_chat_user_data, error: current_chat_user_error } =
        await supabase.rpc("get_all_current_chat_user_info");

      if (current_chat_user_error) {
        alert("Ha ocurrido un error inesperado. Vuelva a intentarlo");
        window.location.replace("/");
        throw "stop";
      }
      this.setLogin({
        id: data.user.id,
        chat_user_id: current_chat_user_data.id,
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        is_logged: true,
        role: data.user.role,
        email: data.user.email,
      });
      return {
        succes: true,
      };
    },
    setLogin(user_data: any) {
      this.$patch({
        user: {
          id: user_data.id ?? this.user.id,
          chat_user_id: user_data.chat_user_id ?? this.user.chat_user_id,
          token: user_data.token ?? this.user.token,
          refresh_token: user_data.refresh_token ?? this.user.refresh_token,
          expires_at: user_data.expires_at ?? this.user.expires_at,
          is_logged: user_data.is_logged,
          role: user_data.role ?? this.user.role,
          email: user_data.email ?? this.user.email,
        },
      });
      this.getProfile();
    },
    cleanLogin() {
      this.setLogin({
        id: "",
        token: "",
        chat_user_id: -1,
        refresh_token: "",
        expires_at: 0,
        is_logged: false,
        role: "",
        email: "",
      });
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
    async getProfile() {
      let { data, error } = await supabase
        .from("people")
        .select("*")
        .eq("auth_id", this.user.id)
        .single();
      this.$patch({
        user_data: {
          ...data,
        },
      });
      return data;
    },
    logOut() {
      this.cleanLogin();
      window.location.assign("/");
    },
  },
});
