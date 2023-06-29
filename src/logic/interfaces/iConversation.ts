import { type iPerson } from "./iPerson";
import { type iLicense } from "./iLicense";
export interface ChatUser {
  id: number;
  access_code: string;
  username: string;
  gender: string;
  person: iPerson;
  current_license: iLicense;
  is_online: string;
}
