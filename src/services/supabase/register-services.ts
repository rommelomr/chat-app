import { supabase } from "@/utils/SupabaseClient";
const MAX_USERS = 99999;
const createDevice = async (
  brand: string,
  model: string,
  os: string,
  os_version: string
) => {
  let { data, error } = await supabase.rpc("register_device_properties", {
    brand,
    model,
    os,
    os_version,
  });
  console.log(data);
  if (error) {
    console.log("Something went wrong when registering device");
    throw "stop";
  }
  return data;
};
const phoneAlreadyRegistered = async (imei: string) => {
  let { data, error } = await supabase
    .from("phones")
    .select("*")
    .eq("imei", imei);
  if (error) {
    console.log("Something went wrong when verifying if device already exists");
    throw "stop";
  }
  return data && data.length > 0;
};
const getNewAccessCode = async () => {
  const { error, data } = await supabase.from("public_chat_users").select("*");
  if (error) {
    console.log("error al consultar el numero de usuarios");
    throw "stop";
  }
  let max_users_reached = data[0].count > MAX_USERS;
  if (max_users_reached) {
    console.log("max users reached");
    throw "stop";
  }
  return data[0].count.toString().padStart(5, "0");
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
    console.log("Something went wrong when verifying saving chat user");
    throw "stop";
  }
  return data;
};
const createChatUser = async (
  new_user: any,
  access_code: string,
  imei: string,
  id_machine: string,
  brand_id: number,
  model_id: number,
  os_id: number,
  os_version_id: number
) => {
  let { data, error } = await supabase.rpc("register_chat_user", {
    authid: new_user.id,
    accesscode: access_code,
    brandid: brand_id,
    deviceimei: imei,
    idmachine: id_machine,
    modelid: model_id,
    operatingsystemid: os_id,
    osversionid: os_version_id,
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
    if (await phoneAlreadyRegistered(imei)) {
      window.location.assign("/entercode");
      throw "stop";
    }
    let _phone = await createDevice(brand, model, os, os_version);
    let _access_code = await getNewAccessCode();
    let response = await createUser(_access_code);
    let _new_chat_user = await createChatUser(
      response.data.user,
      _access_code,
      imei,
      id_machine,
      _phone.brand_id,
      _phone.model_id,
      _phone.os_id,
      _phone.os_version_id
    );

    return _new_chat_user;
  },
  updatePassword: async (user: any) => {
    let { data, error } = await supabase.functions.invoke("manageUsers", {
      body: {
        action: "updateUser",
        user_info: {
          ...user,
        },
      },
    });
  },
};
