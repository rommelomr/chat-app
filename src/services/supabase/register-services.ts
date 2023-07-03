import { supabase } from "@/utils/SupabaseClient";
const MAX_USERS = 999999;
const createDevice = (
  brand: string,
  model: string,
  so: string,
  so_version: string
) => {};
const phoneAlreadyRegistered = async (imei: string) => {
  let { data, error } = await supabase
    .from("phones")
    .select("*")
    .eq("imei", imei);
  if (error) {
    console.log("Ha ocurrido un error al verificar si el telefono existe");
    throw "stop";
  }
  return data && data.length > 0;
};
const getNewAccessCode = async () => {
  const { error, count } = await supabase
    .from("chat_users")
    .select("*", { count: "exact" });

  if (error) {
    console.log("error al consultar el numero de usuarios");
    throw "stop";
  }
  if (count > MAX_USERS) {
    console.log("max users reached");
    throw "stop";
  }
  return count.toString().padStart(5, "0");
};
const createUser = async (access_code: string) => {
  let { data, error } = await supabase.functions.invoke("manageUsers", {
    body: {
      action: "createUser",
      user_info: {
        email: access_code + "@messenger.chat",
        password: "messenger.chat." + access_code,
        email_confirm: true,
      },
    },
  });
  if (error) {
    console.log("error al guardar el usuario de chat");
    throw "stop";
  }
  return data;
};
const createChatUser = async (
  new_user: any,
  access_code: string,
  imei: string,
  id_machine: string,
  os: string,
  os_version: string,
  brand: string,
  model: string
) => {
  let { data, error } = await supabase.rpc("register_chat_user", {
    authId: new_user.user.id,
    accessCode: access_code,
    deviceImei: imei,
    idMachine: id_machine,
    operatingSystem: os,
    osVersion: os_version,
    deviceBrand: brand,
    modelId: model,
  });
  if (error) {
    console.log("chat user not created: ", error);
    throw "stop";
  }
  return data;
};

export default {
  signUp: async (
    imei: string,
    id_machine: string,
    brand: string,
    model: string,
    os: string,
    os_version: string
  ) => {
    if (!phoneAlreadyRegistered(imei)) {
      console.log("Este teléfono ya ha sido registrado");
      return;
    }
    let _phone = await createDevice();
    let _access_code = await getNewAccessCode();
    let _new_user = await createUser(_access_code);
    let _new_chat_user = await createChatUser(
      _new_user,
      _access_code,
      imei,
      id_machine,
      os,
      os_version,
      brand,
      model
    );

    console.log(_new_chat_user);
  },
};
