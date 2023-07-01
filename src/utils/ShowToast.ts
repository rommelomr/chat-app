import {  toastController,ToastOptions } from '@ionic/vue';

const UtilShowToast = async ({
  message,duration,position,color
}:ToastOptions)=>{
    const toast = await toastController.create({
        message:message,
        duration:duration,
        position:position,
        color:color
      });
    await toast.present();
}

export const SuccessToast =(message:string)=>{
  UtilShowToast({
    color:'success',
    message:message,
    position:'top',
    duration:1000
  });
}

export const ErrorToast =(message:string)=>{
  UtilShowToast({
    color:'danger',
    message:message,
    position:'top',
    duration:1000
  });
}