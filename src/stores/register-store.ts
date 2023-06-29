import { defineStore } from "pinia";

export const useRegisterStore = defineStore({
  id: "connections-store",
  state: () => ({
    id_machine: "",
  }),
  actions: {
    setIdMachine(id_machine: string) {
      this.id_machine = id_machine;
    },
    obtainIdMachine(): string {
      return Date.now() + "";
    },
    setBrand(id_machine: string) {
      this.id_machine = id_machine;
    },
    obtainBrand(): string {
      return Date.now();
    },
    setModel(id_machine: string) {
      this.id_machine = id_machine;
    },
    obtainModel(): string {
      return Date.now();
    },
    setOperatingSystem(id_machine: string) {
      this.id_machine = id_machine;
    },
    obtainOperatingSystem(): string {
      return Date.now();
    },
    setOSVersion(id_machine: string) {
      this.id_machine = id_machine;
    },
    obtainOSVersion() {
      return Date.now();
    },
    async attemptRegister() {
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
    },
  },
});
