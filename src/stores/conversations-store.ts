import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    app_is_loading: false,
  }),

  actions: {
    async suscribeToMyConversations(is_loading: any) {
      this.app_is_loading = is_loading;
    },
  },
});
