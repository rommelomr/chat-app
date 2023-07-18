import { IResponse } from "@/logic/interfaces/IResponse";
import { supabase } from "@/utils/SupabaseClient";
import Utils from "@/utils/Utils";

export default {
  getProfile: async (auth_id: string) => {
    let { data, error } = await supabase
      .from("people")
      .select("*")
      .eq("auth_id", auth_id)
      .single();
    Utils.handleErrors(error);
    return {
      status: 200,
      action: "GET_PROFILE",
      message: "Profile data obtained successfuly",
      entity: "PEOPLE",
      data,
    };
  },
  updateProfile: async (auth_id: string, profile_data: any) => {
    let { data, error } = await supabase
      .from("people")
      .update(profile_data)
      .eq("auth_id", auth_id)
      .select("*")
      .single();
    Utils.handleErrors(error);
    return {
      status: 200,
      action: "UPDATE_PROFILE",
      message: "Profile data updated successfuly",
      entity: "PEOPLE",
      data,
    };
  },
  updatePassword: async (
    current_password: string,
    password: string
  ): Promise<IResponse> => {
    let { data, error } = await supabase.auth.updateUser({
      password,
    });
    Utils.handleErrors(error);
    return {
      status: 200,
      action: "UPDATE_PASSWORD",
      message: "Profile data updated successfuly",
      entity: "AUTH.USERS",
      data,
    };
  },
};
