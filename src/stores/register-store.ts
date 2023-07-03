import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import RegisterServices from "@/services/supabase/register-services";
import Utils from "@/utils/Utils";
export const useRegisterStore = defineStore({
  id: "connections-store",
  state: () => ({
    id_machine: useStorage("id_machine", ""),
    imei: "",
    brand: "",
    model: "",
    os: "",
    os_version: "",
  }),
  actions: {
    setImei(imei: string) {
      this.imei = imei;
    },
    getImei(): string {
      return this.imei;
    },
    obtainImei(): string {
      let _imei = Math.random() + "";
      return _imei;
    },
    setIdMachine(id_machine: string) {
      this.id_machine = id_machine;
    },
    getIdMachine(): string {
      return this.id_machine;
    },
    obtainIdMachine(): string {
      return Date.now() + "";
    },
    setBrand(brand: string) {
      this.brand = brand;
    },
    getBrand(): string {
      return this.brand;
    },
    obtainBrand(): string {
      let _brands = ["Motorola", "Samsung", "Xiaomi"];
      return _brands[Utils.random(0, _brands.length - 1)];
    },
    setModel(model: string) {
      this.model = model;
    },
    getModel(): string {
      return this.model;
    },
    obtainModel(): string {
      let _models = ["Model 1", "Model 2", "Model 3"];
      return _models[Utils.random(0, _models.length - 1)];
    },
    setOperatingSystem(os: string) {
      this.os = os;
    },
    getOperatingSystem(): string {
      return this.os;
    },
    obtainOperatingSystem(): string {
      let _oss = ["os_1", "os_2", "os_3"];
      return _oss[Utils.random(0, _oss.length - 1)];
    },
    setOSVersion(os_version: string) {
      this.os_version = os_version;
    },
    getOSVersion(): string {
      return this.os_version;
    },
    obtainOSVersion() {
      let _os_versions = ["osv_1", "osv_2", "osv_3"];
      return _os_versions[Utils.random(0, _os_versions.length - 1)];
    },
    async attemptRegister() {
      RegisterServices.signUp(
        this.getImei(),
        this.getIdMachine(),
        this.getBrand(),
        this.getModel(),
        this.getOperatingSystem(),
        this.getOSVersion()
      );
    },
    async register() {
      let _id_machine = this.obtainIdMachine();
      let brand = this.obtainBrand();
      let model = this.obtainModel();
      let operating_system = this.obtainOperatingSystem();
      let os_version = this.obtainOSVersion();
      this.setIdMachine(_id_machine);
      this.setBrand(brand);
      this.setModel(model);
      this.setOperatingSystem(operating_system);
      this.setOSVersion(os_version);
      await this.attemptRegister();
    },
  },
});
