import { defineStore } from "pinia";
import { type Auth } from "@/logic/interfaces/users/users-interfaces";
import AuthServices from "@/services/supabase/auth-services";
import { supabase } from "@/utils/SupabaseClient";
import { useAuthStore } from "./auth.store";
import Utils from "@/utils/Utils";
import { IResponse } from "@/logic/interfaces/IResponse";
export const useConnectionsStore = defineStore({
  id: "connections-store",
  state: () => ({}),
  actions: {},
});
