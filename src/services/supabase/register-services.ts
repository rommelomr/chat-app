import { supabase } from "@/utils/SupabaseClient";
import Utils from "@/utils/Utils";
const MAX_USERS = 99999;

const CHARACTERS_COUNT = 5;
const CHARACTERS = [
  "J",
  "V",
  "S",
  "0",
  "8",
  "F",
  "O",
  "9",
  "P",
  "1",
  "N",
  "Y",
  "H",
  "2",
  "L",
  "A",
  "R",
  "6",
  "D",
  "E",
  "5",
  "Z",
  "K",
  "C",
  "X",
  "W",
  "U",
  "B",
  "T",
  "Q",
  "4",
  "G",
  "3",
  "M",
  "I",
  "7",
];

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
    console.log("00000000000000000000000000000000000000000000000");
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
    console.log("111111111111111111111111111111111111111111111111111111");
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

  let row = [];
  let num = data[0].count;
  let _aux_characters = CHARACTERS;
  for (let i = 0; i < CHARACTERS_COUNT; i++) {
    let index = num % _aux_characters.length;
    _aux_characters.splice(index, 1);
    row.push(_aux_characters[index]);
    num = Math.floor(num / _aux_characters.length);
  }

  return row.reverse().join("");
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
    console.log("=================================0");
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
  let { data, error } = await supabase.rpc("register_chat_user_test", {
    authid: new_user.id,
    accesscode: access_code,
    brandid: brand_id,
    deviceimei: imei,
    idmachine: id_machine,
    modelid: model_id,
    operatingsystemid: os_id,
    osversionid: os_version_id,
  });

  console.log(data);

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
      window.location.replace("/entercode");
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
    let { data: updated_user_data, error: update_user_error } =
      await supabase.functions.invoke("manageUsers", {
        body: {
          action: "updateUser",
          user_info: {
            ...user,
          },
        },
      });
    Utils.handleErrors(update_user_error);

    let { data, error } = await supabase
      .from("chat_users")
      .update({
        password_is_setted: true,
      })
      .eq(
        "access_code",
        updated_user_data.data.user.email.split("@")[0].toUpperCase()
      );
    Utils.handleErrors(error);
  },
  getChatUserByPhoneImei: async (imei: string) => {
    let { data, error } = await supabase.rpc("get_chat_user_by_phone_imei", {
      phoneimei: imei,
    });
    if (error) {
      throw "stop: get_chat_user_by_phone_imei error at register-services, line 135";
    }
    return {
      success: data ? true : false,
      chat_user: data,
    };
  },
};
