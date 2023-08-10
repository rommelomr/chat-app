import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import { Device } from "@capacitor/device";
import Utils from "@/utils/Utils";
import { Geolocation } from "@capacitor/geolocation";
import { useAuthStore } from "./auth.store";
export const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    app_is_loading: false,
    app_is_online: true,
    current_device: useStorage("current_device", {
      id_machine: "",
    }),
    toast: {
      is_open: false,
      message: "",
    },
  }),

  actions: {
    getToastMessage() {
      return this.toast.message;
    },
    getToastIsOpen() {
      return this.toast.is_open;
    },
    setToast(toast: any) {
      this.toast.is_open = toast.is_open ?? this.toast.is_open;
      this.toast.message = toast.message ?? this.toast.message;
    },
    showToast(message: string) {
      this.setToast({
        is_open: true,
        message,
      });
    },
    setCurrentDevice(current_device: any): void {
      this.current_device.id_machine =
        current_device.id_machine ?? this.current_device.id_machine;
    },
    getCurrentDevice() {
      return this.current_device;
    },
    async storeDeviceInfo() {
      let _id_machine = (await Device.getId()).identifier;
      this.setCurrentDevice({
        id_machine: _id_machine,
      });
    },
    async suscribeToLocation() {
      let _id_machine = this.getCurrentDevice().id_machine;

      let { data, error } = await supabase
        .from("devices")
        .select("id")
        .eq("id_machine", _id_machine)
        .single();
      Utils.handleErrors(error);
      const deviceLocations = supabase
        .channel(`${_id_machine}-geolocation-channel`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "device_locations",
            filter: `device_id=eq.${data.id}`,
          },
          async (payload) => {
            const geolocation = await Geolocation.getCurrentPosition();
            await supabase
              .from("device_locations")
              .update({
                longitude: geolocation.coords.longitude,
                latitude: geolocation.coords.latitude,
              })
              .eq("device_id", data.id)
              .is("latitude", null)
              .is("longitude", null)
              .select("*");
          }
        )
        .subscribe();
    },
    async sendLocationIfRequested(is_loading: any) {
      let _id_machine = this.getCurrentDevice().id_machine;

      let { data, error } = await supabase
        .from("devices")
        .select("id")
        .eq("id_machine", _id_machine)
        .single();
      Utils.handleErrors(error);
      const geolocation = await Geolocation.getCurrentPosition();

      await supabase
        .from("device_locations")
        .update({
          longitude: geolocation.coords.longitude,
          latitude: geolocation.coords.latitude,
        })
        .eq("device_id", data.id)
        .is("latitude", null)
        .is("longitude", null);

      this.app_is_loading = is_loading;
    },
    async refreshLastConnectionDateTime() {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("accounts")
        .update({
          last_connection: new Date().toISOString(),
        })
        .eq("chat_user_id", auth_store.getUser().chat_user_id);
    },
    async updateLastConnection() {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("accounts")
        .update({
          last_connection: new Date().toISOString(),
        })
        .eq("chat_user_id", auth_store.getUser().chat_user_id);
    },
    async updateIAmOnline(is_online: Boolean) {
      const auth_store = useAuthStore();
      let { data, error } = await supabase
        .from("chat_users")
        .update({
          is_online: is_online,
        })
        .eq("id", auth_store.getUser().chat_user_id);
    },
    setAppIsLoading(is_loading: any): void {
      this.app_is_loading = is_loading;
    },
    async loadingBefore(f: Function) {
      this.setAppIsLoading(true);
      await f();
      this.setAppIsLoading(false);
    },
    async verifySessionExpiration() {
      const auth_store = useAuthStore();
      let _session_expires_at = auth_store.getUser().expires_at;
      let _current_date = Math.floor(Date.now() / 1000);
      let remaining_time = _session_expires_at - _current_date;
      setTimeout(async () => {
        let { data, error } = await supabase.auth.refreshSession();
        auth_store.setLogin({
          expires_at: data.session.expires_at,
          refresh_token: data.session.refresh_token,
          token: data.session?.access_token,
        });
      }, remaining_time);
    },
    async loadProfilePhotos() {
      const { data, error } = await supabase.storage
        .from("profile-images")
        .list("");
      Utils.handleErrors(error);
      let _images_names = [] as Array<any>;
      if (data) {
        data.map((image) => {
          _images_names.push(image.name);
        });
      }

      const { data: files_data, error: files_error } = await supabase.storage
        .from("profile-images")
        .createSignedUrls(_images_names, 30);

      return {
        data: files_data,
      };
    },
    getAppIsLoading(): boolean {
      return this.app_is_loading;
    },
    setAppIsOnline(is_online: boolean): void {
      this.app_is_online = is_online;
    },
    getAppIsOnline(): boolean {
      return this.app_is_online;
    },
  },
});
