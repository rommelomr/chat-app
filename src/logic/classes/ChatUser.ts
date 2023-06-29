import { type iPerson } from "../interfaces/iPerson";
import { type iLicense } from "../interfaces/iLicense";
export default class ChatUser {
  private access_code: string = "";
  private username: string = "";
  private gender: string = "";
  private created_at: string = "";
  private deleted_at: string = "";
  private person: iPerson = {} as iPerson;
  private current_license: iLicense = {} as iLicense;
  private is_online: boolean = false;
  private last_connection: string = "";

  constructor(
    access_code: string,
    username: string,
    gender: string,
    created_at: string,
    deleted_at: string,
    person: iPerson,
    current_license: iLicense,
    is_online: boolean,
    last_connection: string
  ) {
    if (access_code) this.setAccessCode(access_code);
    if (username) this.setUsername(username);
    if (gender) this.setGender(gender);
    if (created_at) this.setCreatedAt(created_at);
    if (deleted_at) this.setDeletedAt(deleted_at);
    if (person) this.setPerson(person);
    if (current_license) this.setCurrentLicense(current_license);
    if (is_online) this.setIsOnline(is_online);
    if (last_connection) this.setLastConnection(last_connection);
  }
  setAccessCode(accessCode: string): void {
    this.access_code = accessCode;
  }
  getAccessCode(): string {
    return this.access_code;
  }
  setUsername(username: string): void {
    this.username = username;
  }
  getUsername(): string {
    return this.username;
  }
  setGender(gender: string): void {
    this.gender = gender;
  }
  getGender(): string {
    return this.gender;
  }
  setCreatedAt(createdAt: string): void {
    this.created_at = createdAt;
  }
  getCreatedAt(): string {
    return this.created_at;
  }
  setDeletedAt(deletedAt: string): void {
    this.deleted_at = deletedAt;
  }
  getDeletedAt(): string {
    return this.deleted_at;
  }
  setPerson(person: iPerson): void {
    this.person = person;
  }
  getPerson(): iPerson {
    return this.person;
  }
  setCurrentLicense(current_license: iLicense): void {
    this.current_license = current_license;
  }
  getCurrentLicense(): iLicense {
    return this.current_license;
  }
  setIsOnline(isOnline: boolean): void {
    this.is_online = isOnline;
  }
  getIsOnline(): boolean {
    return this.is_online;
  }
  setLastConnection(lastConnection: string): void {
    this.last_connection = lastConnection;
  }
  getLastConnection(): string {
    return this.last_connection;
  }
}
