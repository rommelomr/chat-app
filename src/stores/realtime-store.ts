import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";

export const useRealtimeStore = defineStore({
  id: "realtime-store",
  actions: {
    unsuscribeFromAllChannels() {
      supabase.removeAllChannels();
    },
  },
});
