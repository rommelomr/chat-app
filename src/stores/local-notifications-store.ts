import { defineStore } from "pinia";
import { LocalNotifications } from "@capacitor/local-notifications";
//import Utils from "@/utils/Utils";
//import { IResponse } from "@/logic/interfaces/IResponse";

export const useLocalNotificationsStore = defineStore({
  id: "local-notifications-store",
  state: () => ({}),

  actions: {
    async checkPermissions() {
      await LocalNotifications.checkPermissions().then((e) => {
        console.log(e);
      });
    },
    async display(message: any) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: message.title,
            body: message.content,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) }, // Programa la notificación para 1 segundo después de la invocación
            sound: "/public/assets/mp3/glu.mp3",
            // attachments: null,
            actionTypeId: "",
            extra: null,
          },
        ],
      });
    },
  },
});
