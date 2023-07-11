import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import RegisterServices from "@/services/supabase/register-services";
import Utils from "@/utils/Utils";
import { Device } from "@capacitor/device";
export const useRegisterStore = defineStore({
  id: "connections-store",
  state: () => ({
    created_user: {},
    id_machine: useStorage("id_machine", ""),
    imei: "",
    brand: "",
    model: "",
    os: "",
    os_version: "",
  }),
  actions: {
    setCreatedUser(created_user: any) {
      this.created_user = created_user;
    },
    getCreatedUser() {
      return this.created_user;
    },
    setImei(imei: string) {
      this.imei = imei;
    },
    getImei(): string {
      return this.imei;
    },
    async obtainImei(): Promise<string> {
      return (await Device.getId()).identifier;
    },
    setIdMachine(id_machine: string) {
      this.id_machine = id_machine;
    },
    getIdMachine(): string {
      return this.id_machine;
    },
    async obtainIdMachine(): Promise<string> {
      return (await Device.getId()).identifier;
    },
    setBrand(brand: string) {
      this.brand = brand;
    },
    getBrand(): string {
      return this.brand;
    },
    async obtainBrand(): Promise<string> {
      return (await Device.getInfo()).manufacturer;
    },
    setModel(model: string) {
      this.model = model;
    },
    getModel(): string {
      return this.model;
    },
    async obtainModel(): Promise<string> {
      return (await Device.getInfo()).model;
    },
    setOperatingSystem(os: string) {
      this.os = os;
    },
    getOperatingSystem(): string {
      return this.os;
    },
    async obtainOperatingSystem(): Promise<string> {
      return (await Device.getInfo()).operatingSystem;
    },
    setOSVersion(os_version: string) {
      this.os_version = os_version;
    },
    getOSVersion(): string {
      return this.os_version;
    },
    async obtainOSVersion(): Promise<string> {
      return (await Device.getInfo()).osVersion;
    },
    async attemptRegister() {
      let response = await RegisterServices.signUp(
        this.getImei(),
        this.getIdMachine(),
        this.getBrand(),
        this.getModel(),
        this.getOperatingSystem(),
        this.getOSVersion()
      );
      this.setCreatedUser(response);
    },
    async registerDevice() {
      let _id_machine = await this.obtainIdMachine();
      let _imei = await this.obtainImei();
      let _brand = await this.obtainBrand();
      let _model = await this.obtainModel();
      let _operating_system = await this.obtainOperatingSystem();
      let _os_version = await this.obtainOSVersion();
      this.setIdMachine(_id_machine);
      this.setImei(_imei);
      this.setBrand(_brand);
      this.setModel(_model);
      this.setOperatingSystem(_operating_system);
      this.setOSVersion(_os_version);
      let response = await this.attemptRegister();
      console.log(response);
    },
    async updatePassword(password: string) {
      await RegisterServices.updatePassword({
        auth_id: this.getCreatedUser().person.auth_id,
        data: { password: password + ".." },
      });
    },
    async getChatUserByPhoneImei() {
      let _imei = await this.obtainImei();
      let _chat_user = await RegisterServices.getChatUserByPhoneImei(_imei);
      return _chat_user;
    },
  },
});
