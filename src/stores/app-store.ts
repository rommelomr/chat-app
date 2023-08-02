import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { supabase } from "@/utils/SupabaseClient";
import { Device } from "@capacitor/device";
import Utils from "@/utils/Utils";
import { Geolocation } from "@capacitor/geolocation";
export const useAppStore = defineStore({
  id: "app-store",
  state: () => ({
    app_is_loading: false,
    app_is_online: true,
    current_device: useStorage("current_device", {
      id_machine: "",
    }),
  }),

  actions: {
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
    setAppIsLoading(is_loading: any): void {
      this.app_is_loading = is_loading;
    },
    async loadingBefore(f: Function) {
      this.setAppIsLoading(true);
      await f();
      this.setAppIsLoading(false);
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
