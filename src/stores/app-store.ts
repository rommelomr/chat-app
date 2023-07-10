import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    app_is_loading: false,
  }),

  actions: {
    setAppIsLoading(is_loading: any): void {
      this.app_is_loading = is_loading;
    },
    getAppIsLoading(): boolean {
      return this.app_is_loading;
    },
  },
});
